export type ReviewRequest = {
    language: string;
    code: string;
    reviewPoints: string[];
}

export type ReviewResponse = {
    overall_evaluation: string;
    issues: string[];
    improvements: string[];
    suggested_fixes: string;
    learning_points: string[];
}

export type ReviewFormProps = {
    onSubmit: (reviewRequest: ReviewRequest) => void;
    loading: boolean;
}