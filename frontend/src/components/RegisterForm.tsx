import { useState } from "react";
import type { RegisterFormProps } from "@/types/auth";
import { TextField, Button, CircularProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RegisterForm({ onSubmit, loading }: RegisterFormProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const passwordsMatch = password === confirmPassword;
    const showMismatchError = confirmPassword.length > 0 && !passwordsMatch;
    
    return (
        <div>
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
                <TextField
                    type="password"
                    label="パスワード(再入力)"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={showMismatchError}
                    helperText={showMismatchError ? "パスワードが一致しません" : ""}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSubmit({ email: email, password: password })}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                    disabled={loading || !email || !password || !passwordsMatch}
                >
                    {loading ? "登録中" : "登録"}
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/login')}
                >
                    既に登録済みの方はこちらから
                </Button>
            </Stack>
        </div>
    )
}

export default RegisterForm;