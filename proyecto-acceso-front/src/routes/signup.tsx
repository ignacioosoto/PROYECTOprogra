import { useState } from "react";
import { useAuth } from "../auth/authProvider";
import DefaultLayout from "../layout/defaultLayout";
import { ErrorResponse, Navigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../routes/LoadingScreen";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false); 
  const auth = useAuth();
  const goTo = useNavigate();

  // Handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
        }),
      });

      if (response.ok) {
        console.log("User created successfully");
        setErrorResponse("");
        goTo("/");
      } else {
        console.log("Something went wrong");
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); 
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return <LoadingScreen />; 
  }

  return (
    <DefaultLayout>
      <form className="form" onSubmit={handleSubmit}>
        <h1>Signup</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Username</label>
        <input
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Create User</button>
      </form>
    </DefaultLayout>
  );
}