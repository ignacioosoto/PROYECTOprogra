import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AuthPorvider } from './auth/authProvider.tsx';
import { ThemeProvider } from './styles/ThemeContext';
import ThemeSync from './styles/themesync';
import ThemeSwitch from './styles/ThemeSwitch';

import './index.css';

// Rutas principales
import Signup from './routes/signup.tsx';
import Login from './routes/login.tsx';
import Dashboard from './routes/dashboard.tsx';
import ProtectedRoute from './routes/protectedRoute.tsx';
import FaceRecognition from './routes/FaceRecognition.tsx';
import DynamicQR from './routes/DynamicQR.tsx';
import RVisitas from './routes/RVisitas.tsx';
import NewOwner from './routes/newowner.tsx';
import FaceVerification from './routes/FaceVerification.tsx'; // ✅ NUEVA ruta

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // login es la raíz
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/face-recognition",
    element: <FaceRecognition />,
  },
  {
    path: "/dynamic-qr",
    element: <DynamicQR />,
  },
  {
    path: "/RVisitas",
    element: <RVisitas />,
  },
  {
    path: "/newowner",
    element: <NewOwner />,
  },
  {
    path: "/verificar", // ✅ Ruta para verificación facial
    element: <FaceVerification />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Dashboard children={undefined} />,
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AuthPorvider>
      <ThemeProvider>
        <ThemeSync />
        <ThemeSwitch />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthPorvider>
  </StrictMode>
);
