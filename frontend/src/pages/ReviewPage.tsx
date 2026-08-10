import ReviewForm from "../components/ReviewForm";
import ReviewResult from "../components/ReviewResult";
import { useState } from "react";
import type { ReviewRequest, ReviewResponse } from "../types/review";
import { reviewCode } from "../api/review";
import { Container } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

function ReviewPage() {
  const { token } = useAuth()
  const [request, setRequest] = useState<ReviewRequest>({
    language: 'python',
    code: '',
    review_points: [],
  });
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (reviewRequest: ReviewRequest) => {
    setLoading(true);
    setError(null);
    try {
      setRequest(reviewRequest)
      const response = await reviewCode(reviewRequest, token);
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
        <ReviewForm onSubmit={handleSubmit} loading={loading} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ReviewResult result={result} language={request.language || 'python'} />
      </div>
    </Container>
  );
}

export default ReviewPage;