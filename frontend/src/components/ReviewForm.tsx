import { useState } from "react";
import type { ReviewFormProps } from "../types/review";
import { Select, MenuItem,FormControl, InputLabel, TextField, Button, CircularProgress,  Chip, Stack, Typography } from "@mui/material";
import { reviewPointColors } from "../theme";

function ReviewForm({ onSubmit, loading }: ReviewFormProps) {
    const [language, setLanguage] = useState("");
    const languages = ["python", "javascript", "java", "c++", "c#", "ruby", "go", "php", "typescript"];
    const [code, setCode] = useState("");
    const [reviewPoints, setReviewPoints] = useState<string[]>([]);
    const reviewPointOptions = ["可読性", "保守性", "セキュリティ", "パフォーマンス"];
    const toggleReviewPoint = (point: string) => {
    setReviewPoints((prev) =>
        prev.includes(point)
            ? prev.filter((p) => p !== point)
            : [...prev, point]
    );
};
    
    return (
        <div>
            <Stack spacing={2}>
                <FormControl fullWidth>
                    <InputLabel id="language-label">プログラミング言語(必須)</InputLabel>
                    <Select
                        labelId="language-label"
                        label="プログラミング言語(必須)"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {languages.map((lang) => (
                            <MenuItem key={lang} value={lang}>
                                {lang}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    id="outlined-multiline-static"
                    label="コード(必須)"
                    multiline
                    rows={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                    レビュー観点
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                    ※指定しない場合は、全ての観点でレビューされます
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {reviewPointOptions.map((option) => {
                        const selected = reviewPoints.includes(option);
                        const colors = reviewPointColors[option];
                        return (
                            <Chip
                                key={option}
                                label={option}
                                onClick={() => toggleReviewPoint(option)}
                                variant={selected ? "filled" : "outlined"}
                                sx={
                                    selected
                                        ? { backgroundColor: colors.bg, color: colors.text, fontWeight: 500, borderColor: colors.bg }
                                        : { color: colors.text, borderColor: colors.bg }
                                }
                            />
                        );
                    })}
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSubmit({ language, code, review_points: reviewPoints })}
                    disabled={loading || !language || !code.trim()}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? "送信中..." : "レビューを送信"}
                </Button>
            </Stack>
        </div>
    )
}

export default ReviewForm;