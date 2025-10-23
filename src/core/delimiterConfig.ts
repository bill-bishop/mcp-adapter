import { DelimiterConfig } from "./types";

export const defaultDelimiterConfig: DelimiterConfig = {
  service: { start: "<<MCP-SERVICES>>", end: "<</MCP-SERVICES>>" },
  tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
  params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
  format: "json",
};
