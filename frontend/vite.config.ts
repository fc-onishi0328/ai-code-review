import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    resolve: {
    alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts",
  },
  server: {
    host: true,          // コンテナの外からアクセスできるようにする（Dockerfileの--hostと対応）
    watch: {
      usePolling: true,  // ファイル変更を一定間隔でチェックする方式に切り替える
      interval: 300,     // チェック間隔（ミリ秒）。標準は100msですが、Windows環境では300ms程度が無難です
    },
  },
})