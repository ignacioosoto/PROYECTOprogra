import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/authProvider";
import DefaultLayout from "../layout/defaultLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";
import LoadingScreen from "../routes/LoadingScreen";

export default function NewOwner() {
  const [fullName, setFullName] = useState("");
  const [rut, setRut] = useState("");
  const [address, setAddress] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [descriptor, setDescriptor] = useState<number[] | null>(null);
  const [faceScanned, setFaceScanned] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const auth = useAuth();
  const goTo = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(`${MODEL_URL}/ssd_mobilenetv1_model`),
          faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68_model`),
          faceapi.nets.faceRecognitionNet.loadFromUri(`${MODEL_URL}/face_recognition_model`),
        ]);
        setModelsLoaded(true);
        toast.success("Modelos de reconocimiento facial cargados");
      } catch (err) {
        console.error("Error cargando modelos:", err);
        toast.error("Error al cargar modelos faciales");
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  const captureFace = async () => {
    if (!modelsLoaded || !videoRef.current) {
      toast.error("Modelos no cargados o cámara no disponible");
      return;
    }

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      const vector = Array.from(detections.descriptor);
      setDescriptor(vector);
      setFaceScanned(true);

      // Captura de imagen
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);

      stopCamera();
      toast.success("Rostro capturado correctamente");
    } else {
      toast.error("No se detectó ningún rostro");
    }
  };

  if (!auth.isAuthenticated) return <Navigate to="/" replace />;
  if (loading) return <LoadingScreen />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!descriptor || descriptor.length !== 128) {
      toast.error("Primero debes escanear tu rostro correctamente");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/owners/with-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, rut, address, descriptor }),
      });

      if (response.ok) {
        toast.success("Propietario registrado exitosamente");
        setTimeout(() => goTo("/dashboard"), 2000);
      } else {
        const json = await response.json();
        toast.error(json.body?.error || "Error al registrar propietario");
      }
    } catch (err) {
      console.error("Error al enviar datos:", err);
      toast.error("Error de red o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit}>
        <h1>Agregar Propietario</h1>

        <label>Nombre completo</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

        <label>RUT</label>
        <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} required />

        <label>Domicilio</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Rostro capturado"
            width={320}
            height={240}
            style={{ marginTop: "1rem", border: "1px solid black" }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width={320}
            height={240}
            style={{ marginTop: "1rem", border: "1px solid black" }}
          />
        )}

        <div style={{ marginTop: "1rem" }}>
          {!faceScanned && (
            <>
              <button type="button" onClick={startCamera} disabled={loading}>
                Iniciar cámara
              </button>
              <button type="button" onClick={captureFace} disabled={!modelsLoaded || loading}>
                Escanear rostro
              </button>
            </>
          )}

          {capturedImage && (
            <button
              type="button"
              onClick={() => {
                setCapturedImage(null);
                setFaceScanned(false);
                setDescriptor(null);
                startCamera(); // reinicia cámara
              }}
            >
              Repetir foto
            </button>
          )}
        </div>

        <button type="submit" disabled={loading || !descriptor}>
          {loading ? "Guardando..." : "Agregar Propietario"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}
