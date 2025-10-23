import assert from "assert";
import { McpAdapter } from "../core/McpAdapter";

  service: { start: "<<MCP-SERVICES>>", end: "<</MCP-SERVICES>>" },
  tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
  params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
  format: "json",
};

const serviceConfig: McpServiceSpecification = {
  describe: () => ({
    tools: {
      math: {
        description: "Basic calculator",
        async execute(args) {
          return { mathResult: `Evaluated: ${args.expression}` };
        },
      },
      weather: {
        description: "Weather info",
        async execute(args) {
          return { weatherData: `Weather for ${args.city}` };
        },
      },
    },
  }),
};

const adapter = new McpAdapter(serviceConfig;

// Verify wrapInput includes service delimiters
const wrapped = adapter.wrapInput("raw-input");


assert(wrapped.includes("raw-input"));
assert(wrapped.includes("math"));
assert(wrapped.includes("weather"));

// Mock model output with two tool calls
const modelOutput = `
<<TOOL>>
weather
<<PARAMS>>
{ "city": "London" }
<</PARAMS>>
<</TOOL>>

some unrelated text

<<TOOL>>
math
<<PARAMS>>
{ "expression": "2 + 2" }
<</PARAMS>>
<</TOOL>>
`;

(async () => {
  const toolCalls = adapter.unwrapOutput(modelOutput);

  assert.equal(toolCalls.length, 2);
  assert.deepStrictEqual(toolCalls[0].name, "weather");
  assert.deepStrictEqual(toolCalls[0].args, { city: "London" });
  assert.deepStrictEqual(toolCalls[1].name, "math");
  assert.deepStrictEqual(toolCalls[1].args, { expression: "2 + 2" });

  const results = await adapter.execute(toolCalls);

  const r0 = results[0] as { name: string; result?: { weatherData: string } };
  const r1 = results[1] as { name: string; result?: { mathResult: string } };

  assert.equal(results.length, 2);
  assert(r0.result?.weatherData.includes("London"));
  assert(r1.result?.mathResult.includes("2 + 2"));

  console.log("✅ McpAdapter parsing + execution test passed!");
})();