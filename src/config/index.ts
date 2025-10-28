import {DelimiterConfig} from "../core";

export const DELIMITER_CONFIG: DelimiterConfig = {
    service: { start: "# TOOLING HANDSHAKE:\n", end: "" },
    tool: { start: "<call>", end: "</call>" },
    params: { start: "<parameter>", end: "</parameter>" },
    format: "json",
};