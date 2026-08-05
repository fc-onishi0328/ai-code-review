export type ReviewHistoryItem = {
    id: BigInteger;
    language: string;
    code: string;
    review_points: string[];
    created_at: string;
}

export type ReviewHistoriesResponse = {
    histories: ReviewHistoryItem[];
}