import { useContext, createContext, useState, useEffect } from "react";
interface AuthPorviderPorps {
    children: React.ReactNode
}

const AuthContext = createContext({
    isAuthenticated: false,
})

export function AuthPorvider({ children }: AuthPorviderPorps) {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext)