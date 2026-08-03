# 開発用のPython 3.12 slimイメージを使用（本番用の最適化は今回のMVPでは行わない）
FROM python:3.12-slim

WORKDIR /app

# 依存関係だけ先にコピーしてインストールする
# → requirements.txtが変わらない限りDockerのビルドキャッシュが効き、再ビルドが速くなる
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
# ※ docker-compose.ymlでvolumeマウントする想定のため、開発中はここは主にビルド確認用
COPY . .

EXPOSE 8000

# --reload でコード変更時に自動リロード（開発用オプション。本番では外す）
# main.py がbackend直下にある現状の構成に合わせて "main:app" を指定
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
