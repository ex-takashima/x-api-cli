---
name: x-auth
description: Manage X API authentication. Use when the user says "login to X", "authenticate", "check X auth status", "X token", or needs to set up or verify their X API credentials.
allowed-tools: Bash
argument-hint: [login --client-id <id>|logout|status|token]
---

Manage X API authentication using the xli CLI (`@dondonudonjp/xli`).

## Usage

Check auth status:
```
npx @dondonudonjp/xli auth status --json
```

Login (opens browser for OAuth):
```
npx @dondonudonjp/xli auth login --client-id <CLIENT_ID>
```

Logout:
```
npx @dondonudonjp/xli auth logout
```

Get access token (for scripting):
```
npx @dondonudonjp/xli auth token
```

## Rules

1. If `$ARGUMENTS` is empty, default to `status` to check current auth.
2. For `login`, the user MUST provide a Client ID. If they don't have one:
   - Direct them to https://developer.x.com/en/portal/dashboard
   - They need to create an app with callback URL `http://127.0.0.1:8739/callback`
3. The `login` command opens a browser - warn the user it will open a browser window.
4. The `token` command outputs only the raw access token (useful for piping to other tools).
5. Client ID can also be set via the `XLI_CLIENT_ID` environment variable.

## Examples

```
npx @dondonudonjp/xli auth status --json
npx @dondonudonjp/xli auth login --client-id YOUR_CLIENT_ID
npx @dondonudonjp/xli auth logout
npx @dondonudonjp/xli auth token
```
