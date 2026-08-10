import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function Navbar() {
    const { token, logout } = useAuth();
    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate("/login")
    }
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
                    AI Code Review Assistant
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button component={Link} to="/">レビュー</Button>
                    <Button component={Link} to="/history">履歴</Button>
                    {token ? (
                        <Button variant="outlined" onClick={handleLogout}>ログアウト</Button>
                    ) : (
                        <Button component={Link} to="/login" variant="outlined">ログイン</Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;