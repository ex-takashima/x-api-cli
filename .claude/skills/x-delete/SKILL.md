---
name: x-delete
description: Delete a post (tweet) from X. Use when the user says "delete tweet", "remove post", "delete my post". Always confirm with the user before deleting.
disable-model-invocation: true
allowed-tools: Bash
argument-hint: <post-id>
---

Delete a post on X using the xli CLI (`@dondonudonjp/xli`).

## Usage

```
npx @dondonudonjp/xli post delete <id> --yes --json
```

## Rules

1. ALWAYS confirm with the user before executing the delete command. Show them the post ID and ask "Are you sure you want to delete post <id>?"
2. Only proceed after explicit user confirmation.
3. Use `--yes` flag to skip the CLI's own confirmation prompt (since we already confirmed with the user).
4. If the user provides a URL, extract the numeric post ID from it.
5. After deletion, confirm success to the user.

## Examples

```
npx @dondonudonjp/xli post delete 1234567890 --yes --json
```
