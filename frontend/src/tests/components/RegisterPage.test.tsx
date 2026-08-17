import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "@/pages/RegisterPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { register as registerApi } from "@/api/auth";

vi.mock("@/api/auth", () => ({
    register: vi.fn(),
}));

it("登録成功時に/loginへ遷移する", async () => {
    const user = userEvent.setup();

    vi.mocked(registerApi).mockResolvedValueOnce({
        id: 1,
        email: "taro@example.com",
    });

    render(
        <MemoryRouter initialEntries={["/register"]}>
            <AuthProvider>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<div>ログイン画面</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/^メールアドレス$/), "taro@example.com");
    await user.type(screen.getByLabelText(/^パスワード$/), "password123");
    await user.type(screen.getByLabelText(/パスワード.*再入力/), "password123");
    await user.click(screen.getByRole("button", { name: "登録" }));

    expect(await screen.findByText("ログイン画面")).toBeInTheDocument();
});

it("既に登録済みのメールアドレスの場合、backendのエラーメッセージが表示される", async () => {
    const user = userEvent.setup()

    vi.mocked(registerApi).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
            data: { detail: "このメールアドレスは既に登録されています" },
        },
    });
    render(
        <MemoryRouter initialEntries={["/register"]}>
            <AuthProvider>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<div>ログイン画面</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
    await user.type(screen.getByLabelText(/^メールアドレス$/), "taro@example.com");
    await user.type(screen.getByLabelText(/^パスワード$/), "password123");
    await user.type(screen.getByLabelText(/パスワード.*再入力/), "password123");
    await user.click(screen.getByRole("button", { name: "登録" }));

    expect(await screen.findByText("このメールアドレスは既に登録されています")).toBeInTheDocument();

})

it("予期しないエラーの場合はフォールバックのメッセージが表示される", async () => {
    const user = userEvent.setup()

    vi.mocked(registerApi).mockRejectedValueOnce({
        id: 2,
        email: "hanako@example.com"
    })
    render(
        <MemoryRouter initialEntries={["/register"]}>
            <AuthProvider>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<div>ログイン画面</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
    await user.type(screen.getByLabelText(/^メールアドレス$/), "taro@example.com");
    await user.type(screen.getByLabelText(/^パスワード$/), "password123");
    await user.type(screen.getByLabelText(/パスワード.*再入力/), "password123");
    await user.click(screen.getByRole("button", { name: "登録" }));

    expect(await screen.findByText("登録に失敗しました")).toBeInTheDocument();

})