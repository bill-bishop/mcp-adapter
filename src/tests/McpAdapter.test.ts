import assert from "assert";
import { McpAdapter } from "../core/McpAdapter";
import { DelimiterConfig } from "../core/types";

const config: DelimiterConfig = {
  tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
  params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
  format: "json",
};

const serviceConfig = {
  describe: () => ({
    math: { description: "Basic calculator" },
    weather: { description: "Weather info" },
  }),
};

const adapter = new McpAdapter(serviceConfig, config);

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

const toolCalls = adapter.unwrapOutput(modelOutput);

assert.equal(toolCalls.length, 2);
assert.deepStrictEqual(toolCalls[0].name, "weather");
assert.deepStrictEqual(toolCalls[0].args, { city: "London" });
assert.deepStrictEqual(toolCalls[1].name, "math");
assert.deepStrictEqual(toolCalls[1].args, { expression: "2 + 2" });

console.log("✅ McpAdapter parsing test passed!");