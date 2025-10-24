import OpenAI from "openai";
import {McpAdapter, McpServiceSpecification, ToolCall} from "../../src/core";
import {EasyInputMessage, Response, ResponseCreateParamsNonStreaming} from "openai/src/resources/responses/responses";
import {getWeather, GetWeatherRequest} from "../functions/getWeather";
// import {CompletionCreateParamsNonStreaming} from "openai/resources/completions";
/*import {
  // ChatCompletion,
  ChatCompletionCreateParams,
  ChatCompletionMessageParam
} from "openai/resources/chat/completions/completions";*/

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL_CONFIG = {
  model: "gpt-5-nano",
  baseSystemPrompt: "You are a helpful Assistant with tooling capabilities.",
};

const LOGGER = {
  startUp: "🌤  MCP + OpenAI Weather Demo",
  input: "Input",
  output: "Output (Responses API)",
  outputCompletions: "Output (Completions API)",
  noToolCalls: "⚠️ No tool calls detected.",
  toolResults: "✅ Tool Execution Results:",
  exit: "Sample run complete ✅",
};

enum ChatRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  TOOL_RESULT = "system", // ?
}

const serviceConfig: McpServiceSpecification  = {
  describe: () => ({
    tools: {
      weather: {
        description: "Fetch current weather for a given city",
        async execute<GetWeatherResponse>(args: Record<string, string>): Promise<GetWeatherResponse> {
          const request: GetWeatherRequest = { city: args.city };
          return await getWeather(request) as GetWeatherResponse;
        },
      },
    },
  }),
};


async function main(userPrompt: string) {
  const toolAdapter: McpAdapter = new McpAdapter(serviceConfig);
  const systemPrompt: string = toolAdapter.wrapInput(MODEL_CONFIG.baseSystemPrompt);
  let chatHistory: EasyInputMessage[] = [
    { role: ChatRole.SYSTEM, content: systemPrompt },
    { role: ChatRole.USER, content: userPrompt },
  ];
  const responsesCreateRequest: ResponseCreateParamsNonStreaming = {
    input: chatHistory,
    model: MODEL_CONFIG.model,
  }

  // Responses API
  let responses: Response = await client.responses.create(responsesCreateRequest);
  let modelOutput: string = String(responses.output_text);

  // Completions API
  /*  const completionsCreateRequest: ChatCompletionCreateParams = {
      model: MODEL_CONFIG.model,
      messages: chatHistory as ChatCompletionMessageParam[],
    }*/
  // let completions: ChatCompletion = await client.chat.completions.create(completionsCreateRequest);
  // let modelOutput: string = completions.choices.reduce((acc, choice) => acc + choice.message.content, '');

  chatHistory.push({
    role: ChatRole.ASSISTANT,
    content: modelOutput,
  });

  let toolCalls: ToolCall[] = toolAdapter.unwrapOutput(modelOutput);
  if (toolCalls.length > 0) {
    let results: Record<string, unknown>[] = await toolAdapter.execute(toolCalls);
    let resultsStr: string = JSON.stringify(results, null, 2);

    chatHistory.push({
      role: ChatRole.TOOL_RESULT,
      content: resultsStr,
    });

    console.log(LOGGER.startUp);
    console.log(LOGGER.input, chatHistory);
    console.log(LOGGER.output, modelOutput);
    console.log(LOGGER.toolResults, resultsStr);

    // 2nd loop
    responses = await client.responses.create(responsesCreateRequest);
    modelOutput = String(responses.output_text);
  }
  else {
    console.log(LOGGER.noToolCalls);
  }

  console.log(LOGGER.input, chatHistory);
  console.log(LOGGER.output, modelOutput);
  console.log(LOGGER.exit);
}

main("What's the weather like in Phoenix today?").catch(console.error);