import { defaultDelimiterConfig } from "../core/delimiterConfig";
import { McpServiceSpecification, DelimiterConfig, ToolCall } from "./types";
import { wrapInput, unwrapOutput } from "./parseInternal";
import { executeToolCalls } from "./executeInternal";

/**
 * Functional MCP adapter — orchestrates wrapping/unwrapping and delegates execution.
 */
export class McpAdapter {
  constructor(
    private readonly serviceConfig: McpServiceSpecification,
    
  ) {}

  wrapInput(rawInput: string): string {
    return wrapInput(rawInput, this.serviceConfig, defaultDelimiterConfig);
  }

  unwrapOutput(output: string): ToolCall[] {
    return unwrapOutput(output, defaultDelimiterConfig, this.serviceConfig);
  }

  /**
   * Executes a list of ToolCalls using pure functional utility.
   */
  async execute(toolCalls: ToolCall[]): Promise<Record<string, unknown>[]> {
    return executeToolCalls(toolCalls, this.serviceConfig);
  }
}