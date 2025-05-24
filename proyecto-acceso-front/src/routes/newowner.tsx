import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
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
  const [photo, setPhoto] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const auth = useAuth();
  const goTo = useNavigate();

  if (!auth.isAuthenticated) return <Navigate to="/" replace />;
  if (loading) return <LoadingScreen />;

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setPhoto(imageSrc); // base64 image
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!photo) {
      toast.error("Por favor captura una foto del rostro.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/owners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, rut, address, faceImage: photo }),
      });

      if (response.ok) {
        toast.success("Propietario agregado exitosamente");
        setTimeout(() => goTo("/dashboard"), 2000);
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error || "Error al agregar propietario");
        toast.error(`Error: ${json.body.error}`);
      }
    } catch (error) {
      console.error(error);
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
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

        <label>RUT</label>
        <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} required />

        <label>Domicilio</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

        <label>Captura de rostro</label>
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
        <button type="button" onClick={capturePhoto}>Capturar Foto</button>
        {photo && <img src={photo} alt="captura" width="150" />}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Agregar Propietario"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}