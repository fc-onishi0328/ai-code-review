import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import HistoryDetailPage from "@/pages/HistoryDetailPage";
import { getHistoryDetail } from "@/api/history";
import { AuthProvider } from "@/contexts/AuthContext";
import { beforeEach } from "vitest";

vi.mock("@/api/history", () => ({
    getHistoryDetail: vi.fn(),
}));

function renderWithId(id: string) {
    return render(
        <MemoryRouter initialEntries={[`/history/${id}`]}>
            <AuthProvider>
                <Routes>
                    <Route path="/history/:id" element={<HistoryDetailPage />} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

describe("HistoryDetailPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem("token", "dummy-token");
    });
    it("読み込み中は「読み込み中...」が表示される", () => {
        vi.mocked(getHistoryDetail).mockImplementation(() => new Promise(() => {})); // 永遠に解決しないPromise

        renderWithId("1");

        expect(screen.getByText("読み込み中...")).toBeInTheDocument();
    });

    it("取得したデータが表示される", async () => {
        vi.mocked(getHistoryDetail).mockResolvedValueOnce({
            id: 1,
            language: "python",
            code: "print('hello')",
            review_points: ["可読性"],
            created_at: "2026-08-05T14:25:55.000Z",
            overall_evaluation: "テスト用の評価",
            issues: [],
            improvements: [],
            suggested_fixes: "",
            learning_points: [],
        });

        renderWithId("1");

        expect(await screen.findByText("テスト用の評価")).toBeInTheDocument();
        expect(screen.getByText("python")).toBeInTheDocument();
    });

    it("URLのidが正しくAPIに渡される", async () => {
        vi.mocked(getHistoryDetail).mockResolvedValueOnce({
            id: 42,
            language: "python",
            code: "print('hello')",
            review_points: ["可読性"],
            created_at: "2026-08-05T14:25:55.000Z",
            overall_evaluation: "テスト用の評価",
            issues: [],
            improvements: [],
            suggested_fixes: "",
            learning_points: [],
        });

        renderWithId("42");

        await screen.findByText("python");

        expect(getHistoryDetail).toHaveBeenCalledWith(42, expect.any(String));
    });
})