import DefaultLayout from "../layout/defaultLayout";
import AuthLayout from "./dashboard";

export default function DynamicQR() {
  return (
    <AuthLayout>
      <div className="page">
        <h1>Generador de QR Dinámicos</h1>
        <p>Genera códigos QR únicos para tus necesidades.</p>
        <button className="primary-button">Generar Nuevo QR</button>
      </div>
    </AuthLayout>
  );
}
