import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#10141C",
            paper: "#1A2029",
        },
        primary: {
            main: "#6C8DFF",
        },
    },
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    },
});

// レビュー観点ごとの色（ダークモード向けに明るさを反転）
export const reviewPointColors: Record<string, { bg: string; text: string }> = {
    "可読性": { bg: "#0C447C", text: "#B5D4F4" },
    "保守性": { bg: "#3C3489", text: "#CECBF6" },
    "セキュリティ": { bg: "#712B13", text: "#F5C4B3" },
    "パフォーマンス": { bg: "#085041", text: "#9FE1CB" },
};