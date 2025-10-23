
export function extractToolName(toolBlock: string): string {
    const [nameLine] = toolBlock.split("\n");
    return nameLine.trim();
}