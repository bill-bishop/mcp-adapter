import { wrapInput, unwrapOutput, executeToolCalls, McpServiceSpecification, ToolCall, DELIMITER_CONFIG } from "./";

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

  async execute(toolCalls: ToolCall[]): Promise<Record<string, unknown>[]> {
    return executeToolCalls(toolCalls, this.serviceConfig);
  }
}