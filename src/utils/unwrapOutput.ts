import {DelimiterConfig, extractToolBlocks, extractParamsBlock, extractToolName, parseParams, ToolCall} from "../core";

export function unwrapOutput(
    output: string,
    config: DelimiterConfig,
): ToolCall[] {
    const blocks = extractToolBlocks(output, config);
    const calls: ToolCall[] = [];

    for (const block of blocks) {
        const name = extractToolName(block);
        const paramBlock = extractParamsBlock(block, config);
        const args = parseParams(paramBlock, config);
        calls.push({ name, args, rawBlock: block });
    }

    return calls;
}