import {DelimiterConfig} from "../core";

export function parseParams(paramBlock: string | null, config: DelimiterConfig): Record<string, string> {
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