import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import AuthLayout from "./dashboard";

export default function DynamicQR() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");
  const qrRef = useRef(null);

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setError("");
    setQrValue("");

    const response = await fetch("http://localhost:3500/api/qr/verify-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Genera el QR con los datos recibidos del backend
      setQrValue(JSON.stringify(data));
    } else {
      setError(data.error || "Error al verificar usuario");
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "codigo-qr.png";
    link.href = url;
    link.click();
  };

  return (
    <AuthLayout>
      <div className="page">
        <h1>Generador de Código QR Dinámico</h1>

        {/* Formulario de ingreso */}
        <form onSubmit={handleGenerateQR} className="flex flex-col gap-4 items-center mt-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="primary-button">
            Generar QR
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        {/* QR generado */}
        {qrValue && (
          <div className="flex flex-col items-center mt-6">
            <h2>Código QR generado:</h2>
            <div ref={qrRef} style={{ margin: "1rem" }}>
              <QRCodeCanvas value={qrValue} size={256} />
            </div>
            <button onClick={handleDownload} className="primary-button">
              Descargar QR
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
