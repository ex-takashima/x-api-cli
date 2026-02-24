---
name: x-view
description: View a specific post (tweet) on X by its ID or URL. Use when the user says "show this tweet", "view post", "what does this tweet say", or provides a tweet URL or ID to examine.
allowed-tools: Bash
argument-hint: <post-id or URL>
---

View a specific post on X using the xli CLI (`@dondonudonjp/xli`).

## Usage

```
npx @dondonudonjp/xli post view <id> --json
```

## Rules

1. If the user provides a full URL like `https://x.com/username/status/1234567890`, extract the numeric ID from the URL (the last path segment).
2. Always use `--json` flag to get structured output.
3. Present results showing:
   - Author name and @username (from `includes.users`)
   - Full post text
   - Timestamp
   - Engagement metrics (likes, reposts, replies, quotes)
   - Post URL
   - Whether it's a reply or quote tweet (from `referencedTweets`)

## Examples

By ID:
```
npx @dondonudonjp/xli post view 1234567890 --json
```

If user gives URL `https://x.com/someone/status/1234567890`:
```
npx @dondonudonjp/xli post view 1234567890 --json
```
