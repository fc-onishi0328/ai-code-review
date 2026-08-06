import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function GuestOnlyRoute({ children }: { children: ReactNode }) {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default GuestOnlyRoute;