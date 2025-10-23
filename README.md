# 🧩 MCP Adapter

A minimal, **purely functional** adapter for MCP service specifications. Parsing behavior is fully configurable and swappable — designed for clean separation between data orchestration and string/regex parsing.

---

## ⚙️ Architecture

```
mcp-adapter/
├── src/
│   ├── core/
│   │   ├── McpAdapter.ts     # Core orchestrator (no regex logic)
│   │   ├── parseUtils.ts     # Functional parsing utilities
│   │   ├── types.ts          # Shared type definitions
│   │   └── index.ts          # Barrel export
│   └── tests/
│       └── McpAdapter.test.ts # Functional test using Node assert
└── package.json
```

### Design Principles
| Layer | Responsibility | String/Regex Logic? |
|--------|----------------|---------------------|
| `McpAdapter` | Orchestrates wrapping/unwrapping | ❌ No |
| `parseUtils` | Implements actual text scanning | ✅ Yes |
| `types.ts` | Type definitions & parser contracts | ❌ No |

---

## 🚀 Usage

```bash
# Install dependencies
npm install

# Run tests
npm test
```

---

## 🧠 Example

```ts
import { McpAdapter } from "./core/McpAdapter";
import { buildParseFns } from "./core/parseUtils";
import { DelimiterConfig } from "./core/types";

const config: DelimiterConfig = {
  tool: { start: "<<TOOL>>", end: "<</TOOL>>" },
  params: { start: "<<PARAMS>>", end: "<</PARAMS>>" },
  format: "json",
};

const adapter = new McpAdapter({ describe: () => ({ math: {}, weather: {} }) }, buildParseFns(config));

const output = `
<<TOOL>>\nweather\n<<PARAMS>>{ "city": "London" }<</PARAMS>><</TOOL>>
`;

console.log(adapter.unwrapOutput(output));
```

---

## 🧪 Testing
Uses Node’s built-in `assert` module for simplicity. You can easily swap in Jest, Vitest, or Mocha.

```bash
npm test
```

✅ Expected output:
```
✅ McpAdapter parsing test passed!
```

---

## 🧱 License
MIT © Bill Bishop