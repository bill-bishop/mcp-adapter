import OpenAI from "openai";
import { McpAdapter } from "../../src/core/McpAdapter.js";
import { DelimiterConfig } from "../../src/core/types.js";
import fetch from "node-fetch";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  service: { start: "<<MCP-SERVICES>>", end: "<</MCP-SERVICES>>" },
  tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
  params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
  format: "json",
};

const serviceConfig = {
  describe: () => ({
    tools: {
      weather: {
        description: "Fetch current weather for a given city",
        async execute(args) {
          const city = args.city || "London";
          const resp = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
          const data = await resp.json();
          const temp = data.current_condition?.[0]?.temp_C;
          const desc = data.current_condition?.[0]?.weatherDesc?.[0]?.value;
          return { city, temperature_C: temp, condition: desc };
        },
      },
    },
  }),
};


async function main() {
  console.log("🌤  MCP + OpenAI Weather Demo\n");

  const systemPrompt = adapter.wrapInput("");
  const userPrompt = "What's the weather like in Paris today?";

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const modelOutput = completion.output_text || "";
  console.log("🧠 Model Output:\n", modelOutput, "\n");

  const toolCalls = adapter.unwrapOutput(modelOutput);
  if (toolCalls.length === 0) {
    console.log("⚠️ No tool calls detected.");
    return;
  }

  const results = await adapter.execute(toolCalls);
  console.log("✅ Tool Execution Results:\n", JSON.stringify(results, null, 2));
}

main().catch(console.error);