# MCP Adapter

[![Build Status](https://github.com/bill-bishop/mcp-adapter/actions/workflows/build.yml/badge.svg)](https://github.com/bill-bishop/mcp-adapter/actions/workflows/build.yml)

A minimal, functional adapter for Model Context Protocol (MCP) services.  
Supports configurable wrapping, unwrapping, and execution of tool calls.

---

## Features

- 🧱 **Config-driven delimiters** for service, tool, and parameter blocks  
- ⚙️ **Pure functional core** — parsing and execution separated from orchestration  
- 🚀 **Async execution** of defined MCP tools  
- 🧪 Fully tested and CI-verified

---

## Example

```ts
import { McpAdapter } from "./core/McpAdapter";
import { DelimiterConfig } from "./core/types";

const delimiterConfig: DelimiterConfig = {
  service: { start: "<<MCP-SERVICES>>", end: "<</MCP-SERVICES>>" },
  tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
  params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
  format: "json",
};

const serviceConfig = {
  describe: () => ({
    tools: {
      weather: {
        description: "Fetch weather info",
        async execute(args) {
          // In practice: call real service API here
          return { temperature: "22°C", city: args.city };
        },
      },
    },
  }),
};

const adapter = new McpAdapter(serviceConfig, delimiterConfig);

const modelOutput = `
<<TOOL>>
weather
<<PARAMS>>
{ "city": "London" }
<</PARAMS>>
<</TOOL>>
`;

(async () => {
  const toolCalls = adapter.unwrapOutput(modelOutput);
  const results = await adapter.execute(toolCalls);
  console.log(results);
})();
```

Output:
```json
[
  {
    "name": "weather",
    "result": { "temperature": "22°C", "city": "London" }
  }
]
```

---

## Development

```bash
npm install
npm test
```

---

## License
MIT © Bill Bishop