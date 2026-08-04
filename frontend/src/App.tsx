import ReviewForm from "./components/ReviewForm";
import ReviewResult from "./components/ReviewResult";
import { useState } from "react";
import type { ReviewRequest, ReviewResponse } from "./types/review";
import { reviewCode } from "./api/review";

function App() {
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
    <div>
      <ReviewForm onSubmit={handleSubmit} loading={loading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ReviewResult result={result} />
    </div>
  );
}

export default App;