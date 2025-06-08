import { useState } from "react";
import { API_URL } from "../auth/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./dashboard";

export default function AddBuilding() {
  const [name, setName] = useState("");
  const [numDepartments, setNumDepartments] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(numDepartments);
    if (isNaN(count) || count <= 0 || count > 1000) {
      toast.error("Ingresa un número válido de departamentos (1–1000)");
      return;
    }

    const departments = Array.from({ length: count }, (_, i) =>
      i.toString().padStart(3, "0")
    );

    const response = await fetch(`${API_URL}/buildings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, departments }),
    });

    if (response.ok) {
      toast.success("Edificio agregado correctamente");
      setName("");
      setNumDepartments("");
    } else {
      toast.error("Error al guardar el edificio");
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto mt-8"
      >
        <h1 className="text-2xl font-bold">Agregar Edificio</h1>

        <label>Nombre del edificio</label>
        <input
          className="bg-slate-800 text-white rounded px-3 py-2"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Cantidad de departamentos (1 a 1000)</label>
        <input
          className="bg-slate-800 text-white rounded px-3 py-2"
          type="number"
          value={numDepartments}
          onChange={(e) => setNumDepartments(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded"
        >
          Guardar
        </button>

        <ToastContainer position="top-right" autoClose={3000} />
      </form>
    </AuthLayout>
  );
}
