import type { ReviewResponse } from "./review";
export type ReviewHistoryItem = {
    id: number;
    language: string;
    code: string;
    review_points: string[];
    overall_evaluation: string;
    issues: string[];
    improvements: string[];
    suggested_fixes: string;
    learning_points: string[];
    created_at: string;
}

export type ReviewHistoriesResponse = {
    histories: ReviewHistoryItem[];
}

export type ReviewHistoryDetail = ReviewResponse & {
    id: number;
    language: string;
    code: string;
    review_points: string[];
    created_at: string;
}