import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ReviewForm from "@/components/ReviewForm";

describe("ReviewForm", () => {
    it("初期状態では送信ボタンが無効になっている", () => {
        render(<ReviewForm onSubmit={vi.fn()} loading={false} />);

        const button = screen.getByRole("button", { name: "レビューを送信" });
        expect(button).toBeDisabled();
    });

    it("言語選択とコード入力をすると送信ボタンが有効になる", async () => {
        const user = userEvent.setup();
        render(<ReviewForm onSubmit={vi.fn()} loading={false} />);

        const select = screen.getByRole("combobox", { name: /プログラミング言語/ });
        await user.click(select);
        const option = await screen.findByRole("option", { name: "python" });
        await user.click(option);

        const codeInput = screen.getByLabelText(/コード/);
        await user.type(codeInput, "print('hello')");

        const button = screen.getByRole("button", { name: "レビューを送信" });
        expect(button).toBeEnabled();
    });

    it("言語選択が空でコードを入力すると送信ボタンが無効になっている", async () => {
        const user = userEvent.setup();
        render(<ReviewForm onSubmit={vi.fn()} loading={false} />);

        const codeInput = screen.getByLabelText(/コード/);
        await user.type(codeInput, "print('hello')");

        const button = screen.getByRole("button", { name: "レビューを送信" });
        expect(button).toBeDisabled();
    });

    it("言語選択されコードが空欄を入力すると送信ボタンが無効になっている", async () => {
        const user = userEvent.setup();
        render(<ReviewForm onSubmit={vi.fn()} loading={false} />);

        const select = screen.getByRole("combobox", { name: /プログラミング言語/ });
        await user.click(select);
        const option = await screen.findByRole("option", { name: "python" });
        await user.click(option);

        const codeInput = screen.getByLabelText(/コード/);
        await user.type(codeInput, " ");

        const button = screen.getByRole("button", { name: "レビューを送信" });
        expect(button).toBeDisabled();
    });

    it("送信ボタンを押下した際に正しいデータが呼ばれるか", async () => {
        const user = userEvent.setup();
        const mockHandleSubmit = vi.fn()
        render(<ReviewForm onSubmit={mockHandleSubmit} loading={false} />);
        const select = screen.getByRole("combobox", { name: /プログラミング言語/ });
        await user.click(select);
        const option = await screen.findByRole("option", { name: "python" });
        await user.click(option);

        const codeInput = screen.getByLabelText(/コード/);
        await user.type(codeInput, "print('hello')");

        const pointInput = screen.getByRole("button", { name: "可読性" })
        await user.click(pointInput)

        const button = screen.getByRole("button", { name: "レビューを送信" });
        expect(button).toBeEnabled();
        await user.click(button)


        expect(mockHandleSubmit).toHaveBeenCalledWith({
            language: "python",
            code: "print('hello')",
            review_points: ["可読性"],
        });
    });

    it("loading中は送信ボタンが無効になり、テキストが変わる", () => {
        render(<ReviewForm onSubmit={vi.fn()} loading={true} />);

        const button = screen.getByRole("button", { name: "送信中..." });
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("レビュー観点のチップをクリックすると選択・選択解除が切り替わる", async () => {
        const user = userEvent.setup();
        render(<ReviewForm onSubmit={vi.fn()} loading={false} />);

        const chip = screen.getByText("可読性").closest(".MuiChip-root");
        await user.click(chip!);

        expect(chip).toHaveClass("MuiChip-filled");

        await user.click(chip!)
        expect(chip).toHaveClass("MuiChip-outlined");
    });
});