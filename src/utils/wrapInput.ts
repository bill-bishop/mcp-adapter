import { McpServiceSpecification, DelimiterConfig } from "../core";

/**
 * Builds a model-ready system prompt with:
 *  - The MCP manifest (tool definitions)
 *  - Dynamic instructions showing how to call tools using configured delimiters
 */
export function wrapInput(
    rawInput: string,
    serviceConfig: McpServiceSpecification,
    config: DelimiterConfig
): string {
    const manifest = serviceConfig.describe();

    const { tool, params } = config;

    const instruction = `
When you need to use a tool, append the calls to the end of your output:

${tool.start}
tool_name
${params.start}
{ 
  "paramKeyA": "paramValueA",
  "paramKeyB": "paramValueB",
}
${params.end}
${tool.end}

The tool result will be returned to you in the next input, at which point you can finish your final user-facing response.

Example:
User input: check the weather in London!

Assistant: Sure thing, checking now ... 
${tool.start}
weather
${params.start}
{ "city": "London" }
${params.end}
${tool.end}
`;

    return [
        config.service.start,
        JSON.stringify(manifest, null, 2),
        config.service.end,
        instruction.trim(),
        "\n",
        rawInput,
    ].join("\n");
}
