# AI Code Review Assistant

AIを活用したコードレビューサービスです。入力したコードをGemini APIが解析し、総合評価・問題点・改善ポイント・修正案・学習ポイントを提示します。ログインすると、レビュー結果が履歴として保存され、後から一覧・詳細を確認できます。

個人学習用に開発しているプロジェクトです（React / FastAPI / Docker / Gemini API連携の学習が目的）。

## 主な機能

- コードレビュー機能（言語・レビュー観点を指定してAIレビューを実行、シンタックスハイライト対応）
- レビュー履歴の保存・一覧表示（ページネーション対応）・詳細表示
- ユーザー認証（新規登録・ログイン・ログアウト、JWTベース）
  - 未ログインでもレビュー機能自体は利用可能（結果は保存されない）
  - 履歴の保存・閲覧はログインユーザーのみ、かつ自分のものだけ表示

## 技術構成

| 分類 | 技術 |
|---|---|
| Frontend | React, TypeScript, Vite, Material UI, React Router, axios |
| Backend | Python, FastAPI, SQLAlchemy, PyJWT, bcrypt |
| AI | Gemini API（`google-genai` SDK） |
| Database | PostgreSQL |
| 開発環境 | Docker, Docker Compose |
| テスト | pytest（backend）、Vitest + React Testing Library（frontend）、Playwright（E2E） |

## ディレクトリ構成

```
ai-code-review/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/routes/       # health, review, history, auth の各エンドポイント
│   │   ├── core/              # config, database, security（JWT・パスワードハッシュ化）
│   │   ├── crud/              # DBの読み書き処理
│   │   ├── models/            # SQLAlchemyのテーブル定義（review, user）
│   │   ├── schemas/           # Pydanticのリクエスト/レスポンス定義
│   │   └── scripts/           # モックデータ投入スクリプト
│   ├── tests/                 # pytestのテストコード
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # ReviewForm, ReviewResult, HistoryTable, Navbar など
│   │   ├── pages/              # ReviewPage, HistoryPage, HistoryDetailPage, LoginPage, RegisterPage
│   │   ├── api/                 # axiosでのAPI呼び出し
│   │   ├── types/               # 型定義
│   │   ├── contexts/            # AuthContext（ログイン状態管理）
│   │   ├── tests/                # Vitest + React Testing Libraryのテストコード
│   │   └── theme.ts             # MUIのテーマ設定
│   ├── e2e/                     # Playwright E2Eテスト
│   ├── playwright.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.e2e.yml     # E2Eテスト実行用の上書き設定（Gemini APIモック化など）
└── .gitignore
```

## セットアップ手順

### 1. 前提条件

- Docker / Docker Compose がインストールされていること（Docker Desktopなど）
- Gemini APIキー（[Google AI Studio](https://aistudio.google.com/)などで取得）

### 2. 環境変数の設定

**`backend/.env`** を作成し、以下を設定してください（`backend/.env.example`をコピーして使うと楽です）。

```
GEMINI_API_KEY=あなたのGemini APIキー
DATABASE_URL=postgresql://postgres:postgres@db:5432/ai_code_review
JWT_SECRET_KEY=ランダムな長い文字列（例: python -c "import secrets; print(secrets.token_hex(32))" で生成）
```

**`frontend/.env`** を作成してください。

```
VITE_API_BASE_URL=http://localhost:8000
```

### 3. 起動

```bash
docker compose up -d --build
```

初回起動時にテーブルが自動作成されます（`users` / `reviews`）。

### 4. アクセス

| URL | 内容 |
|---|---|
| http://localhost:5173 | フロントエンド（React） |
| http://localhost:8000/docs | バックエンドのAPIドキュメント（Swagger UI） |

## テストデータの投入（任意）

動作確認用に、ユーザー・レビュー履歴のモックデータをまとめて投入できます。

```bash
docker compose exec backend python -m app.scripts.seed_data
```

テストユーザー3名（メールアドレス・パスワードは実行時にターミナルへ表示されます）と、それぞれに紐づくレビュー履歴25件が作成されます。

## テストの実行

### backend（pytest）

初回のみ、テスト専用データベースを作成してください。

```bash
docker compose exec db psql -U postgres -c "CREATE DATABASE ai_code_review_test;"
```

テストを実行します。

```bash
docker compose exec backend python -m pytest -v
```

### frontend（Vitest + React Testing Library）

コンポーネント単体・ページ単位のテストです（API通信はモック化しています）。

```bash
docker compose exec frontend npm run test
```

### E2E（Playwright）

実際のbackend・DBまで含めて、ブラウザ操作を再現しながら検証します。Gemini APIは呼び出さず、固定のレビュー結果を返すモックに切り替わります（`MOCK_GEMINI=true`）。

初回のみ、E2E専用データベースを作成してください。

```bash
docker compose exec db psql -U postgres -c "CREATE DATABASE ai_code_review_e2e;"
```

E2E用の設定を重ねてコンテナを起動し、テストを実行します。

```bash
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up -d --build
docker compose exec frontend npx playwright test
```

E2Eテストのシナリオ一覧・優先度は別途「E2Eテスト項目書」にまとめています。

## よくあるトラブル

- **`docker-compose up`で `Cannot connect to the Docker daemon`**：Docker Desktopが起動しているか確認してください
- **frontendのビルドで `package.json` が見つからないエラー**：`docker-compose.yml`があるディレクトリを基準に、`frontend/`・`backend/`それぞれの中身が正しく配置されているか確認してください
- **Playwright実行時に `Executable doesn't exist` エラー**：コンテナ再ビルドでブラウザ本体が消えている状態です。`docker compose exec frontend npx playwright install --with-deps chromium` で入れ直してください
- **E2Eで登録・ログインが失敗する**：PlaywrightのブラウザはDockerコンテナの中で動くため、`localhost`ではbackendに届きません。`docker-compose.e2e.yml`でfrontendの`VITE_API_BASE_URL`を`http://backend:8000`（Docker内のサービス名）に上書きしてください

## 今後の拡張候補

- E2Eテストのシナリオ拡充（現在は主要フローの1本のみ）
- Git差分レビュー
- テストコード生成
- 複数プログラミング言語対応の拡充