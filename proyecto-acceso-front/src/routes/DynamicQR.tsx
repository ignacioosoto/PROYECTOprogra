import { useState } from "react";
import AuthLayout from "./dashboard";

export default function DynamicQR() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerateQR() {
    setLoading(true);
    setError(null);
    setQr(null);

    try {
      const res = await fetch("http://localhost:3500/api/qr/login-generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al generar QR");
      }

      const data = await res.json();
      setQr(data.qr); // QR en base64
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="page">
        <h1>Generador de QR Dinámicos</h1>
        <p>Genera códigos QR únicos para tus necesidades.</p>

        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
          />
        </div>

        <div>
          <label>Contraseña:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>

        <button className="primary-button" onClick={handleGenerateQR} disabled={loading}>
          {loading ? "Generando..." : "Generar Nuevo QR"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {qr && (
          <div style={{ marginTop: "20px" }}>
            <h3>Tu QR Dinámico:</h3>
            <img src={qr} alt="QR Dinámico" />
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

