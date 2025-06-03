import { useParams } from "react-router-dom";

export default function TokenAccess() {
  const { token } = useParams();

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Acceso por QR</h1>
      <p className="mt-4">Token recibido:</p>
      <code className="bg-gray-200 p-2 rounded">{token}</code>
    </div>
  );
}
