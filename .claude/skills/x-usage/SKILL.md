---
name: x-usage
description: Check X API usage statistics and credit consumption. Use when the user says "API usage", "how much API have I used", "credit balance", "rate limits", or wants to monitor their X API consumption.
allowed-tools: Bash
argument-hint: [--days <n>]
---

Check X API usage statistics using the xli CLI (`@dondonudonjp/xli`).

## Usage

```
npx @dondonudonjp/xli usage --json
```

With custom time range:
```
npx @dondonudonjp/xli usage --days 30 --json
```

## Rules

1. Default is 7 days of usage data.
2. Always use `--json` flag for structured output.
3. Present results showing daily usage breakdown if available.
4. Maximum lookback is 90 days.

## Examples

```
npx @dondonudonjp/xli usage --json
npx @dondonudonjp/xli usage --days 30 --json
```
