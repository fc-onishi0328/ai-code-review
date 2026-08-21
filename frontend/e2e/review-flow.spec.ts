import { test, expect } from "@playwright/test";

test("新規登録からレビュー実行、履歴確認までの一連の流れ", async ({ page }) => {
    // ユーザーごとに重複しないよう、実行のたびに違うメールアドレスを作る
    const email = `e2e-${Date.now()}@example.com`;
    const password = "password123";

    // 1. 新規登録
    await page.goto("/register");
    await page.getByLabel("メールアドレス", { exact: true }).fill(email);
    await page.getByLabel("パスワード", { exact: true }).fill(password);
    await page.getByLabel(/パスワード.*再入力/).fill(password);
    await page.getByRole("button", { name: "登録", exact: true }).click();

    // 2. /login にリダイレクトされる
    await expect(page).toHaveURL(/\/login$/);

    // 3. 今登録したアカウントでログイン
    await page.getByLabel("メールアドレス", { exact: true }).fill(email);
    await page.getByLabel("パスワード", { exact: true }).fill(password);
    await page.getByRole("button", { name: "ログイン" }).click();

    // 4. / にリダイレクトされる
    await expect(page).toHaveURL(/\/$/);

    // 5. コードを入力してレビュー実行
    await page.getByLabel("プログラミング言語", { exact: false }).click();
    await page.getByRole("option", { name: "python" }).click();
    await page.getByLabel("コード", { exact: false }).fill("print('hello')");
    await page.getByRole("button", { name: "レビューを送信" }).click();

    // 6. レビュー結果が表示される(MOCK_GEMINIの固定文言で確認)
    await expect(page.getByText("E2Eテスト用の固定評価です。")).toBeVisible();

    // 7. 履歴一覧に反映されているか確認
    await page.getByRole("link", { name: "履歴" }).click();
    await expect(page).toHaveURL(/\/history$/);
    await expect(page.getByText("python")).toBeVisible();
});