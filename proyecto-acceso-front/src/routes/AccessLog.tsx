import { useEffect, useState } from "react";
import { useAuth } from "../auth/authProvider";
import { Navigate, useNavigate } from "react-router-dom";

interface LogEntry {
  _id: string;
  fullName: string;
  building: string;
  department: string;
  accessPoint: string;
  entryTime: string;
  exitTime?: string;
}

export default function AccessLog() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetch("/api/accesslog")
      .then(res => res.json())
      .then((data: LogEntry[]) => {
        setLogs(data);
        const uniqueBuildings: string[] = [...new Set(data.map((log) => log.building))];
        setBuildings(uniqueBuildings);
      });
  }, []);

  const fetchLogs = () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (selectedBuilding) params.append("building", selectedBuilding);

    fetch(`/api/accesslog?${params.toString()}`)
      .then(res => res.json())
      .then((data: LogEntry[]) => setLogs(data));
  };

  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Historial de Accesos</h2>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Inicio
      </button>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Edificio: </label>
          <select value={selectedBuilding} onChange={e => setSelectedBuilding(e.target.value)}>
            <option value="">Todos</option>
            {buildings.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Desde: </label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Hasta: </label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        <button onClick={fetchLogs} style={{ marginTop: "0.5rem" }}>Buscar</button>
      </div>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edificio</th>
            <th>Dpto</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Punto</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td>{log.fullName}</td>
              <td>{log.building}</td>
              <td>{log.department}</td>
              <td>{new Date(log.entryTime).toLocaleString()}</td>
              <td>{log.exitTime ? new Date(log.exitTime).toLocaleString() : "—"}</td>
              <td>{log.accessPoint || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
