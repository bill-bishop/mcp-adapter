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
    return wrapInput(rawInput, this.serviceConfig);
  }

  unwrapOutput(output: string): ToolCall[] {
    return unwrapOutput(output, this.delimiterConfig, this.serviceConfig);
  }
}