export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  rawBlock?: string;
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
  describe(): Record<string, unknown>;
}