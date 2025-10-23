import {DelimiterConfig, esc} from "../core";

export function extractToolBlocks(output: string, config: DelimiterConfig): string[] {
    const { tool } = config;
    const regex = new RegExp(`${esc(tool.start)}([\\s\\S]*?)${esc(tool.end)}`, "g");
    const blocks: string[] = [];
    let match;
    while ((match = regex.exec(output)) !== null) {
        blocks.push(match[1].trim());
    }
    return blocks;
}