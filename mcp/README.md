# MCP サーバー構成ガイド

このディレクトリには、Claude CodeエージェントチームがGoogle Workspaceを操作するためのMCPサーバー設定が含まれています。

## 概要

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Claude Code   │────▶│   MCP Server    │────▶│ Google Workspace│
│  (エージェント)  │◀────│   (ブリッジ)     │◀────│  (Sheets/Drive) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 推奨MCPサーバー

### 1. Google Sheets + Drive + Docs (包括的)

**[google-docs-mcp](https://github.com/a-bonus/google-docs-mcp)** を推奨

- Google Docs, Sheets, Drive を一つのサーバーで操作可能
- 15種類のタスクをサポート
- OAuth認証でセキュア

### 2. Google Sheets 専用（軽量）

**[mcp-google-sheets](https://github.com/xing5/mcp-google-sheets)**

- Pythonベース、`uvx mcp-google-sheets@latest` で即座に起動
- 読み書き、メタデータ取得に対応

## セットアップ手順

### Step 1: Google Cloud Console でOAuth認証を設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新規プロジェクトを作成（または既存を使用）
3. 「APIとサービス」→「ライブラリ」から以下を有効化:
   - Google Sheets API
   - Google Drive API
   - Google Docs API (オプション)
4. 「認証情報」→「認証情報を作成」→「OAuthクライアントID」
5. アプリケーションの種類: 「デスクトップアプリ」
6. JSONファイルをダウンロード → `credentials.json` として保存

### Step 2: MCPサーバーをインストール

#### オプションA: google-docs-mcp（推奨）

```bash
# リポジトリをクローン
git clone https://github.com/a-bonus/google-docs-mcp.git
cd google-docs-mcp

# 依存関係をインストール
npm install

# ビルド
npm run build

# 認証情報を配置
cp /path/to/credentials.json ./credentials.json
```

#### オプションB: mcp-google-sheets（軽量）

```bash
# uvが必要
pip install uv

# 起動（自動でダウンロード）
uvx mcp-google-sheets@latest
```

### Step 3: Claude Code に MCP を設定

Claude Codeの設定ファイル（`~/.claude/settings.json` または プロジェクトの `.claude/settings.json`）に追加:

```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "node",
      "args": ["/path/to/google-docs-mcp/dist/index.js"],
      "env": {
        "GOOGLE_CREDENTIALS_FILE": "/path/to/credentials.json"
      }
    }
  }
}
```

### Step 4: 初回認証

MCPサーバーを初めて起動すると、ブラウザが開いてGoogleアカウントでの認証を求められます。認証後、トークンがローカルに保存されます。

## 利用可能なツール

### Google Sheets

| ツール | 説明 |
|--------|------|
| `sheets_read` | セル/範囲の読み取り |
| `sheets_write` | セル/範囲への書き込み |
| `sheets_create` | 新規スプレッドシート作成 |
| `sheets_list` | スプレッドシート一覧 |
| `sheets_clear` | 範囲のクリア |

### Google Drive

| ツール | 説明 |
|--------|------|
| `drive_list` | ファイル/フォルダ一覧 |
| `drive_read` | ファイル内容の読み取り |
| `drive_create_folder` | フォルダ作成 |
| `drive_upload` | ファイルアップロード |
| `drive_search` | ファイル検索 |

## セキュリティ考慮事項

1. **credentials.json は絶対にGitにコミットしない** → `.gitignore` に追加済み
2. **最小権限の原則**: 必要なスコープのみを許可
3. **トークンの管理**: `token.json` もコミットしない

## トラブルシューティング

### 認証エラー

```
Error: invalid_grant
```

→ `token.json` を削除して再認証

### スコープ不足

```
Error: Request had insufficient authentication scopes
```

→ Google Cloud Console で必要なAPIを有効化し、再認証

## 参考リンク

- [google-docs-mcp (GitHub)](https://github.com/a-bonus/google-docs-mcp)
- [mcp-google-sheets (GitHub)](https://github.com/xing5/mcp-google-sheets)
- [claude-google-sheets-mcp (GitHub)](https://github.com/ringo380/claude-google-sheets-mcp)
- [Composio Google Sheets MCP](https://composio.dev/toolkits/googlesheets/framework/claude-code)
