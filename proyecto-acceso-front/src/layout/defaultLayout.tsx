import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../styles/ThemeContext'; // Hook personalizado para manejar el tema
import ThemeSwitch from '../styles/ThemeSwitch'; // Nuevo switch de cambio de tema
import clsx from 'clsx'; // para manejar clases condicionales fácilmente


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
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getFormattedTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-content relative min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <ThemeSwitch />

      <div className="flex flex-col items-center w-full">

        {/* Barra superior con hora/fecha */}
        <div className="info-bar flex flex-col justify-center p-4 rounded-t-2xl w-full max-w-4xl bg-gray-800 dark:bg-gray-700">
          <div
            className={clsx(
              'flex flex-col items-start',
              theme === 'light' ? 'text-black' : 'text-white'
            )}
          >
            <div className="text-2xl font-bold">{dateTime.time}</div>
            <div className="text-lg">{dateTime.date}</div>
            <div className="text-sm italic">{dateTime.weekday}</div>
          </div>
        </div>

        {/* Imagen principal */}
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Edificio Residencial"
          className="rounded-b-2xl shadow-lg w-full max-w-4xl h-auto"
        />

        {/* Navegación principal */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md px-4">
          <Link to="/" className="button-home">Login</Link>
          <Link to="/dynamic-qr" className="button-home">QR Dinámico</Link>
          <Link to="/verificar" className="button-home">Access Point</Link>
          <Link to="/RVisitas" className="button-home">Registrar Visita</Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mt-8">
        {children}
      </div>
    </main>
  );
}
