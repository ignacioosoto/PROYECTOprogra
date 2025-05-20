import { useRef, useState } from "react";
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

  // Referencias para cámara
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Iniciar la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error al acceder a la cámara", error);
      toast.error("No se pudo acceder a la cámara.");
    }
  };

  // Tomar foto
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 400, 300);
        const imageData = canvasRef.current.toDataURL("image/png");
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
        body: JSON.stringify({
          name,
          username,
          password,
          photo, // si quieres enviarla al backend
        }),
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
        <h1>Signup</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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

        {/* Sección de reconocimiento facial */}
        <div className="mt-6">
          <h2>Reconocimiento Facial (opcional)</h2>
          <div className="camera-container">
            <video
              ref={videoRef}
              className="camera-view"
              autoPlay
              muted
              playsInline
              style={{ width: "400px", height: "300px", border: "1px solid #ccc" }}
            />
            <canvas ref={canvasRef} width="400" height="300" style={{ display: "none" }} />
          </div>
          <div className="flex gap-4 mt-2">
            <button type="button" onClick={startCamera}>Conectar Cámara</button>
            <button type="button" onClick={takePhoto}>Capturar Foto</button>
          </div>

          {photo && (
            <div className="mt-4">
              <h3>Foto capturada:</h3>
              <img src={photo} alt="capturada" style={{ width: "200px", borderRadius: "8px" }} />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="mt-6">
          {loading ? "Creando cuenta..." : "Create Account"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}
