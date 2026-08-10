import { Typography, Container, Paper, Box, Stack, Chip } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import ReviewResult from "../components/ReviewResult";
import { useAuth } from '../contexts/AuthContext';
import { getHistoryDetail } from "../api/history";
import { useEffect, useState } from "react";
import type { ReviewHistoryDetail } from "../types/history";
import { reviewPointColors } from "../theme";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function HistoryDetailPage() {
    const { token } = useAuth()
    const [detail, setDetail] = useState<ReviewHistoryDetail | null>(null);
    const { id } = useParams()
    useEffect(() => {
        const fetchDetail = async () => {
            const data = await getHistoryDetail(Number(id), token!)
            setDetail(data)
        };
        fetchDetail();
    }, [id, token]);

    if (!detail) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Typography>読み込み中...</Typography>
            </Container>
        )
    }

    function formatDate(date: string) {
        const d = new Date(date);
        const year = String(d.getFullYear())
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        const hour = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minutes}:${second}`;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography component={Link} to="/history" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary", textDecoration: "none" }}>
            ← 履歴一覧に戻る
        </Typography>

        {/* 1. メタ情報カード */}
        <Paper sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>{detail.language}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                { formatDate(detail.created_at) }
            </Typography>
            </Box>
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                {detail.review_points.map((point) => (
                    <Chip
                        key={point}
                        label={point}
                        size="small"
                        sx={{ backgroundColor: reviewPointColors[point].bg, color: reviewPointColors[point].text }}
                    />
                ))}
            </Stack>
        </Paper>

        {/* 2. 提出したコードカード */}
        <Paper sx={{ p: 3, mb: 2 }}>
            <SyntaxHighlighter
                language={detail.language}
                style={oneDark}
                customStyle={{ borderRadius: 8, margin: 0, fontSize: 13 }}
            >
                {detail.code}
            </SyntaxHighlighter>
        </Paper>

        {/* 3. レビュー結果カード */}
        <Paper sx={{ p: 3 }}>
            <ReviewResult result={detail} language={detail.language} />
        </Paper>
    </Container>
    )
}

export default HistoryDetailPage