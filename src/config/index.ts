import {DelimiterConfig} from "../core";

export const DELIMITER_CONFIG: DelimiterConfig = {
    service: { start: "<<MCP-SERVICES>>", end: "<</MCP-SERVICES>>" },
    tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
    params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
    format: "json",
};