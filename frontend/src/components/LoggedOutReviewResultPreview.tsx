import type { ReviewHistoryItem } from "../types/history";
import { Box, Paper, Typography, Button } from "@mui/material";
import HistoryTable from "./HistoryTable"
import { useNavigate } from "react-router-dom";

function LoggedOutReviewResultPreview() {
    const navigate = useNavigate()
    const dummyHistories: ReviewHistoryItem[] = [
        { id: 1, language: "python", code: "def add(a, b): return a + b", review_points: ["可読性", "保守性"], overall_evaluation: "", issues: [], improvements: [], suggested_fixes: "", learning_points: [], created_at: new Date().toISOString() },
        { id: 2, language: "java", code: "def add(a, b): return a + b", review_points: ["セキュリティ"], overall_evaluation: "", issues: [], improvements: [], suggested_fixes: "", learning_points: [], created_at: new Date().toISOString() },
        { id: 3, language: "typescript", code: "def add(a, b): return a + b", review_points: ["パフォーマンス", "セキュリティ"], overall_evaluation: "", issues: [], improvements: [], suggested_fixes: "", learning_points: [], created_at: new Date().toISOString() },
        { id: 4, language: "javascript", code: "def add(a, b): return a + b", review_points: ["保守性"], overall_evaluation: "", issues: [], improvements: [], suggested_fixes: "", learning_points: [], created_at: new Date().toISOString() },
        { id: 5, language: "c#", code: "def add(a, b): return a + b", review_points: ["セキュリティ"], overall_evaluation: "", issues: [], improvements: [], suggested_fixes: "", learning_points: [], created_at: new Date().toISOString() },
    ];
    return (
        <Box sx={{ position: "relative" }}>
            <Box sx={{ filter: "blur(3px)", pointerEvents: "none", opacity: 0.9 }}>
                <HistoryTable histories={dummyHistories} />
            </Box>
            <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Paper sx={{ p: 4, width: "100%", maxWidth: "70%" }}>
                    <Typography variant="h5" sx={{ fontWeight: 500, mb: 3, textAlign: "center" }}>
                        ログインしてレビュー履歴を残そう
                    </Typography>
                    <Typography sx={{ mb: 3, textAlign: "center" }}>
                        ログイン中に実行したレビューが、ここに自動で保存されます。
                    </Typography>
                    <Box sx={{ display: "flex",alignItems: "center", justifyContent: "center", gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate('/login')}
                        >
                            ログイン
                        </Button>
                        または
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate('/register')}
                        >
                            新規登録
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default LoggedOutReviewResultPreview