import { useState, useRef } from "react";
import { useAuth } from "../auth/authProvider";
import DefaultLayout from "../layout/defaultLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const auth = useAuth();
  const goTo = useNavigate();

  // Activar la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error al acceder a la cámara", err);
      toast.error("No se pudo acceder a la cámara.");
    }
  };

  // Tomar foto
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 300);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setPhoto(imageData);
      }
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, photo }),
      });

      if (response.ok) {
        setErrorResponse("");
        toast.success("Cuenta creada exitosamente");
        setTimeout(() => goTo("/"), 2000);
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

  if (auth.isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit}>
        <h1>Signup</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}

        <label>Nombre</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Usuario</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div>
          <button type="button" onClick={startCamera}>Activar Cámara</button>
          <video ref={videoRef} width="300" height="300" style={{ border: "1px solid black" }} />
          <button type="button" onClick={takePhoto}>Tomar Foto</button>
          <canvas ref={canvasRef} width="300" height="300" style={{ display: "none" }} />
          {photo && <img src={photo} alt="Preview" style={{ marginTop: 10, width: 150 }} />}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}
