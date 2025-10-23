import {DelimiterConfig, McpServiceSpecification} from "../core";

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