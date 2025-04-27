import { useContext, createContext, useState, useEffect } from "react";
import { AuthResponse } from "../types/types";

interface AuthPorviderPorps {
    children: React.ReactNode
}

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => { },
    saveUser: (userData: AuthResponse) => { },
    getRefreshToken: () => { },
})

export function AuthPorvider({ children }: AuthPorviderPorps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("");

    function getAccessToken() {
        return accessToken;
    }

    function getRefreshToken() {
        const token = localStorage.getItem("token");
        if (token) {
            const { refreshToken } = JSON.parse(token);
            return refreshToken;
        }
    }


    //guarda la informacion de los accesstokens y del usuario para decir que estamos autentificados
    function saveUser(userData: AuthResponse) {
        setAccessToken(userData.body.accessToken);
        setRefreshToken(userData.body.refreshToken);

        localStorage.setItem("token", JSON.stringify(userData.body.refreshToken));
        setIsAuthenticated(true);


    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext)