import { useState } from "react";
import DefaultLayout from "../layout/defaultLayout";

const API_URL = import.meta.env.VITE_API_URL;

export default function DynamicQR() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateQR() {
    setLoading(true);
    setError(null);
    setQr(null);

    try {
      const res = await fetch(`${API_URL}/api/qr/login-generate-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al generar QR");
      }

      const data = await res.json();
      setQr(data.qr); // Asumimos base64
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado al generar QR.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <DefaultLayout>
      <div className="page">
        <h1>Generador de QR Dinámicos</h1>
        <p className="text-lg text-blue-600 font-bold mb-4">
          Genera códigos QR únicos para tus necesidades.
        </p>

        <div className="mb-3">
          <label>Email:</label><br />
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
          />
        </div>

        <div className="mb-3">
          <label>Contraseña:</label><br />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>

        <button
          className="primary-button"
          onClick={handleGenerateQR}
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar Nuevo QR"}
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        {qr && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold">Tu QR Dinámico:</h3>
            <img src={qr} alt="QR Dinámico" className="mx-auto mt-2" />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
