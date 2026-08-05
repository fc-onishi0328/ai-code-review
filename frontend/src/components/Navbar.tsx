import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
                    AI Code Review Assistant
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button component={Link} to="/">レビュー</Button>
                    <Button component={Link} to="/history">履歴</Button>
                    <Button variant="outlined">ログイン</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;