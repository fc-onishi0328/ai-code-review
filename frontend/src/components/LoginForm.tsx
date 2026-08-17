import { useState } from "react";
import type { LoginFormProps } from "@/types/auth";
import { TextField, Button, CircularProgress, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginForm({ onSubmit, loading }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const isDisabled = loading || !email || !password;
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    type="email"
                    label="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    type="password"
                    label="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Tooltip title={isDisabled ? "メールアドレスとパスワードを入力してください" : ""}>
                    <span style={{ width: "100%", display: "block" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                            disabled={isDisabled}
                        >
                            {loading ? "ログイン中" : "ログイン"}
                        </Button>
                    </span>
                </Tooltip>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/register')}
                >
                    新規登録はこちらから
                </Button>
            </Stack>
        </form>
    );
}

export default LoginForm;