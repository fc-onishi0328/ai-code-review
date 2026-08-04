import { useState } from "react";
import type { ReviewFormProps } from "../types/review";
import { Select, MenuItem,FormControl, InputLabel, TextField, Button } from "@mui/material";
import Stack from "@mui/material/Stack";


function ReviewForm({ onSubmit, loading }: ReviewFormProps) {
    const [language, setLanguage] = useState("");
    const languages = ["python", "javascript", "java", "c++", "c#", "ruby", "go", "php", "typescript"];
    const [code, setCode] = useState("");
    const [reviewPoints, setReviewPoints] = useState<string[]>([]);
    const reviewPointOptions = ["可読性", "保守性", "セキュリティ", "パフォーマンス"];
    
    return (
        <div>
            <Stack spacing={2}>
                <FormControl fullWidth>
                    <InputLabel id="language-label">プログラミング言語</InputLabel>
                    <Select
                        labelId="language-label"
                        label="プログラミング言語"
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
                    label="コード"
                    multiline
                    rows={4}
                    defaultValue={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel id="review-point-label">レビュー観点</InputLabel>
                    <Select
                        labelId="review-point-label"
                        label="レビュー観点"
                        value={reviewPoints}
                        onChange={(e) => setReviewPoints(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)}
                        multiple
                    >
                        {reviewPointOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSubmit({ language, code, reviewPoints })}
                    disabled={loading}
                >
                    {loading ? "送信中..." : "レビューを送信"}
                </Button>
            </Stack>
        </div>
    )
}

export default ReviewForm;