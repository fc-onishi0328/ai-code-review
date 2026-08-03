# AI Code Review Assistant バックエンド設計書

## 1. 概要

AI Code Review Assistantは、利用者が入力したコードをAI（Gemini API）が解析し、レビュー結果（総合評価・問題点・改善ポイント・修正案・学習ポイント）を返すWebサービスである。本書はバックエンド（FastAPI）部分の設計をまとめたものであり、現時点でのMVP実装状況を反映している。

## 2. 技術構成

| 項目 | 使用技術 | 備考 |
|---|---|---|
| Webフレームワーク | Python + FastAPI | 型安全・自動ドキュメント生成（Swagger UI）が利用できる |
| AI連携 | Gemini API（`google-genai` SDK） | Interactions API（2026年6月GA）を使用 |
| 実行環境 | Docker / Docker Compose | frontend/backendを2コンテナで管理する開発用構成 |
| 環境変数管理 | `python-dotenv` + `.env` | APIキーをソースコードに直接記載しない |

## 3. ディレクトリ構成

```
backend/
├── app/
│   ├── main.py                 # エントリーポイント
│   ├── api/
│   │   └── routes/
│   │       ├── health.py       # ヘルスチェック用エンドポイント
│   │       └── review.py       # レビューAPIエンドポイント
│   ├── services/
│   │   └── gemini_service.py   # Gemini API連携ロジック
│   ├── schemas/
│   │   └── review.py           # リクエスト/レスポンスのスキーマ
│   └── core/
│       └── config.py           # 環境変数読み込み・CORS設定
├── requirements.txt
├── .env.example
├── Dockerfile
└── .dockerignore
```

設計方針として、`main.py`はアプリケーションの起動処理（インスタンス生成・ミドルウェア設定・ルーター登録）のみに責務を絞り、実際の処理は`api`（ルーティング）・`services`（外部API連携などのビジネスロジック）・`schemas`（データ構造の定義）・`core`（設定値）に分割している。一般的なFastAPIアプリケーションの構成に沿った、レイヤーごとの責務分離を意識した設計である。

## 4. API設計

### 4.1 GET /api/health

死活監視用のエンドポイント。

**レスポンス**
```json
{
  "status": "ok"
}
```

### 4.2 GET /

ルート確認用のエンドポイント。

**レスポンス**
```json
{
  "message": "AI Code Review API"
}
```

### 4.3 POST /api/review

コードレビューのメインエンドポイント。

**リクエスト**

| フィールド | 型 | 説明 |
|---|---|---|
| `language` | string | プログラミング言語（例: `"python"`） |
| `code` | string | レビュー対象のコード（空文字不可） |
| `review_points` | string[] | レビュー観点（例: `["readability", "security"]`） |

```json
{
  "language": "python",
  "code": "print('hello')",
  "review_points": ["readability"]
}
```

**レスポンス（成功時 / 200）**

| フィールド | 型 | 説明 |
|---|---|---|
| `overall_evaluation` | string | 総合評価 |
| `issues` | string[] | 問題点の一覧 |
| `improvements` | string[] | 改善ポイントの一覧 |
| `suggested_fixes` | string | 修正案 |
| `learning_points` | string[] | 学習ポイントの一覧 |

**エラーレスポンス**

| ステータスコード | 発生条件 |
|---|---|
| 422 | リクエストのバリデーションエラー（`code`が空文字など。FastAPI/Pydanticが自動判定） |
| 502 | Gemini APIの応答がJSONとして解析できなかった場合、またはGemini API呼び出し自体が失敗した場合（APIキー未設定・ネットワークエラーなど） |

## 5. データフロー

```
React(フロントエンド)
  ↓ POST /api/review（language, code, review_points）
FastAPI（review.py）
  ↓ リクエストのバリデーション（Pydantic）
gemini_service.py
  ↓ プロンプトを組み立ててGemini APIへ送信
Gemini API
  ↓ レビュー結果をJSON形式のテキストで返す
gemini_service.py
  ↓ JSONとしてパース
review.py
  ↓ ReviewResponseとして返却
React(フロントエンド)
```

## 6. Gemini API連携の設計

- SDKは`google-genai`（2.3.0以上）を使用し、2026年6月にGA（正式版）となった「Interactions API」（`client.interactions.create()`）で呼び出す
- `genai.Client()`は環境変数`GEMINI_API_KEY`を自動的に読み込むため、コード上でAPIキーを直接扱う箇所はない
- プロンプトには、言語・レビュー対象コード・レビュー観点に加えて、「指定したJSON形式のみで回答する」という出力フォーマットの指示を含めている
- Geminiの応答がコードブロック（` ```json `など）で囲まれて返ってくる場合があるため、パース前に除去する処理を入れている
- JSON解析に失敗した場合は、原因調査のためGeminiから実際に返ってきたテキストをログに出力する

## 7. セキュリティ・環境変数管理

- `GEMINI_API_KEY`は`.env`ファイルに記載し、`.gitignore`でGit管理対象外にしている
- `.env.example`をリポジトリに含めることで、必要な環境変数の項目のみ共有している
- Docker Compose経由で起動する場合は`env_file`で`.env`を読み込み、venvで直接起動する場合は`python-dotenv`が読み込む二重構成にしている

## 8. CORS設定

`app/core/config.py`にて許可オリジンを管理している。

```python
ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

開発環境が増えた場合（本番URLなど）はこのリストに追記する想定。

## 9. Docker構成

- `backend`と`frontend`をそれぞれ独立したコンテナとして`docker-compose.yml`で管理
- 開発中のホットリロードを効かせるため、ソースコードをvolumeマウントする方式を採用（本番用のマルチステージビルド等は今回のMVPでは行わない）
- `backend`コンテナは`uvicorn app.main:app --reload`でポート8000番で起動

## 10. 現時点での実装・動作確認状況

- ディレクトリ構成整理（`app/`配下への分割）：完了、動作確認済み
- CORS設定：完了、動作確認済み
- `/api/health`：完了、動作確認済み
- `/api/review`（スキーマ設計・バリデーション）：完了、正常系(200)・異常系(422)とも動作確認済み
- Gemini API連携：完了、実際のレビュー結果が返ってくることを確認済み
- Docker環境：ビルド成功、`localhost:5173`（frontend）・`localhost:8000`（backend）とも疎通確認済み

## 11. 今後の拡張候補（本MVPでは未実装）

- レビュー履歴保存（PostgreSQL）
- ユーザー認証
- GitHub連携
- Git差分レビュー
- テストコード生成
- 複数プログラミング言語対応
