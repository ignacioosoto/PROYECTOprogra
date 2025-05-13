import { useState } from "react";
import DefaultLayout from "../layout/defaultLayout";
import { API_URL } from "../auth/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VisitRegister() {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          company,
          reason,
          idNumber,
        }),
      });

      if (response.ok) {
        setErrorResponse("");
        toast.success("Visita registrada exitosamente");
        setFullName("");
        setCompany("");
        setReason("");
        setIdNumber("");
      } else {
        const json = await response.json();
        setErrorResponse(json.body?.error || "Error desconocido");
        toast.error(`Error: ${json.body?.error || "Error desconocido"}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al registrar la visita");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit}>
        <h1>Registro de Visitas</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        <label>Nombre Completo</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label>Rut</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <label>Motivo de la visita</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <label>Número de Identificación</label>
        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Visita"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}
