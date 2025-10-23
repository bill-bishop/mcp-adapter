# MCP Adapter

[![Build Status](https://github.com/bill-bishop/mcp-adapter/actions/workflows/build.yml/badge.svg)](https://github.com/bill-bishop/mcp-adapter/actions/workflows/build.yml)

A minimal, functional adapter for MCP service specifications.  
Handles wrapping and unwrapping of tool calls using configurable delimiters.

---

## Usage

```ts
import { McpAdapter } from "./core/McpAdapter";
import { DelimiterConfig } from "./core/types";

const delimiterConfig: DelimiterConfig = {
  tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
  params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
  format: "json",
};

const serviceConfig = {
  describe: () => ({
    math: { description: "Basic calculator" },
    weather: { description: "Weather info" },
  }),
};

const adapter = new McpAdapter(serviceConfig, delimiterConfig);

const output = `
<<TOOL>>
weather
<<PARAMS>>
{ "city": "London" }
<</PARAMS>>
<</TOOL>>
`;

console.log(adapter.unwrapOutput(output));
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