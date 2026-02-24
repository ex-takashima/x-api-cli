# xli - X API v2 CLI Tool

## Overview

Modern CLI for X API v2, built with TypeScript + Commander.js + @xdevplatform/xdk.

## Quick Reference

```bash
# Install globally
npm install -g @dondonudonjp/xli

# Or run via npx
npx @dondonudonjp/xli <command>

# Development
npx tsup          # Build
npx tsc --noEmit  # Type check
```

## Available Skills (Slash Commands)

| Skill | Trigger | Description |
|-------|---------|-------------|
| `/x-post` | "tweet", "post to X" | Post a tweet |
| `/x-search` | "search X", "find tweets" | Search posts |
| `/x-timeline` | "show timeline", "my feed" | View timelines |
| `/x-user` | "who is @...", "show profile" | Look up user profiles |
| `/x-view` | "show this tweet" | View a specific post by ID/URL |
| `/x-delete` | "delete tweet" | Delete a post (requires confirmation) |
| `/x-auth` | "login to X", "auth status" | Manage authentication |
| `/x-usage` | "API usage", "credits" | Check API usage stats |

## Authentication

OAuth 2.0 PKCE flow. Credentials stored via `conf` package.
Callback URL: `http://127.0.0.1:8739/callback`

## XDK SDK Conventions

- All SDK methods use **camelCase**: `client.users.getMe()`, `client.posts.searchRecent()`
- Response properties are **camelCase**: `authorId`, `createdAt`, `publicMetrics`
- Options use **camelCase**: `{ tweetFields, userFields, maxResults }`
- Field name arrays use **snake_case strings**: `["created_at", "public_metrics"]`
- Search API `maxResults` minimum is **10**
