import {McpServiceSpecification, ToolCall} from "../core";

export async function executeToolCalls(
    toolCalls: ToolCall[],
    serviceConfig: McpServiceSpecification
): Promise<Record<string, unknown>[]> {
    const manifest = serviceConfig.describe();
    const tools = manifest.tools || {};
    const results: Record<string, unknown>[] = [];

    for (const call of toolCalls) {
        const tool = tools[call.name];
        if (tool && typeof tool.execute === "function") {
            try {
                const result = await tool.execute(call.args);
                results.push({ name: call.name, result });
            } catch (err) {
                results.push({ name: call.name, error: String(err) });
            }
        } else {
            results.push({ name: call.name, error: "Tool not found or not executable" });
        }
    }

    return results;
}