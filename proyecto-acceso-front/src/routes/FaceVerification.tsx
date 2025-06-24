import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import DefaultLayout from "../layout/defaultLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function FaceVerification() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [result, setResult] = useState<null | { fullName: string; building: string; department: string }>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

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
        toast.success("Modelos cargados");
        startCamera();
      } catch (error) {
        console.error("Error cargando modelos:", error);
        toast.error("No se pudieron cargar los modelos faciales");
      }
    };

    loadModels();

    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      toast.error("No se pudo acceder a la cámara");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  const verifyFace = async () => {
    setLoading(true);
    setResult(null);
    setNotFound(false);

    if (!videoRef.current || !modelsLoaded) {
      toast.error("Modelos no cargados o cámara no disponible");
      setLoading(false);
      return;
    }

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      toast.error("No se detectó ningún rostro");
      setLoading(false);
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    try {
      const response = await fetch(`${API_URL}/owners/verify-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descriptor, accessPoint: "Ingreso Principal" }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.owner);
        toast.success("✅ Acceso autorizado");
      } else {
        setNotFound(true);
        toast.warning("❌ Rostro no reconocido");
      }
    } catch (err) {
      console.error("Error al verificar:", err);
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <h1>Verificación de Identidad Facial</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width={320}
        height={240}
        style={{ border: "1px solid black", marginBottom: "1rem" }}
      />

      <div>
        <button onClick={verifyFace} disabled={!modelsLoaded || loading}>
          {loading ? "Verificando..." : "Verificar rostro"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h3>✅ Acceso autorizado</h3>
          <p><strong>Propietario:</strong> {result.fullName}</p>
          <p><strong>Edificio:</strong> {result.building}</p>
          <p><strong>Departamento:</strong> {result.department}</p>
        </div>
      )}

      {notFound && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <h3>❌ Rostro no reconocido</h3>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </DefaultLayout>
  );
}
