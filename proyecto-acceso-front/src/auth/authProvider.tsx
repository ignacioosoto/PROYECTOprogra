import { useContext, createContext, useState, useEffect } from "react";
import { AuthResponse } from "../types/types";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  fullName: string | null;
  isAdmin: boolean;
  getAccessToken: () => string | undefined;
  saveUser: (userData: AuthResponse) => void;
  getRefreshToken: () => string | undefined;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  fullName: null,
  isAdmin: false,
  getAccessToken: () => undefined,
  saveUser: () => {},
  getRefreshToken: () => undefined,
  signout: () => {},
});

export function AuthPorvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [, setRefreshToken] = useState<string>("");
  const [fullName, setFullName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedFullName = localStorage.getItem("fullName");
    const storedIsAdmin = localStorage.getItem("isAdmin");

    if (token) {
      setIsAuthenticated(true);
      setRefreshToken(token);
      setFullName(storedFullName);
      setIsAdmin(storedIsAdmin === "true");
    }
  }, []);

  function getAccessToken() {
    return accessToken;
  }

  function getRefreshToken() {
    const token = localStorage.getItem("token");
    return token ? token : undefined;
  }

  function saveUser(userData: AuthResponse) {
    setAccessToken(userData.body.accessToken);
    setRefreshToken(userData.body.refreshToken);
    setIsAuthenticated(true);
    
    const fullNameFromBackend = userData.body.user.name;
    setFullName(fullNameFromBackend);
    localStorage.setItem("fullName", fullNameFromBackend);
    
    // Como todos los logueados son admin:
    setIsAdmin(true);
    localStorage.setItem("isAdmin", "true");

    localStorage.setItem("token", userData.body.refreshToken);
  }

  function signout() {
    setIsAuthenticated(false);
    setAccessToken("");
    setRefreshToken("");
    setFullName(null);
    setIsAdmin(false);
    localStorage.clear();
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        fullName,
        isAdmin,
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
