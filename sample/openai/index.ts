import OpenAI from "openai";
import {McpAdapter, McpServiceSpecification} from "../../src/core";
import fetch from "node-fetch";
import {ResponseCreateParamsNonStreaming} from "openai/src/resources/responses/responses";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface WeatherApiResponse {current_condition: {temp_C: number, weatherDesc: {value: string}[]}[]}

const serviceConfig: McpServiceSpecification  = {
  describe: () => ({
    tools: {
      weather: {
        description: "Fetch current weather for a given city",
        async execute<WeatherToolResult>(args: Record<string, string>): Promise<WeatherToolResult> {
          const city: string = args.g || "London";
          const resp = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
          const data = await resp.json() as WeatherApiResponse;
          const temp = data.current_condition?.[0]?.temp_C;
          const desc = data.current_condition?.[0]?.weatherDesc?.[0]?.value;
          return {city, temperature_C: temp, condition: desc} as WeatherToolResult;
        },
      },
    },
  }),
};

const adapter = new McpAdapter(serviceConfig);

async function main() {
  console.log("🌤  MCP + OpenAI Weather Demo\n");

  const systemPrompt = adapter.wrapInput("");
  const userPrompt = "What's the weather like in Paris today?";
  const modelInput = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const completion = await client.responses.create({
    input: [ ...modelInput ],
    model: "gpt-4.1-mini",
  } as ResponseCreateParamsNonStreaming);

  const modelOutput = completion.output_text || "";
  console.log("--> Model Input:\n", modelInput, "\n");
  console.log("<-- Model Output:\n", modelOutput, "\n");

  const toolCalls = adapter.unwrapOutput(modelOutput);
  if (toolCalls.length === 0) {
    console.log("⚠️ No tool calls detected.");
    return;
  }

  const results = await adapter.execute(toolCalls);
  console.log("✅ Tool Execution Results:\n", JSON.stringify(results, null, 2));
}

main().catch(console.error);