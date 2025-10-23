import {DelimiterConfig, esc} from "../core";

export function extractParamsBlock(toolBlock: string, config: DelimiterConfig): string | null {
    const { params } = config;
    const regex = new RegExp(`${esc(params.start)}([\\s\\S]*?)${esc(params.end)}`, "m");
    const match = regex.exec(toolBlock);
    return match ? match[1].trim() : null;
}