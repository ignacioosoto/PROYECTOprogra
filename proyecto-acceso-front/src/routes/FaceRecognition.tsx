import DefaultLayout from "../layout/defaultLayout";
import { useRef, useState } from "react";

export default function FaceRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string>("");

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
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 400, 300);
        const imageData = canvasRef.current.toDataURL('image/png');
        setPhoto(imageData);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="page" style={{ textAlign: "center" }}>
        <h1>Reconocimiento Facial</h1>
        <video ref={videoRef} width="400" height="300" style={{ borderRadius: "1rem", marginBottom: "1rem" }} />
        <div className="flex gap-4 justify-center">
          <button className="primary-button" onClick={startCamera}>Conectar Cámara</button>
          <button className="primary-button" onClick={takePhoto}>Capturar Foto</button>
        </div>
        <canvas ref={canvasRef} width="400" height="300" style={{ display: "none" }} />
        {photo && (
          <div style={{ marginTop: "1rem" }}>
            <h2>Foto capturada:</h2>
            <img src={photo} alt="captured" style={{ borderRadius: "1rem", marginTop: "0.5rem" }} />
            <a href={photo} download="foto-reconocimiento.png" className="primary-button" style={{ marginTop: "1rem", display: "inline-block" }}>
              Descargar Imagen
            </a>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
