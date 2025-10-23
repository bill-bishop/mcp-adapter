# Developer Notes — Build & TypeScript Issues

This file summarizes the common build and TypeScript errors encountered during MCP Adapter development and how they were resolved.

---

## 1. **ESM vs CommonJS Module Errors**
**Error:** `Unknown file extension ".ts"` or `Cannot find module`.

**Cause:** Node 20 treats `.ts` files as ESM by default when `"type": "module"` is set.

**Fix:** Switched to CommonJS for stability.
```json
{
  "type": "commonjs",
  "scripts": {
    "test": "ts-node-script src/tests/McpAdapter.test.ts"
  }
}
```

---

## 2. **TypeScript TS2571 — Object is of type 'unknown'**
**Error:**
```
error TS2571: Object is of type 'unknown'.
```
**Cause:** `adapter.execute()` returned `unknown` results (due to loose typing).

**Fix:** Explicitly cast results in tests:
```ts
const r0 = results[0] as { name: string; result?: { result: string } };
assert(r0.result?.result.includes("London"));
```

---

## 3. **Type Mismatch — McpServiceSpecification**
**Error:**
```
Argument of type '{ describe: () => { math: ... } }' is not assignable to type 'McpServiceSpecification'.
```
**Cause:** `describe()` must return `{ tools: Record<string, McpTool> }`.

**Fix:** Updated `tests` and `types.ts`:
```ts
export interface McpServiceSpecification {
  describe(): { tools: Record<string, McpTool> };
}
```

---

## 4. **npm not found in sandbox**
**Error:** `/bin/bash: line 1: npm: command not found`

**Cause:** Sandbox lacked Node runtime.

**Fix:** Installed lightweight Node manually or switched to script execution with `ts-node-script`.

---

## 5. **CI Failing Due to ESM Loader Config**
**Error:** Build failed in GitHub Actions using `--loader ts-node/esm`.

**Fix:** Removed `--loader` and replaced with CommonJS + `ts-node-script`.

---

✅ **Summary:**
- Default to **CommonJS** for stability in Node CI.
- Use `ts-node-script` instead of `--loader ts-node/esm`.
- Cast loosely typed results in tests.
- Always return `{ tools }` from `McpServiceSpecification.describe()`.

These steps now yield a stable, reproducible build and test pipeline.