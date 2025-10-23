export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  rawBlock?: string;
}

export interface DelimiterConfig {
  tool: {
    start: string;
    end: string;
  };
  params: {
    start: string;
    end: string;
  };
  format?: "json" | "text";
}

export interface McpServiceSpecification {
  describe(): Record<string, unknown>;
}

/**
 * Parser utility functions provided via configuration.
 */
export interface ParseFns {
  extractToolBlocks: (output: string) => string[];
  extractToolName: (toolBlock: string) => string;
  extractParamsBlock: (toolBlock: string) => string | null;
  parseParams: (paramBlock: string) => Record<string, unknown>;
}