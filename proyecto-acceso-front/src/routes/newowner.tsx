import { useState } from "react";
import { useAuth } from "../auth/authProvider";
import DefaultLayout from "../layout/defaultLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../routes/LoadingScreen";

export default function NewOwner() {
  const [fullName, setFullName] = useState("");
  const [rut, setRut] = useState("");
  const [address, setAddress] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const goTo = useNavigate();

  if (!auth.isAuthenticated) return <Navigate to="/" replace />;
  if (loading) return <LoadingScreen />;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/owners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, rut, address }),
      });

      if (response.ok) {
        setErrorResponse("");
        toast.success("Propietario agregado exitosamente");
        setTimeout(() => {
          goTo("/dashboard");
        }, 2000);
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error || "Error al agregar propietario");
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
    <DefaultLayout>
      <form onSubmit={handleSubmit}>
        <h1>Agregar Propietario</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        
        <label>Nombre completo</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        
        <label>RUT</label>
        <input
          type="text"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          required
        />
        
        <label>Domicilio</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Agregar Propietario"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}