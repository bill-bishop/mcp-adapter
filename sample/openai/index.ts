import OpenAI from "openai";
import {McpAdapter, McpServiceSpecification, ToolCall} from "../../src/core";
import {EasyInputMessage, Response, ResponseCreateParamsNonStreaming} from "openai/src/resources/responses/responses";
// import {getWeather, GetWeatherRequest, GetWeatherResponse} from "../functions/getWeather";
// import {lspPrompt} from "./lspPrompt";
import * as fs from "node:fs/promises";
import * as readline from "node:readline/promises";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

enum ChatRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  TOOL_RESULT = "system", // ?
}

const MODEL_CONFIG = {
  model: "gpt-5-mini",
  baseSystemPrompt: "You are a helpful Assistant with tooling capabilities. Think in concise steps (5 words or less), always restate the current goal and any critical context useful for the current problem which you need to remember, then place a separator #### before your final output.",
  historyLength: 6,
  exitCmd: '/exit',
};


const LOGGER = {
  startUp: "OpenAI Tools Demo",
  input: "Input:\n\t",
  output: "Output:\n\n\t",
  outputCompletions: "Output (Completions API)",
  noToolCalls: "⚠️ No tool calls detected.",
  toolResults: "✅ Tool Execution Results:",
  systemPrompt: "System Prompt:\n\n",
  exit: "Sample run complete ✅",
};

const serviceConfig: McpServiceSpecification = {
  describe: () => ({
    tools: {
      readFileContents: {
        description: "Fetch the contents of a file with { path: string }",
        async execute(args: Record<string, string>): Promise<string> {
          console.log('\t\t [readFileContents] args', args);
          const path: string = args.path;
          return String(await fs.readFile(path));
        },
        // weather: {
        //   description: "Fetch current weather for a given city",
        //   async execute(args: Record<string, string>): Promise<GetWeatherResponse> {
        //     const request: GetWeatherRequest = {city: args.city};
        //     return await getWeather(request);
        //   },
        // },
      },
    },
  }),
};

// export interface ChatMessage {
//   role: ChatRole,
//   content: string,
// }
// async function getModelOutput(systemPrompt: string, userPrompt: string, chatHistory: ChatMessage[]): Promise<ChatMessage> {
//   const content = await getOpenAIResponses(systemPrompt, userPrompt, chatHistory as EasyInputMessage[]);
//   return { role: ChatRole.ASSISTANT, content };
// }

// takes a system metaprompt string, a "user" input string, and a chatHistory: { role: string, content: string }[]
// returns an updated chat history with the new user message and agent response appended, truncated to keepHistoryLength
// the system prompt is appended to the OpenAI call, but not present in the returned chat history - this allows swapping agents with the same chat context
async function getOpenAIResponses(systemPrompt: string, userPrompt: string, chatHistory: EasyInputMessage[], keepHistoryLength: number): Promise<EasyInputMessage[]> {
  const systemPromptMessage: EasyInputMessage = { role: ChatRole.SYSTEM, content: systemPrompt };
  const userPromptMessage: EasyInputMessage = { role: ChatRole.USER, content: userPrompt };

  let nextHistory = [
    ...chatHistory,
    userPromptMessage,
  ];

  const input = [
      systemPromptMessage,
      ...nextHistory,
  ];

  const responsesCreateRequest: ResponseCreateParamsNonStreaming = {
    model: MODEL_CONFIG.model,
    input,
    // temperature: 0.5,
  };
  let responses: Response = await client.responses.create(responsesCreateRequest);

  nextHistory.push({ role: ChatRole.ASSISTANT, content: responses.output_text })

  const toTrimCount: number = Math.max(0, chatHistory.length - keepHistoryLength);

  if (toTrimCount > 0) {
    console.log('\n\n\t\t################## TRUNCATE HISTORY #########################\n\n');
    nextHistory = nextHistory.slice(toTrimCount);
  }

  return nextHistory;
}

async function main(getPrompt: () => Promise<string>) {
  let userPrompt = await getPrompt();
  let chatHistory: EasyInputMessage[] = [];

  console.log(LOGGER.startUp, MODEL_CONFIG.model);
  console.log(LOGGER.input, userPrompt);

  const toolAdapter: McpAdapter = new McpAdapter(serviceConfig);
  const systemPrompt: string = toolAdapter.wrapInput(MODEL_CONFIG.baseSystemPrompt);

  console.log(LOGGER.systemPrompt, systemPrompt);

  // const systemPrompt: string = lspPrompt;

  while (userPrompt !== MODEL_CONFIG.exitCmd) {
    chatHistory = await getOpenAIResponses(systemPrompt, userPrompt, chatHistory, MODEL_CONFIG.historyLength);
    let agentResponse = chatHistory[chatHistory.length - 1];

    console.log(chatHistory);

    let toolCalls: ToolCall[] = toolAdapter.unwrapOutput(String(agentResponse.content));
    if (toolCalls.length > 0) {
      let toolResults: Record<string, unknown>[] = await toolAdapter.execute(toolCalls);
      let toolResultStr: string = JSON.stringify(toolResults, null, 2);
      userPrompt = toolResultStr;

      console.log(LOGGER.toolResults, toolResultStr);
    }
    else {
      console.log(LOGGER.noToolCalls);
    }

    // If no tool result to give the LLM, proceed with User Input loop
    if (toolCalls.length === 0) {
      userPrompt = await getPrompt();
    }
  }

}


async function getUserPrompt(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const name = await rl.question(`\n\nTo exit, type /exit\n\n#>`);
  rl.close();

  return name;
}


main(getUserPrompt).catch(console.error);