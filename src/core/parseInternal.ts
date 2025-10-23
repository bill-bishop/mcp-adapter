import { DelimiterConfig, McpServiceSpecification, ToolCall } from "./types";

// --- Pure functional parsing helpers ---

const esc = (str: string) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

export function extractToolBlocks(output: string, config: DelimiterConfig): string[] {
  const { tool } = config;
  const regex = new RegExp(`${esc(tool.start)}([\\s\\S]*?)${esc(tool.end)}`, "g");
  const blocks: string[] = [];
  let match;
  while ((match = regex.exec(output)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

export function extractToolName(toolBlock: string): string {
  const [nameLine] = toolBlock.split("\n");
  return nameLine.trim();
}

export function extractParamsBlock(toolBlock: string, config: DelimiterConfig): string | null {
  const { params } = config;
  const regex = new RegExp(`${esc(params.start)}([\\s\\S]*?)${esc(params.end)}`, "m");
  const match = regex.exec(toolBlock);
  return match ? match[1].trim() : null;
}

export function parseParams(paramBlock: string | null, config: DelimiterConfig): Record<string, unknown> {
  if (!paramBlock) return {};
  if (config.format === "json") {
    try {
      return JSON.parse(paramBlock);
    } catch {
      return { raw: paramBlock };
    }
  }
  return { raw: paramBlock };
}

export function wrapInput(
  rawInput: string,
  serviceConfig: McpServiceSpecification,
  config: DelimiterConfig
): string {
  const manifest = serviceConfig.describe();
  return [
    config.service.start,
    JSON.stringify(manifest),
    config.service.end,
    rawInput,
  ].join("\n");
}

export function unwrapOutput(
  output: string,
  config: DelimiterConfig,
  serviceConfig: McpServiceSpecification
): ToolCall[] {
  const blocks = extractToolBlocks(output, config);
  const calls: ToolCall[] = [];

  for (const block of blocks) {
    const name = extractToolName(block);
    const paramBlock = extractParamsBlock(block, config);
    const args = parseParams(paramBlock, config);
    calls.push({ name, args, rawBlock: block });
  }

  return calls;
}