import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HistoryPage from "@/pages/HistoryPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { getHistories } from "@/api/history";

vi.mock("@/api/history", () => ({
    getHistories: vi.fn(),
}));

const dummyHistories = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    language: `lang-${i + 1}`,
    code: "print('hello')",
    review_points: [],
    overall_evaluation: "良好",
    issues: [],
    improvements: [],
    suggested_fixes: "",
    learning_points: [],
    created_at: new Date().toISOString(),
}));

function renderPage() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <HistoryPage />
            </AuthProvider>
        </MemoryRouter>
    );
}

describe("HistoryPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it("未ログイン時はログイン誘導プレビューが表示される", () => {
        renderPage();

        expect(screen.getByText("ログインしてレビュー履歴を残そう")).toBeInTheDocument();
        expect(getHistories).not.toHaveBeenCalled();
    });

    it("ログイン時は取得した履歴が表示される", async () => {
        localStorage.setItem("token", "dummy-token");
        vi.mocked(getHistories).mockResolvedValueOnce(dummyHistories);

        renderPage();

        expect(await screen.findByText("lang-1")).toBeInTheDocument();
    });

    it("1ページ目は10件だけ表示される", async () => {
        localStorage.setItem("token", "dummy-token");
        vi.mocked(getHistories).mockResolvedValueOnce(dummyHistories);

        renderPage();

        expect(await screen.findByText("lang-1")).toBeInTheDocument();
        expect(screen.queryByText("lang-11")).not.toBeInTheDocument();
    });

    it("次のページへ進むと11件目が表示される", async () => {
        localStorage.setItem("token", "dummy-token");
        vi.mocked(getHistories).mockResolvedValueOnce(dummyHistories);
        const user = userEvent.setup();

        renderPage();

        await screen.findByText("lang-1");
        await user.click(screen.getByRole("button", { name: /next page/i }));

        expect(screen.getByText("lang-11")).toBeInTheDocument();
    });

    it("履歴が0件でもエラーにならない", async () => {
        localStorage.setItem("token", "dummy-token");
        vi.mocked(getHistories).mockResolvedValueOnce([]);

        renderPage();

        await vi.waitFor(() => {
            expect(getHistories).toHaveBeenCalled();
        });
        expect(screen.queryByText("lang-1")).not.toBeInTheDocument();
    });
});