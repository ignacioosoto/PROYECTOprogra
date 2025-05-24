import { useContext, createContext, useState, useEffect } from "react";
import { AuthResponse } from "../types/types";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  getAccessToken: () => string | undefined;
  saveUser: (userData: AuthResponse) => void;
  getRefreshToken: () => string | undefined;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  getAccessToken: () => undefined,
  saveUser: () => {},
  getRefreshToken: () => undefined,
  signout: () => {},
});

export function AuthPorvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");

  useEffect(() => {
    // Check if user is already authenticated on mount
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setRefreshToken(token);
    }
  }, []);

  function getAccessToken() {
    return accessToken;
  }

  function getRefreshToken() {
    const token = localStorage.getItem("token");
    if (token) {
      return token;
    }
    return undefined;
  }

  // Save user tokens and set authenticated state
  function saveUser(userData: AuthResponse) {
    setAccessToken(userData.body.accessToken);
    setRefreshToken(userData.body.refreshToken);
    localStorage.setItem("token", userData.body.refreshToken);
    setIsAuthenticated(true);
  }

  // Sign out user
  function signout() {
    setIsAuthenticated(false);
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getAccessToken,
        saveUser,
        getRefreshToken,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);