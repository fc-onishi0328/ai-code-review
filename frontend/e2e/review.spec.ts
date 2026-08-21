import { test, expect } from "@playwright/test";

test.describe("レビュー機能", () => {
    test("未ログイン時のレビュー実行", async ({ page }) => {
        await page.goto("/");
        await page.getByLabel("プログラミング言語", { exact: false }).click();
        await page.getByRole("option", { name: "python" }).click();
        await page.getByLabel("コード", { exact: false }).fill("print('hello')");
        await page.getByRole("button", { name: "レビューを送信" }).click();

        await expect(page.getByText("E2Eテスト用の固定評価です。")).toBeVisible();
    });

    test("ログイン時のレビュー実行は履歴にも反映される", async ({ page, request }) => {
        const email = `e2e-review-${Date.now()}@example.com`;
        const password = "password123";
        await request.post("http://backend:8000/api/auth/register", { data: { email, password } });

        await page.goto("/login");
        await page.getByLabel("メールアドレス", { exact: true }).fill(email);
        await page.getByLabel("パスワード", { exact: true }).fill(password);
        await page.getByRole("button", { name: "ログイン" }).click();
        await expect(page).toHaveURL(/\/$/);

        await page.getByLabel("プログラミング言語", { exact: false }).click();
        await page.getByRole("option", { name: "python" }).click();
        await page.getByLabel("コード", { exact: false }).fill("print('hello')");
        await page.getByRole("button", { name: "レビューを送信" }).click();
        await expect(page.getByText("E2Eテスト用の固定評価です。")).toBeVisible();

        await page.getByRole("link", { name: "履歴" }).click();
        await expect(page.getByText("python")).toBeVisible();
    });

    test("コード未入力の場合、送信ボタンが無効", async ({ page }) => {
        await page.goto("/");
        await page.getByLabel("プログラミング言語", { exact: false }).click();
        await page.getByRole("option", { name: "python" }).click();

        await expect(page.getByRole("button", { name: "レビューを送信" })).toBeDisabled();
    });

    test("言語未選択の場合、送信ボタンが無効", async ({ page }) => {
        await page.goto("/");
        await page.getByLabel("コード", { exact: false }).fill("print('hello')");

        await expect(page.getByRole("button", { name: "レビューを送信" })).toBeDisabled();
    });
});