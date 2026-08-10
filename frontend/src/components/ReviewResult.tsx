import type { ReviewResponse } from "@/types/review";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


function ReviewResult({ result, language }: { result: ReviewResponse | null, language: string }) {
    if (!result) {
        return null;
    }
    return (
        <div>
            <h2>レビュー結果</h2>
            <p><strong>総合評価:</strong> {result.overall_evaluation}</p>
            <h3>指摘事項</h3>
            <ul>
                {result.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                ))}
            </ul>
            <h3>改善点</h3>
            <ul>
                {result.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                ))}
            </ul>
            <h3>提案される修正</h3>
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{ borderRadius: 8, margin: 0, fontSize: 13 }}
            >
                {result.suggested_fixes}
            </SyntaxHighlighter>
            <h3>学習ポイント</h3>
            <ul>
                {result.learning_points.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
        </div>
    );

    
}

export default ReviewResult;