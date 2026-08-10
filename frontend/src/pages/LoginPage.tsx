import LoginForm from "@/components/LoginForm";
import { useState } from "react";
import { Typography, Paper, Box, Alert } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import { login as loginApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (loginRequest: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi(loginRequest);
      // throw new Error("test");
      setResult(response);
      login(response.access_token)
      navigate("/")
    }
    catch (error) {
      console.log(error)
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
    <Box
        sx={{
            minHeight: "calc(100vh - 64px)",  // Navbar分の高さを引いた画面全体
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 3, textAlign: "center" }}>
                ログイン
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <LoginForm onSubmit={handleSubmit} loading={loading} />
        </Paper>
    </Box>
  );
}

export default LoginPage;