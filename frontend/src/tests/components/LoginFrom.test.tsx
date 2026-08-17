import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { login as loginApi } from "@/api/auth";
import LoginForm from "@/components/LoginForm";

vi.mock("@/api/auth", () => ({
    login: vi.fn(),
}));

describe("LoginForm", () => {
    it("メールアドレスまたはパスワードが空欄の場合、ログインボタンが無効になっている", () => {
        render(
            <MemoryRouter>
                <LoginForm onSubmit={vi.fn()} loading={false} />
            </MemoryRouter>
        );

        const button = screen.getByRole("button", { name: "ログイン" });
        expect(button).toBeDisabled();
    });

    it("ログイン失敗時にbackendのエラーメッセージが表示される", async () => {
        const user = userEvent.setup();

        // loginApiが呼ばれたら、axiosのエラーっぽい形で失敗させる
        vi.mocked(loginApi).mockRejectedValueOnce({
            isAxiosError: true,
            response: {
                data: { detail: "メールアドレスまたはパスワードが正しくありません" },
            },
        });
        render(
            <MemoryRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/^メールアドレス$/), "taro@example.com");
        await user.type(screen.getByLabelText(/^パスワード$/), "wrongpassword");
        await user.click(screen.getByRole("button", { name: "ログイン" }));

        expect(await screen.findByText("メールアドレスまたはパスワードが正しくありません")).toBeInTheDocument();
    });

    it("ログイン成功時にトップページへ遷移する", async () => {
        const user = userEvent.setup();

        vi.mocked
        (loginApi).mockResolvedValueOnce({
            access_token: "dummy-token",
            token_type: "bearer",
        });

        render(
            <MemoryRouter initialEntries={["/login"]}>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<div>レビュー画面</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/^メールアドレス$/), "taro@example.com");
        await user.type(screen.getByLabelText(/^パスワード$/), "password123");
        await user.click(screen.getByRole("button", { name: "ログイン" }));

        expect(await screen.findByText("レビュー画面")).toBeInTheDocument();
    });
});