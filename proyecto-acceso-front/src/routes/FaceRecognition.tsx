import { useRef, useState } from "react";
import DefaultLayout from "../layout/defaultLayout";
import { API_URL } from "../auth/constants";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FaceLogin() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string>("");
  const goTo = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        toast.info("Cámara activada");
      }
    } catch (err) {
      toast.error("No se pudo acceder a la cámara");
    }
  };

  const takeAndLogin = async () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error("Cámara no activa");
      return;
    }

    setLoading(true);

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 300, 300);
      const imageData = canvasRef.current.toDataURL("image/png");
      setPhoto(imageData);

      try {
        const res = await fetch(`${API_URL}/face-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ faceImage: imageData }),
        });

        const json = await res.json();
        if (res.ok) {
          toast.success("Login exitoso");
          setTimeout(() => goTo("/dashboard"), 2000);
        } else {
          toast.error(json.body.error || "No se pudo validar el rostro");
        }
      } catch (err) {
        toast.error("Error al conectar con el servidor");
      }
    }

    setLoading(false);
  };

  return (
    <DefaultLayout>
      <h1>Login por rostro</h1>

      <video ref={videoRef} width="300" height="300" autoPlay muted playsInline />
      <canvas ref={canvasRef} width="300" height="300" style={{ display: "none" }} />

      <div style={{ marginTop: "1rem" }}>
        <button onClick={startCamera} className="primary-button">
          Activar Cámara
        </button>
        <button onClick={takeAndLogin} disabled={loading} className="primary-button">
          {loading ? "Validando..." : "Validar Rostro"}
        </button>
      </div>

      {photo && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Imagen capturada:</h3>
          <img src={photo} alt="captura" width={200} />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}
