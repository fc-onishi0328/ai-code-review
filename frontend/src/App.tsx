import ReviewForm from "./components/ReviewForm";
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
      setResult(response);
    }
    catch (error) {
      setError("An error occurred while reviewing the code.");
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <ReviewForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}

export default App;