// src/layouts/DefaultLayout.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../styles/ThemeContext'; // Hook personalizado para manejar el tema
import ThemeSwitch from '../styles/ThemeSwitch'; // Nuevo switch de cambio de tema

interface DefaultLayoutProps {
  children: React.ReactNode;
}

// Función para obtener la hora/fecha actual formateada (Chile)
function getFormattedTime() {
  const now = new Date();
  const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const weekday = now.toLocaleDateString('es-CL', { weekday: 'long' });
  return { time, date, weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1) };
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [dateTime, setDateTime] = useState(getFormattedTime());
  const { theme } = useTheme();

  // Actualizamos la hora cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getFormattedTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-content relative min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">

      {/* Switch de tema en la esquina superior derecha */}
      <ThemeSwitch />

      {/* Contenedor principal */}
      <div className="flex flex-col items-center w-full">

        {/* Barra superior con hora/fecha */}
        <div className="info-bar flex flex-col justify-center p-4 rounded-t-2xl w-full max-w-4xl">
          <div className="flex flex-col items-start text-white">
            <div className="text-2xl font-bold">{dateTime.time}</div>
            <div className="text-lg">{dateTime.date}</div>
            <div className="text-sm italic">{dateTime.weekday}</div>
          </div>
        </div>

        {/* Imagen principal (fachada edificio) */}
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Edificio Residencial"
          className="rounded-b-2xl shadow-lg w-full max-w-4xl h-auto"
        />

        {/* Botones principales de navegación */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md px-4">
          <Link to="/" className="button-home">Login</Link>
          <Link to="/signup" className="button-home">Signup</Link>
          <Link to="/dynamic-qr" className="button-home">QR Dinámico</Link>
          <Link to="/face-recognition" className="button-home">Recon. Facial</Link>
        </div>

        {/* Botón individual para registrar visita */}
        <div className="flex justify-center mt-6 w-full">
          <Link to="/RVisitas" className="button-home">Registrar Visita</Link>
        </div>

        {/* Nota: Eliminamos el botón viejo de cambiar tema porque ahora usamos <ThemeSwitch /> */}
      </div>

      {/* Renderiza el contenido hijo (por ejemplo, formularios o dashboards) */}
      <div className="mt-8">
        {children}
      </div>
    </main>
  );
}
