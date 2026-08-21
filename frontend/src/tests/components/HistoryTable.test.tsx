import type { ReviewHistoryItem } from "@/types/history";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HistoryTable from "@/components/HistoryTable";
import * as reactRouterDom from "react-router-dom";
import userEvent from "@testing-library/user-event";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
const dummyHistories: ReviewHistoryItem[] = [
    {
        id: 1,
        language: "python",
        code: "print('hello')",
        review_points: ["可読性"],
        created_at: "2026-08-05T14:25:55.000Z",
        overall_evaluation: "",
        issues: [],
        improvements: [],
        suggested_fixes: "",
        learning_points: []
    },
    {
        id: 2,
        language: "javascript",
        code: "a".repeat(60), // 50文字超えの省略確認用
        review_points: [],
        created_at: "2026-08-04T21:11:51.000Z",
        overall_evaluation: "",
        issues: [],
        improvements: [],
        suggested_fixes: "",
        learning_points: []
    },
];

describe("HistoryTable", () => {
    it("渡された件数分の行が表示される", () => {
        render(
            <MemoryRouter>
                <HistoryTable histories={dummyHistories} />
            </MemoryRouter>
        );

        expect(screen.getByText("python")).toBeInTheDocument();
        expect(screen.getByText("javascript")).toBeInTheDocument();
    });

    it("コードが50文字を超えると省略表示される", () => {
        render(
            <MemoryRouter>
                <HistoryTable histories={dummyHistories} />
            </MemoryRouter>
        );

        expect(screen.getByText(`${"a".repeat(50)}...`)).toBeInTheDocument();
    });

    it("レビュー観点がチップとして表示される", () => {
        render(
            <MemoryRouter>
                <HistoryTable histories={dummyHistories} />
            </MemoryRouter>
        );

        expect(screen.getByText("可読性")).toBeInTheDocument();
    });

    it("日時が指定したフォーマットで表示される", () => {
        render(
            <MemoryRouter>
                <HistoryTable histories={dummyHistories} />
            </MemoryRouter>
        );

        const d = new Date(dummyHistories[0].created_at);
        const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

        expect(screen.getByText(expected)).toBeInTheDocument();
    });

    it("行をクリックすると詳細ページへ遷移する", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <HistoryTable histories={dummyHistories} />
            </MemoryRouter>
        );

        await user.click(screen.getByText("python"));

        expect(mockNavigate).toHaveBeenCalledWith("/history/1");
    });    
});