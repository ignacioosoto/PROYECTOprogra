import DefaultLayout from "../layout/defaultLayout";

export default function DynamicQR() {
  return (
    <DefaultLayout>
      <div className="page">
        <h1>Generador de QR Dinámicos</h1>
        <p>Genera códigos QR únicos para tus necesidades.</p>
        <button className="primary-button">Generar Nuevo QR</button>
      </div>
    </DefaultLayout>
  );
}
