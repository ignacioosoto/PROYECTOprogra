import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../styles/ThemeContext';
import { useAuth } from '../auth/authProvider';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

// 🕒 Formatear fecha y hora actual
function getFormattedTime() {
  const now = new Date();
  const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const weekday = now.toLocaleDateString('es-CL', { weekday: 'long' });
  return {
    time,
    date,
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
  };
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [dateTime, setDateTime] = useState(getFormattedTime());
  const { theme, toggleTheme } = useTheme();
  const auth = useAuth();
  const navigate = useNavigate();

  // 🎨 Aplicar el tema al body
  useEffect(() => {
    const body = document.body;
    body.classList.remove('dark', 'light');
    body.classList.add(theme);

    return () => {
      body.classList.remove('dark', 'light');
    };
  }, [theme]);

  // 🕒 Actualizar la hora cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getFormattedTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-content relative">

      {/* 🔒 Botón de cerrar sesión */}
      <button
        onClick={() => {
          auth.signout();
          navigate('/');
        }}
        className="btn-logout"
      >
        Cerrar sesión
      </button>

      {/* 📦 Contenedor principal */}
      <div className="flex flex-col items-center w-full">

        {/* 🕓 Barra superior con hora y fecha */}
        <div className="info-bar flex flex-col justify-center p-4 rounded-t-2xl w-full max-w-4xl">
          <div className="flex flex-col items-start date-text">
            <div className="text-2xl font-bold">{dateTime.time}</div>
            <div className="text-lg">{dateTime.date}</div>
            <div className="text-sm italic">{dateTime.weekday}</div>
          </div>
        </div>

        {/* 🏢 Imagen principal */}
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Edificio Residencial"
          className="rounded-b-2xl shadow-lg w-full max-w-4xl h-auto"
        />

        {/* 🔘 Menú de navegación */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md px-4">
          <Link to="/signup" className="button-home">Agregar Administrador</Link>
          <Link to="/newowner" className="button-home">Agregar Propietarios</Link>
          <Link to="/addbuilding" className="button-home">Agregar Edificio</Link>
          <Link to="/dynamic-qr" className="button-home">QR Dinámico</Link>
          <Link to="/verificar" className="button-home">Access Point</Link>
          <Link to="/RVisitas" className="button-home">Registrar Visita</Link>
          <Link to="/QRValidation" className="button-home">Validación QR</Link>
        </div>

      </div>

      {/* ⬇️ Contenido secundario (hijos) */}
      <div className="mt-8">
        {children}
      </div>
    </main>
  );
}
