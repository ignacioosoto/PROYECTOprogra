// src/layouts/DefaultLayout.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../styles/ThemeContext'; // Importamos el hook del contexto de tema

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function getFormattedTime() {
  const now = new Date();
  const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const weekday = now.toLocaleDateString('es-CL', { weekday: 'long' });
  return { time, date, weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1) };
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [dateTime, setDateTime] = useState(getFormattedTime());
  const { theme, toggleTheme } = useTheme(); // Obtener el tema actual y la función para alternarlo

  useEffect(() => {
    // Cambiar la clase del body según el tema
    const body = document.body;
    body.classList.remove('dark', 'light');
    body.classList.add(theme);

    return () => {
      body.classList.remove('dark', 'light');
    };
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getFormattedTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-content">
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

        {/* Imagen de la casa op */}
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Edificio Residencial"
          className="rounded-b-2xl shadow-lg w-full max-w-4xl h-auto"
        />

        {/* Botones para navegar */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md px-4">
          <Link to="/" className="button-home">Login</Link>
          <Link to="/signup" className="button-home">Signup</Link>
          <Link to="/dynamic-qr" className="button-home">QR Dinámico</Link>
          <Link to="/face-recognition" className="button-home">Recon. Facial</Link>
        </div>
{/* Botón "Registrar Visita" centrado (si agregamos otro boton sacarlo) */}
<div className="flex justify-center mt-6 w-full">
  <Link to="/RVisitas" className="button-home">Registrar Visita</Link>
</div>
        {/* Botón de cambio de tema */}
        <button
          onClick={toggleTheme}
          className="mt-4 p-2 bg-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
        >
          Cambiar Tema
        </button>
      </div>

      {/* Aquí renderizas los hijos */}
      <div className="mt-8">
        {children}
      </div>
    </main>
  );
}
