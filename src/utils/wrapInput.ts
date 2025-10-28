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
If you decide to call tools, DO NOT ADD OUTPUT after ${tool.end}

${tool.start}
tool_name
${params.start}
{ 
  "paramKeyA": "paramValueA",
  "paramKeyB": "paramValueB",
}
${params.end}
${tool.end}

Ensure opening and closing delimiters are properly placed. The tool result will be returned to you in the next input, at which point you can finish your final user-facing response.

Example:
User: check the weather in London!

Assistant: 
${tool.start}
weather
${params.start}
{ "city": "Boiling Pointe" }
${params.end}
${tool.end}

System:
{ temp_F: 212, temp_C: 100 }

Assistant:
The temperature in Boiling Pointe is 100 Celsius, or 212 degrees Farenheight
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
