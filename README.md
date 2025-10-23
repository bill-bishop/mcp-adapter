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

## Example Usage

See [`sample/openai/index.js`](./sample/openai/index.js) for a complete runnable example using OpenAI and a live weather API.

Run locally:

```bash
npm install openai node-fetch
OPENAI_API_KEY=your-key-here node sample/openai/index.js
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