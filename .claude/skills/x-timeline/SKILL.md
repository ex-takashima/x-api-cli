---
name: x-timeline
description: View X (Twitter) timelines. Use when the user says "show my timeline", "check my feed", "what's on X", "show mentions", or wants to see recent posts from their home feed, a specific user, or their mentions.
allowed-tools: Bash
argument-hint: [home|user <username>|mentions] [--max <n>]
---

View timelines on X using the xli CLI.

## Usage

Run one of the following commands from the project root `D:/project/x-api-cli`:

Home timeline (authenticated user's feed):
```
node bin/xli.js timeline home --json
```

User's posts:
```
node bin/xli.js timeline user <username> --json
```

Mentions:
```
node bin/xli.js timeline mentions --json
```

## Rules

1. If `$ARGUMENTS` is empty, default to `home` timeline.
2. Always use `--json` flag to get structured output for parsing.
3. Parse the JSON and present results showing:
   - Author name and @username
   - Post text (full, not truncated)
   - Timestamp (relative, e.g. "2h ago")
   - Engagement metrics
   - Post URL (`https://x.com/i/status/<id>`)
4. Default `--max` is 20. Use `--max 5` for quick summaries.
5. When showing a user's timeline, strip the `@` prefix if the user includes it.

## Examples

```
node bin/xli.js timeline home --max 10 --json
node bin/xli.js timeline user donanywhere2000 --max 5 --json
node bin/xli.js timeline mentions --max 10 --json
```
