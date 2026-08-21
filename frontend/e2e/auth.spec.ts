import { test, expect } from "@playwright/test";

test.describe("認証", () => {
    test("新規登録：正常系", async ({ page }) => {
        const email = `e2e-auth-${Date.now()}@example.com`;

        await page.goto("/register");
        await page.getByLabel("メールアドレス", { exact: true }).fill(email);
        await page.getByLabel("パスワード", { exact: true }).fill("password123");
        await page.getByLabel(/パスワード.*再入力/).fill("password123");
        await page.getByRole("button", { name: "登録", exact: true }).click();

        await expect(page).toHaveURL(/\/login$/);
    });

    test("ログイン：正常系", async ({ page, request }) => {
        const email = `e2e-auth-${Date.now()}@example.com`;
        const password = "password123";

        // UIを通さず、APIを直接叩いてテスト用ユーザーを用意する
        await request.post("http://backend:8000/api/auth/register", {
            data: { email, password },
        });

        await page.goto("/login");
        await page.getByLabel("メールアドレス", { exact: true }).fill(email);
        await page.getByLabel("パスワード", { exact: true }).fill(password);
        await page.getByRole("button", { name: "ログイン" }).click();

        await expect(page).toHaveURL(/\/$/);
    });

    test("ログイン：パスワード間違い", async ({ page, request }) => {
        const email = `e2e-auth-${Date.now()}@example.com`;

        await request.post("http://backend:8000/api/auth/register", {
            data: { email, password: "password123" },
        });

        await page.goto("/login");
        await page.getByLabel("メールアドレス", { exact: true }).fill(email);
        await page.getByLabel("パスワード", { exact: true }).fill("wrongpassword");
        await page.getByRole("button", { name: "ログイン" }).click();

        await expect(page.getByText("メールアドレスまたはパスワードが正しくありません")).toBeVisible();
    });
});