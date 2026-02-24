# @dondonudonjp/xli

Modern CLI for X API v2 — `gh` CLI のような使いやすい X API ツール。

## Install

```bash
npm install -g @dondonudonjp/xli
```

Or run directly:

```bash
npx @dondonudonjp/xli --help
```

## Setup

1. [X Developer Portal](https://developer.x.com/en/portal/dashboard) でアプリを作成
2. **User authentication settings** で以下を設定:
   - Type of App: `Native App`
   - Callback URL: `http://127.0.0.1:8739/callback`
3. Client ID をコピー

```bash
xli auth login --client-id <YOUR_CLIENT_ID>
```

## Commands

### Authentication

```bash
xli auth login --client-id <id>   # OAuth 2.0 PKCE でログイン
xli auth logout                    # ログアウト
xli auth status                    # 認証状態を確認
xli auth token                     # アクセストークンを出力（スクリプト用）
```

### Posts

```bash
xli post create "Hello from xli!"          # 投稿
xli post create "Reply!" --reply-to <id>    # リプライ
xli post create "Check this" --quote <id>   # 引用ポスト
xli post view <id>                          # 投稿を表示
xli post delete <id>                        # 削除（確認あり）
xli post delete <id> --yes                  # 確認スキップ
```

### Search

```bash
xli search recent "keyword"              # 直近7日間を検索
xli search recent "from:user lang:ja"    # 検索演算子を使用
xli search all "keyword"                 # 全期間検索（Enterprise）
```

### Timeline

```bash
xli timeline home                 # ホームタイムライン
xli timeline user <username>      # ユーザーの投稿一覧
xli timeline mentions             # メンション
```

### User

```bash
xli user me                  # 自分のプロフィール
xli user view <username>     # ユーザープロフィール表示
```

### Usage

```bash
xli usage                # API使用量（直近7日）
xli usage --days 30      # 直近30日
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--json` | JSON 出力（パイプ時は自動） |
| `--no-color` | カラー出力を無効化 |
| `--verbose` | レート制限情報などを表示 |
| `--max <n>` | 最大取得件数 |

## Output

- **TTY（ターミナル）**: 見やすいテーブル形式
- **パイプ / `--json`**: 構造化 JSON（`jq` 等と連携可能）

```bash
# jq でフィルタリング
xli search recent "TypeScript" --json | jq '.data[].text'

# アクセストークンを他のツールで使う
curl -H "Authorization: Bearer $(xli auth token)" https://api.x.com/2/users/me
```

## Claude Code Integration

このプロジェクトには AI エージェント用のスキルが含まれています:

```
/x-post     # ツイート投稿
/x-search   # 検索
/x-timeline # タイムライン表示
/x-user     # ユーザー検索
/x-view     # 投稿表示
/x-delete   # 投稿削除
/x-auth     # 認証管理
/x-usage    # API使用量
```

## Requirements

- Node.js >= 20
- X API OAuth 2.0 Client ID

## License

MIT
