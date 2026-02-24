---
name: x-user
description: Look up X (Twitter) user profiles. Use when the user says "who is @someone on X", "show profile", "look up user", "check account", or wants to see information about an X user including their bio, follower count, and stats.
allowed-tools: Bash
argument-hint: <username or "me">
---

Look up X user profiles using the xli CLI.

## Usage

Run the following command from the project root `D:/project/x-api-cli`:

View own profile:
```
node bin/xli.js user me --json
```

View another user's profile:
```
node bin/xli.js user view <username> --json
```

## Rules

1. If `$ARGUMENTS` is empty or "me", show the authenticated user's own profile.
2. Otherwise, look up the specified username.
3. Always use `--json` flag to get structured output.
4. Strip `@` prefix from usernames if provided.
5. Present results showing:
   - Display name and @username
   - Bio/description
   - Follower/following/post counts
   - Location (if set)
   - Join date
   - Verified status
   - Profile URL (`https://x.com/<username>`)

## Examples

```
node bin/xli.js user me --json
node bin/xli.js user view elonmusk --json
```
