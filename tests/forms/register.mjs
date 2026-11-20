// Test harness for the quote form logic. Registers a resolver that maps the project's "@/" alias and
// extensionless imports to .ts files, and swaps next/headers and next/navigation for stubs.
// Run with `npm test` (Node 22.18 or newer, which strips TypeScript types natively).
import { register } from "node:module";

register("./hooks.mjs", import.meta.url);
