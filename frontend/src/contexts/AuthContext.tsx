import { createContext, useContext, useState, type ReactNode } from "react";

type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = (newToken: string) => {
        // ここでstateとlocalStorageの両方を更新する
        setToken(newToken)
        localStorage.setItem("token", newToken)
    };

    const logout = () => {
        // ここでstateとlocalStorageの両方をクリアする
        setToken(null)
        localStorage.removeItem("token")
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}