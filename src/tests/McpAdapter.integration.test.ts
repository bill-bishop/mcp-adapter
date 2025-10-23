import assert from "assert";
import { McpAdapter } from "../core/McpAdapter";
import { DelimiterConfig } from "../core/types";

// --- Shared delimiter configuration ---
const config: DelimiterConfig = {
  service: { start: "<<MCP-SERVICES>>", end: "<</MCP-SERVICES>>" },
  tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
  params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
  format: "json",
};

// --- Microsoft Learn MCP mock ---
const microsoftLearnService = {
  describe: () => ({
    tools: {
      microsoft_docs_search: {
        description: "Search Microsoft Learn documentation.",
        parameters: { query: "string" },
      },
      microsoft_docs_fetch: {
        description: "Fetch a Microsoft Learn document by ID.",
        parameters: { id: "string" },
      },
    },
  }),
};

// --- Everything MCP mock ---
const everythingService = {
  describe: () => ({
    tools: {
      web_fetch: { description: "Fetch web resources.", parameters: { url: "string" } },
      filesystem_list: {
        description: "List directory contents.",
        parameters: { path: "string" },
      },
    },
  }),
};

// --- Tests ---
console.log("\n🧩 Integration Test: Microsoft Learn MCP Mock");
const learnAdapter = new McpAdapter(microsoftLearnService, config);
const learnWrapped = learnAdapter.wrapInput("Search for Azure Blob Storage");
assert(learnWrapped.includes("microsoft_docs_search"));
assert(learnWrapped.includes(config.service.start));
assert(learnWrapped.includes(config.service.end));
console.log("✅ Microsoft Learn mock wrapping successful");

console.log("\n🧩 Integration Test: Everything MCP Mock");
const everythingAdapter = new McpAdapter(everythingService, config);
const everythingWrapped = everythingAdapter.wrapInput("List /tmp");
assert(everythingWrapped.includes("web_fetch"));
assert(everythingWrapped.includes(config.service.start));
assert(everythingWrapped.includes(config.service.end));
console.log("✅ Everything MCP mock wrapping successful\n");