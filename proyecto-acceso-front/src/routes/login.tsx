import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider";
import DefaultLayout from "../layout/defaultLayout";
import { useState } from "react";
import type { AuthResponseError, AuthResponse } from "../types/types";
import LoadingScreen from "../routes/LoadingScreen";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const goTo = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const json = (await response.json()) as AuthResponse;
        setErrorResponse("");
        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json);
        }
        goTo("/dashboard");
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.log(error);
      setErrorResponse("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  if (auth.isAuthenticated) return <Navigate to="/dashboard" />;

  if (loading) {
    return (
      <DefaultLayout>
        <LoadingScreen />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </DefaultLayout>
  );
}
console.log("API_URL ES:", API_URL);
