import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RegisterForm from "@/components/RegisterForm";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("RegisterForm", () => {
    it("初期状態では登録ボタンが無効になっている", () => {
        render(
            <MemoryRouter>
                <RegisterForm onSubmit={vi.fn()} loading={false} />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: "登録" })).toBeDisabled();
    });

    it("パスワードと確認用が一致しない間はボタンが無効のまま", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <RegisterForm onSubmit={vi.fn()} loading={false} />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/^メールアドレス$/), "taro@example.com");
        await user.type(screen.getByLabelText(/^パスワード$/), "password123");
        await user.type(screen.getByLabelText(/パスワード.*再入力/), "different456");

        expect(screen.getByRole("button", { name: "登録" })).toBeDisabled();
    });

    it("一致しない場合エラーメッセージが表示される", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <RegisterForm onSubmit={vi.fn()} loading={false} />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/パスワード.*再入力/), "different456");

        expect(screen.getByText("パスワードが一致しません")).toBeInTheDocument();
    });

    it("一致すればボタンが有効になり、エラーも消える", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <RegisterForm onSubmit={vi.fn()} loading={false} />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/^メールアドレス$/), "taro@example.com");
        await user.type(screen.getByLabelText(/^パスワード$/), "password123");
        await user.type(screen.getByLabelText(/パスワード.*再入力/), "password123");

        expect(screen.queryByText("パスワードが一致しません")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "登録" })).toBeEnabled();
    });

    it("送信するとonSubmitがconfirmPasswordを含まない形で呼ばれる", async () => {
        const user = userEvent.setup();
        const handleSubmit = vi.fn();
        render(
            <MemoryRouter>
                <RegisterForm onSubmit={handleSubmit} loading={false} />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/^メールアドレス$/), "taro@example.com");
        await user.type(screen.getByLabelText(/^パスワード$/), "password123");
        await user.type(screen.getByLabelText(/パスワード.*再入力/), "password123");
        await user.click(screen.getByRole("button", { name: "登録" }));

        expect(handleSubmit).toHaveBeenCalledWith({
            email: "taro@example.com",
            password: "password123",
        });
    });

    it("既に登録済みの方はこちらからボタンで/loginへ遷移する", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <RegisterForm onSubmit={vi.fn()} loading={false} />
            </MemoryRouter>
        );

        await user.click(screen.getByRole("button", { name: "既に登録済みの方はこちらから" }));

        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});