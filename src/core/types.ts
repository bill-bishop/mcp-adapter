export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  rawBlock?: string;
}

export interface McpTool {
  description: string;
  parameters?: Record<string, string>;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface DelimiterConfig {
  service: {
    start: string;
    end: string;
  };
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
  describe(): { tools: Record<string, McpTool> };
}