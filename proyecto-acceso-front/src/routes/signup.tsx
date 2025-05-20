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
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string>("");

  const auth = useAuth();
  const goTo = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error al acceder a la cámara", error);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 400, 300);
        const imageData = canvasRef.current.toDataURL("image/png");
        setPhoto(imageData);
        toast.success("Foto capturada correctamente");
      }
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!photo) {
      toast.error("Debes capturar una foto para registrar tu rostro");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, photo }),
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

  if (auth.isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit}>
        <h1>Crear Cuenta</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}

        <label>Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ marginTop: "1rem" }}>
          <h2>Captura de rostro</h2>
          <video ref={videoRef} width="400" height="300" autoPlay muted />
          <canvas ref={canvasRef} width="400" height="300" style={{ display: "none" }} />
          <div style={{ marginTop: "0.5rem" }}>
            <button type="button" onClick={startCamera} className="primary-button">
              Activar Cámara
            </button>
            <button type="button" onClick={takePhoto} className="primary-button">
              Tomar Foto
            </button>
          </div>
        </div>

        {photo && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Foto capturada:</h3>
            <img src={photo} alt="captura" width={200} />
          </div>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}
