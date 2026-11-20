import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const STUBS = {
  "next/headers": new URL("./stubs/next-headers.mjs", import.meta.url).href,
  "next/navigation": new URL("./stubs/next-navigation.mjs", import.meta.url).href,
};

/** Module resolution hook: maps "@/..." to src/, adds .ts extensions, and stubs the two Next modules the action imports. */
export async function resolve(specifier, context, nextResolve) {
  if (STUBS[specifier]) return { url: STUBS[specifier], shortCircuit: true };
  let spec = specifier;
  if (spec.startsWith("@/")) spec = pathToFileURL(path.join(ROOT, "src", spec.slice(2))).href;
  if (spec.startsWith(".") || spec.startsWith("file:")) {
    try {
      return await nextResolve(spec, context);
    } catch (err) {
      for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
        try {
          return await nextResolve(spec + ext, context);
        } catch {
          // try the next extension
        }
      }
      throw err;
    }
  }
  return nextResolve(spec, context);
}
