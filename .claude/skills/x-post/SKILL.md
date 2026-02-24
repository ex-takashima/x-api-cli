---
name: x-post
description: Post a tweet to X (Twitter). Use when the user says "tweet", "post to X", "post to Twitter", "share on X", or wants to publish text on X.
allowed-tools: Bash
argument-hint: <text> [--reply-to <id>] [--quote <id>]
---

Post a tweet to X using the xli CLI (`@dondonudonjp/xli`).

## Usage

```
npx @dondonudonjp/xli post create "$ARGUMENTS"
```

## Rules

1. If `$ARGUMENTS` is empty, ask the user what they want to post.
2. If the text contains shell-special characters, escape them properly.
3. After posting, show the user the post ID and URL from the output.
4. If the user wants to reply to a tweet, use `--reply-to <id>`.
5. If the user wants to quote tweet, use `--quote <id>`.
6. If the command fails with an auth error, tell the user to run `npx @dondonudonjp/xli auth login --client-id <id>`.

## Examples

Simple post:
```
npx @dondonudonjp/xli post create "Hello from xli!"
```

Reply to a tweet:
```
npx @dondonudonjp/xli post create "Great point!" --reply-to 1234567890
```

Quote tweet:
```
npx @dondonudonjp/xli post create "Check this out" --quote 1234567890
```
