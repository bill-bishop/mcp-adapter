import assert from "assert";
import {McpAdapter, McpServiceSpecification, McpTool} from "../core";

// --- Microsoft Learn MCP mock ---
const microsoftLearnService: McpServiceSpecification = {
  describe: () => ({
    tools: {
      microsoft_docs_search: {
        description: "Search Microsoft Learn documentation.",
        parameters: { query: "string" },
        async execute(args: Record<string, unknown>) {
          return { searchResult: `Searched Learn docs for '${args.query}'` };
        },
      } as McpTool,
      microsoft_docs_fetch: {
        description: "Fetch a Microsoft Learn document by ID.",
        parameters: { id: "string" },
        async execute(args: Record<string, unknown>) {
          return { document: `Fetched doc with ID '${args.id}'` };
        },
      } as McpTool,
    },
  }),
};

// --- Everything MCP mock ---
const everythingService: McpServiceSpecification = {
  describe: () => ({
    tools: {
      web_fetch: {
        description: "Fetch web resources.",
        parameters: { url: "string" },
        async execute(args: Record<string, unknown>) {
          return { fetchData: `Fetched URL ${args.url}` };
        },
      } as McpTool,
      filesystem_list: {
        description: "List directory contents.",
        parameters: { path: "string" },
        async execute(args: Record<string, unknown>) {
          return { directoryContents: ["file1.txt", "file2.txt"], path: args.path };
        },
      } as McpTool,
    },
  }),
};

// --- Tests ---
(async () => {
  console.log("\n🧩 Integration Test: Microsoft Learn MCP Mock");
  const learnAdapter = new McpAdapter(microsoftLearnService);

  const mockOutput = `
  <<TOOL>>
  microsoft_docs_search
  <<PARAMS>>
  { "query": "Azure Blob Storage" }
  <</PARAMS>>
  <</TOOL>>
  `;

  const toolCalls = learnAdapter.unwrapOutput(mockOutput);
  const results = await learnAdapter.execute(toolCalls);

  assert.equal(results.length, 1);
  const r0 = results[0] as { name: string; result?: { searchResult: string } };
  assert(r0.result?.searchResult.includes("Azure Blob Storage"));
  console.log("✅ Microsoft Learn execute mock successful");

  console.log("\n🧩 Integration Test: Everything MCP Mock");
  const everythingAdapter = new McpAdapter(everythingService);

  const mockEverythingOutput = `
  <<TOOL>>
  web_fetch
  <<PARAMS>>
  { "url": "https://example.com" }
  <</PARAMS>>
  <</TOOL>>
  `;

  const toolCalls2 = everythingAdapter.unwrapOutput(mockEverythingOutput);
  const results2 = await everythingAdapter.execute(toolCalls2);

  assert.equal(results2.length, 1);
  const r1 = results2[0] as { name: string; result?: { fetchData: string } };
  assert(r1.result?.fetchData.includes("https://example.com"));
  console.log("✅ Everything MCP execute mock successful\n");
})();