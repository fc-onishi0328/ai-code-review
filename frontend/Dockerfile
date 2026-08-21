# 開発用のNode 20 slimイメージを使用
FROM node:20-slim

WORKDIR /app

# package.jsonだけ先にコピーしてインストール（ビルドキャッシュを効かせるため）
COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps chromium

# アプリケーションコードをコピー
# ※ docker-compose.ymlでvolumeマウントする想定のため、開発中はここは主にビルド確認用
COPY . .

EXPOSE 5173

# --host 0.0.0.0 を付けないと、コンテナの外（ホストPCのブラウザ）からアクセスできない
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
