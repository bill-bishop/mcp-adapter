import {DelimiterConfig} from "../core";

export function parseParams(paramBlock: string | null, config: DelimiterConfig): Record<string, string> {
    if (!paramBlock) return { raw: 'no paramBlock', config: JSON.stringify(config) };
    try {
        return JSON.parse(paramBlock);
    } catch {
        return { raw: paramBlock };
    }
}