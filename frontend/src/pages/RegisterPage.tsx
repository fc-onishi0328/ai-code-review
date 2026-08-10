import { useState } from "react";
import { Typography, Paper, Box, Alert } from "@mui/material";
import type { RegisterRequest } from "@/types/auth";
import { register as registerApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/RegisterForm";

function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (registerRequest: RegisterRequest) => {
        setLoading(true);
        setError(null);
        try {
            await registerApi(registerRequest);
            navigate("/login");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
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
                    新規登録
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <RegisterForm onSubmit={handleSubmit} loading={loading} />
            </Paper>
        </Box>
    );
}

export default RegisterPage;