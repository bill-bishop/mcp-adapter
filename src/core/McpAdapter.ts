import { McpServiceSpecification, ToolCall, ParseFns } from "./types";

/**
 * Purely functional MCP adapter. Parsing behavior is fully injected.
 */
export class McpAdapter {
  constructor(
    private readonly serviceConfig: McpServiceSpecification,
    private readonly parseFns: ParseFns
  ) {}

  wrapInput(rawInput: string): string {
    const manifest = this.serviceConfig.describe();
    return [
      `<<MCP-SERVICES>>`,
      JSON.stringify(manifest),
      `<</MCP-SERVICES>>`,
      rawInput,
    ].join("\n");
  }

  unwrapOutput(output: string): ToolCall[] {
    const blocks = this.parseFns.extractToolBlocks(output);
    const calls: ToolCall[] = [];

    for (const block of blocks) {
      const name = this.parseFns.extractToolName(block);
      const paramBlock = this.parseFns.extractParamsBlock(block);
      const args = paramBlock ? this.parseFns.parseParams(paramBlock) : {};
      calls.push({ name, args, rawBlock: block });
    }

    return calls;
  }
}