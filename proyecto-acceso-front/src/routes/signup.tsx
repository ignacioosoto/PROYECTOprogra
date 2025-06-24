import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./dashboard";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const goTo = useNavigate();

  useEffect(() => {
    if (name && (!/^[a-zA-Z\s]+$/.test(name) || name.length > 50)) {
      setNameError("Solo letras y espacios. Máx. 50 caracteres.");
    } else {
      setNameError("");
    }
  }, [name]);

  useEffect(() => {
    if (username && (username.length < 4 || username.length > 20)) {
      setUsernameError("Debe tener entre 4 y 20 caracteres.");
    } else {
      setUsernameError("");
    }
  }, [username]);

  useEffect(() => {
    if (password && password.length < 8) {
      setPasswordError("Debe tener al menos 8 caracteres.");
    } else {
      setPasswordError("");
    }
  }, [password]);

  const isValid = () => {
    return !nameError && !usernameError && !passwordError;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      if (response.ok) {
        setErrorResponse("");
        toast.success("Cuenta creada exitosamente");
        setTimeout(() => {
          goTo("/");
        }, 2000);
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
        toast.error(`Error: ${json.body.error}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h1>Signup</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {nameError && <p className="text-red-500 text-sm">{nameError}</p>}

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

        <button
          type="submit"
          disabled={loading || !isValid()}
          className="bg-indigo-200 rounded p-2 font-mono disabled:opacity-50"
        >
          {loading ? "Creando cuenta..." : "Create Account"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthLayout>
  );
}
// This file is part of the proyecto-acceso-front project.   