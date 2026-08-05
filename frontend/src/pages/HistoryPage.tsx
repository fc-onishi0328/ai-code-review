import HistoryTable from "../components/HistoryTable"
import { useState, useEffect } from "react";
import type { ReviewHistoryItem } from "../types/history";
import { Typography, Container, Box, Button } from "@mui/material";
import { getHistories } from "../api/history";


function HistoryPage () {
  const [histories, setHistories] = useState<ReviewHistoryItem[]>([]);
  useEffect(() => {
    const fetchHistories = async () => {
      const data = await getHistories();
      setHistories(data);
    };
    fetchHistories();
  }, []);
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <div>
        {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
                AI Code Review Assistant 履歴一覧
            </Typography>
            <Button component={Link} to="/" variant="outlined">
                コードレビューへ戻る
            </Button>
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            コードを入力すると、AIが可読性・保守性・セキュリティ・パフォーマンスの観点でレビューします
        </Typography> */}
        <HistoryTable histories={histories} />
      </div>
    </Container>
  );
}

export default HistoryPage;