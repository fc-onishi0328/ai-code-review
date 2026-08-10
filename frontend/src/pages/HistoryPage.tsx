import HistoryTable from "@/components/HistoryTable"
import { useState, useEffect } from "react";
import type { ReviewHistoryItem } from "@/types/history";
import { Container } from "@mui/material";
import { getHistories } from "@/api/history";
import { useAuth } from "@/contexts/AuthContext";
import LoggedOutReviewResultPreview from "@/components/LoggedOutReviewResultPreview";


function HistoryPage () {
  const { token } = useAuth()
  const [histories, setHistories] = useState<ReviewHistoryItem[]>([]);
  if (!token) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <div>
          <LoggedOutReviewResultPreview />
        </div>
      </Container>
    )
  }
  useEffect(() => {
    const fetchHistories = async () => {
      const data = await getHistories(token!);
      setHistories(data);
    };
    fetchHistories();
  }, []);
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <div>
        <HistoryTable histories={histories} />
      </div>
    </Container>
  );
}

export default HistoryPage;