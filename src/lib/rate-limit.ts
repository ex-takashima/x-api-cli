import { printVerbose } from "./output.js";

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export function parseRateLimitHeaders(
  headers: Headers | undefined,
): RateLimitInfo | undefined {
  if (!headers) return undefined;

  const limit = headers.get("x-rate-limit-limit");
  const remaining = headers.get("x-rate-limit-remaining");
  const reset = headers.get("x-rate-limit-reset");

  if (!limit || !remaining || !reset) return undefined;

  return {
    limit: Number(limit),
    remaining: Number(remaining),
    reset: new Date(Number(reset) * 1000),
  };
}

export function logRateLimit(info: RateLimitInfo | undefined): void {
  if (!info) return;
  printVerbose(
    `Rate limit: ${info.remaining}/${info.limit} remaining, resets at ${info.reset.toLocaleTimeString()}`,
  );
}
