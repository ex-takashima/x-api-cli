---
name: x-search
description: Search posts on X (Twitter). Use when the user says "search X", "search Twitter", "find tweets about", "look up posts about", or wants to find posts matching a keyword or query.
allowed-tools: Bash
argument-hint: <query> [--max <n>]
---

Search recent posts on X using the xli CLI.

## Usage

Run the following command from the project root `D:/project/x-api-cli`:

```
node bin/xli.js search recent "$ARGUMENTS" --json
```

## Rules

1. If `$ARGUMENTS` is empty, ask the user what they want to search for.
2. Always use `--json` flag to get structured output for parsing.
3. Parse the JSON output and present results in a readable format to the user, showing:
   - Author username
   - Post text
   - Engagement metrics (likes, reposts, replies)
   - Post URL (construct as `https://x.com/i/status/<id>`)
4. Default `--max` is 10. Respect user's requested count.
5. For advanced search, X API supports operators like `from:username`, `has:media`, `is:reply`, `lang:ja`, etc.

## Examples

Basic search:
```
node bin/xli.js search recent "TypeScript" --max 5 --json
```

Search with operators:
```
node bin/xli.js search recent "from:elonmusk has:media" --json
```

Search Japanese posts:
```
node bin/xli.js search recent "cluster lang:ja" --json
```
