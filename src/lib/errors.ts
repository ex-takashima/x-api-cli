import { ApiError } from "@xdevplatform/xdk";

export class AuthRequiredError extends Error {
  constructor() {
    super("Not authenticated. Run `xli auth login` first.");
    this.name = "AuthRequiredError";
  }
}

export class TokenExpiredError extends Error {
  constructor() {
    super("Token expired and refresh failed. Run `xli auth login` again.");
    this.name = "TokenExpiredError";
  }
}

export function formatApiError(error: unknown): string {
  if (error instanceof AuthRequiredError) {
    return error.message;
  }

  if (error instanceof ApiError) {
    const status = error.status;
    switch (status) {
      case 401:
        return "Authentication failed. Run `xli auth login` to re-authenticate.";
      case 403:
        return "Forbidden. Your token may lack the required scopes. Try `xli auth login` with appropriate permissions.";
      case 404:
        return "Not found. The requested resource does not exist.";
      case 429: {
        const resetHeader = error.headers?.get?.("x-rate-limit-reset");
        if (resetHeader) {
          const resetTime = new Date(Number(resetHeader) * 1000);
          return `Rate limited. Resets at ${resetTime.toLocaleTimeString()}.`;
        }
        return "Rate limited. Please wait and try again.";
      }
      default: {
        const detail = error.data ? JSON.stringify(error.data) : error.message;
        return `API error (${status}): ${detail}`;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function handleError(error: unknown): never {
  console.error(`Error: ${formatApiError(error)}`);
  process.exit(1);
}
