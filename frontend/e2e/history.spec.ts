import { test, expect } from "@playwright/test";

async function loginAndGetToken(request: import("@playwright/test").APIRequestContext, email: string, password: string) {
    await request.post("http://backend:8000/api/auth/register", { data: { email, password } });
    const res = await request.post("http://backend:8000/api/auth/login", { data: { email, password } });
    const { access_token } = await res.json();
    return access_token as string;
}

test.describe("履歴", () => {
    test("自分の履歴のみ表示される", async ({ page, request }) => {
        const userA = { email: `e2e-history-a-${Date.now()}@example.com`, password: "password123" };
        const userB = { email: `e2e-history-b-${Date.now()}@example.com`, password: "password123" };

        const tokenA = await loginAndGetToken(request, userA.email, userA.password);

        // ユーザーAとしてレビューを1件投稿(UIを介さずAPIで直接)
        await request.post("http://backend:8000/api/review", {
            headers: { Authorization: `Bearer ${tokenA}` },
            data: { language: "python", code: "print('hello')", review_points: [] },
        });

        await loginAndGetToken(request, userB.email, userB.password);

        // ユーザーBとしてログインし、履歴画面を確認
        await page.goto("/login");
        await page.getByLabel("メールアドレス", { exact: true }).fill(userB.email);
        await page.getByLabel("パスワード", { exact: true }).fill(userB.password);
        await page.getByRole("button", { name: "ログイン" }).click();
        await expect(page).toHaveURL(/\/$/);

        await page.getByRole("link", { name: "履歴" }).click();
        await expect(page.getByText("python")).not.toBeVisible();
    });

    test("履歴の行をクリックすると詳細ページへ遷移する", async ({ page, request }) => {
        const user = { email: `e2e-history-detail-${Date.now()}@example.com`, password: "password123" };
        const token = await loginAndGetToken(request, user.email, user.password);

        await request.post("http://backend:8000/api/review", {
            headers: { Authorization: `Bearer ${token}` },
            data: { language: "python", code: "print('hello')", review_points: ["可読性"] },
        });

        await page.goto("/login");
        await page.getByLabel("メールアドレス", { exact: true }).fill(user.email);
        await page.getByLabel("パスワード", { exact: true }).fill(user.password);
        await page.getByRole("button", { name: "ログイン" }).click();
        await expect(page).toHaveURL(/\/$/);

        await page.getByRole("link", { name: "履歴" }).click();
        await page.getByText("python").click();

        await expect(page).toHaveURL(/\/history\/\d+$/);
        await expect(page.getByText("E2Eテスト用の固定評価です。")).toBeVisible();
    });
});