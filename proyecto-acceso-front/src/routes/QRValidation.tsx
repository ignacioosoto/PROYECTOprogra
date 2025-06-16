// src/pages/QRValidation.tsx
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./dashboard";

const API_URL = "http://localhost:3500/api";

export default function QRValidation() {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: true,
            },
      /* verbose= */ false
        );

        const onScanSuccess = async (decodedText: string) => {
            scanner.clear(); // Detener escaneo tras lectura exitosa
            toast.info("QR detectado, validando...");

            try {
                const response = await fetch(`${API_URL}/validate-qr`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: decodedText }),
                });

                const data = await response.json();

                if (response.ok) {
                    toast.success(`✅ Acceso autorizado: ${data.owner.name}`);
                    // Aquí puedes hacer algo como abrir la puerta, registrar ingreso, etc.
                } else {
                    toast.error(`❌ Acceso denegado: ${data.error}`);
                }
            } catch (err) {
                console.error("Error al validar QR:", err);
                toast.error("Error de conexión con el servidor");
            }
        };

        const onScanFailure = (error: any) => {
            // Se puede ignorar escaneos fallidos frecuentes
        };

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch((e) => console.error("Error al limpiar escáner", e));
        };
    }, []);

    return (
        <AuthLayout>
            <h1>Verificación por Código QR</h1>
            <div id="qr-reader" style={{ width: "100%", maxWidth: "400px", margin: "auto" }} />
            <ToastContainer position="top-right" autoClose={3000} />
        </AuthLayout>
    );
}
