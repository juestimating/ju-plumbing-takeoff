// The /contact prefill from the /samples request slip: only mapped values reach the form.
// Run from the project root: node --import ./tests/forms/register.mjs --test <this file>
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve("src");
const cfg = await import(pathToFileURL(`${ROOT}/components/forms/quote-config.ts`).href);
const q = (s) => cfg.queryDefaults(new URLSearchParams(s));

test("prefill: known project type and sample file", () => {
  assert.deepEqual(q("service=sample-request&type=healthcare&sample=material-list"), {
    projectType: "healthcare",
    notes: "Sample request: a plumbing material list.",
  });
  assert.equal(q("service=sample-request&sample=takeoff").notes, "Sample request: a plumbing takeoff.");
  assert.equal(q("service=sample-request&sample=estimate").notes, "Sample request: a plumbing estimate.");
});
test("prefill: type works without a sample request, sample does not", () => {
  assert.deepEqual(q("type=industrial&sample=takeoff"), { projectType: "industrial", notes: "" });
  assert.deepEqual(q("service=plumbing-takeoff&sample=takeoff"), { projectType: "", notes: "" });
});
test("prefill: unknown or hostile values are ignored, URL text never echoed", () => {
  for (const s of [
    "service=sample-request&type=<script>&sample=<b>hi</b>",
    "service=sample-request&type=Healthcare&sample=Takeoff",
    "service=sample-request&type=constructor&sample=__proto__",
    "service=sample-request&sample=toString",
    "service=sample-request&sample=hasOwnProperty",
    "",
  ]) {
    assert.deepEqual(q(s), { projectType: "", notes: "" }, s);
  }
});
