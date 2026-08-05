import ReviewForm from "../components/ReviewForm";
import ReviewResult from "../components/ReviewResult";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { ReviewRequest, ReviewResponse } from "../types/review";
import { reviewCode } from "../api/review";
import { Typography, Container, Box, Button } from "@mui/material";

function ReviewPage() {
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (reviewRequest: ReviewRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewCode(reviewRequest);
      // throw new Error("test");
      setResult(response);
    }
    catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <div>
        {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
                AI Code Review Assistant
            </Typography>
            <Button component={Link} to="/history" variant="outlined">
                履歴を見る
            </Button>
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            コードを入力すると、AIが可読性・保守性・セキュリティ・パフォーマンスの観点でレビューします
        </Typography> */}
        <ReviewForm onSubmit={handleSubmit} loading={loading} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ReviewResult result={result} />
      </div>
    </Container>
  );
}

export default ReviewPage;