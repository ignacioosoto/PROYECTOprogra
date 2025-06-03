import { useState } from "react";
import QRCode from "react-qr-code"; // ✅ esta es la nueva librería
import DefaultLayout from "../layout/defaultLayout";

export default function DynamicQR() {
  const [token, setToken] = useState("");
  const [showQR, setShowQR] = useState(false);

  const generateToken = () => {
    const newToken = Math.random().toString(36).substring(2, 10);
    setToken(newToken);
    setShowQR(true);
  };

  const accessUrl = `${window.location.origin}/access/${token}`;

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center gap-4 mt-6">
        <button
          onClick={generateToken}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Generar QR de Acceso Temporal
        </button>

        {showQR && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-lg mb-2">Escanea para acceder:</p>
            <div className="bg-white p-4 rounded shadow">
              <QRCode value={accessUrl} size={256} />
            </div>
            <p className="text-sm text-gray-500 mt-2 break-all">{accessUrl}</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
