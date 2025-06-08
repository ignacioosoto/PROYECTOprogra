import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../styles/ThemeContext';
import { useAuth } from '../auth/authProvider';

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

export default function AuthLayout({ children }: DefaultLayoutProps) {
  const [dateTime, setDateTime] = useState(getFormattedTime());
  const { theme, toggleTheme } = useTheme();
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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
    <main className="main-content relative"> {/* <-- Agregamos relative aquí */}

      {/* Botón de cerrar sesión arriba a la izquierda */}
      <button
        onClick={() => {
          auth.signout();
          navigate('/');
        }}
        className="btn-logout"
      >
        Cerrar sesión
      </button>


      {/* Contenedor principal */}
      <div className="flex flex-col items-center w-full">

        {/* Barra superior con hora/fecha */}
        <div className="info-bar flex flex-col justify-center p-4 rounded-t-2xl w-full max-w-4xl">
          <div className="flex flex-col items-start date-text">
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
          <Link to="/signup" className="button-home">Agregar Administrador</Link>
          <Link to="/newowner" className="button-home">Agregar Propietarios</Link>
<<<<<<< HEAD
          <Link to="/addbuilding" className="button-home">Agregar Edificio</Link>
=======
>>>>>>> fcd6949c6522205839f41969179546eabc6a78ee
          <Link to="/dynamic-qr" className="button-home">QR Dinámico</Link>
          <Link to="/verificar" className="button-home">Access Point</Link>
          <Link to="/RVisitas" className="button-home">Registrar Visita</Link>
        </div>
<<<<<<< HEAD

=======
>>>>>>> fcd6949c6522205839f41969179546eabc6a78ee

      </div>

      {/* Aquí renderizas los hijo */}
      <div className="mt-8">
        {children}
      </div>
    </main>
  );
}
