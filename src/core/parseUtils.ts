import { DelimiterConfig } from "./types";

/**
 * Factory that builds parsing functions based on a delimiter configuration.
 */
export function buildParseFns(config: DelimiterConfig) {
  const { tool, params, format } = config;

  // Escape regex special chars
  const esc = (str: string) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

  const toolRegex = new RegExp(`${esc(tool.start)}([\\s\\S]*?)${esc(tool.end)}`, "g");
  const paramsRegex = new RegExp(`${esc(params.start)}([\\s\\S]*?)${esc(params.end)}`, "m");

  return {
    extractToolBlocks(output: string): string[] {
      const blocks: string[] = [];
      let match;
      while ((match = toolRegex.exec(output)) !== null) {
        blocks.push(match[1].trim());
      }
      return blocks;
    },

    extractToolName(toolBlock: string): string {
      const [nameLine] = toolBlock.split("\n");
      return nameLine.trim();
    },

    extractParamsBlock(toolBlock: string): string | null {
      const match = paramsRegex.exec(toolBlock);
      return match ? match[1].trim() : null;
    },

    parseParams(paramBlock: string): Record<string, unknown> {
      if (!paramBlock) return {};
      if (format === "json") {
        try {
          return JSON.parse(paramBlock);
        } catch {
          return { raw: paramBlock };
        }
      }
      return { raw: paramBlock };
    },
  };
}