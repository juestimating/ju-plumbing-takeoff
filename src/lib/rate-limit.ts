/**
 * In-memory sliding-window rate limiter.
 *
 * SERVERLESS CAVEAT: the counters live in this module's memory. On Vercel and any other serverless or
 * multi-instance host, each instance keeps its own copy and instances are recycled, so the limit is best
 * effort: it stops a burst that lands on one warm instance, not a patient or distributed sender. For a hard
 * limit, back `consume` with a shared store (Redis, Upstash, Vercel KV) or turn on the host's firewall rate
 * limiting. Callers only use `consume`, so swapping the store means rewriting this one file.
 */

type Entry = { hits: number[]; windowMs: number };

const store = new Map<string, Entry>();
const MAX_KEYS = 10_000;
const SWEEP_EVERY_MS = 60_000;
let lastSweep = 0;

export type RateResult =
  /** Allowed. Call `undo()` if the work that this hit was reserved for did not happen. */
  | { ok: true; undo: () => void }
  | { ok: false; retryAfterMs: number };

/**
 * Records one hit for `key` unless `limit` hits already fall inside the last `windowMs`. The hit is
 * reserved immediately (no await between check and record), so concurrent requests cannot all slip through.
 */
export function consume(key: string, limit: number, windowMs: number, now = Date.now()): RateResult {
  sweep(now);
  const entry = store.get(key) ?? { hits: [], windowMs };
  entry.windowMs = windowMs;
  entry.hits = entry.hits.filter((t) => t > now - windowMs);
  store.set(key, entry);
  if (entry.hits.length >= limit) {
    return { ok: false, retryAfterMs: Math.max(0, (entry.hits[0] ?? now) + windowMs - now) };
  }
  entry.hits.push(now);
  return {
    ok: true,
    undo: () => {
      const i = entry.hits.lastIndexOf(now);
      if (i >= 0) entry.hits.splice(i, 1);
    },
  };
}

/** Drops expired keys now and then, and the oldest keys if a flood of unique keys fills the map. */
function sweep(now: number) {
  if (store.size < MAX_KEYS && now - lastSweep < SWEEP_EVERY_MS) return;
  lastSweep = now;
  for (const [key, entry] of store) {
    if (!entry.hits.some((t) => t > now - entry.windowMs)) store.delete(key);
  }
  if (store.size >= MAX_KEYS) {
    for (const key of store.keys()) {
      store.delete(key);
      if (store.size < MAX_KEYS * 0.9) break;
    }
  }
}
