# .env ファイルの内容を環境変数として読み込む
# （docker-compose経由で起動する場合はenv_fileで読み込まれるため必須ではないが、
# 　venvで直接 uvicorn を起動する場合にも動くようにしておく）
from dotenv import load_dotenv

load_dotenv()

# CORSで許可するフロントエンドのオリジンを管理する
# 開発環境が増えたら（本番URLなど）ここに追記していく
ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
