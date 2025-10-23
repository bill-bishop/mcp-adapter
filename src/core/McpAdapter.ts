import { McpServiceSpecification, ToolCall } from "./types";
import { wrapInput, unwrapOutput } from "./parseInternal";
import { executeToolCalls } from "./executeInternal";
import {DELIMITER_CONFIG} from "../config";

/**
 * Functional MCP adapter — orchestrates wrapping/unwrapping and delegates execution.
 */
export class McpAdapter {
  constructor(
    private readonly serviceConfig: McpServiceSpecification
  ) {}

  wrapInput(rawInput: string): string {
    return wrapInput(rawInput, this.serviceConfig, DELIMITER_CONFIG);
  }

  unwrapOutput(output: string): ToolCall[] {
    return unwrapOutput(output, DELIMITER_CONFIG);
  }

  /**
   * Executes a list of ToolCalls using pure functional utility.
   */
  async execute(toolCalls: ToolCall[]): Promise<Record<string, unknown>[]> {
    return executeToolCalls(toolCalls, this.serviceConfig);
  }
}