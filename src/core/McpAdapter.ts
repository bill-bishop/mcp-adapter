import { McpServiceSpecification, DelimiterConfig, ToolCall } from "./types";
import { wrapInput, unwrapOutput } from "./parseInternal";

/**
 * Functional MCP adapter — orchestrates wrapping/unwrapping using pure utils.
 */
export class McpAdapter {
  constructor(
    private readonly serviceConfig: McpServiceSpecification,
    private readonly delimiterConfig: DelimiterConfig
  ) {}

  wrapInput(rawInput: string): string {
    return wrapInput(rawInput, this.serviceConfig, this.delimiterConfig);
  }

  unwrapOutput(output: string): ToolCall[] {
    return unwrapOutput(output, this.delimiterConfig, this.serviceConfig);
  }

  /**
   * Executes a list of ToolCalls by delegating to the tool definitions in serviceConfig.
   */
  async execute(toolCalls: ToolCall[]): Promise<Record<string, unknown>[]> {
    const manifest = this.serviceConfig.describe();
    const tools = manifest.tools || {};
    const results: Record<string, unknown>[] = [];

    for (const call of toolCalls) {
      const tool = tools[call.name];
      if (tool && typeof tool.execute === "function") {
        try {
          const result = await tool.execute(call.args);
          results.push({ name: call.name, result });
        } catch (err) {
          results.push({ name: call.name, error: String(err) });
        }
      } else {
        results.push({ name: call.name, error: "Tool not found or not executable" });
      }
    }

    return results;
  }
}