// src/index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthPorvider } from './auth/authProvider.tsx';
import { ThemeProvider } from './styles/ThemeContext'; // Proveedor del tema
import ThemeSync from './styles/themesync'; // Sincroniza el tema con el body

import './index.css';

import Signup from './routes/signup.tsx';
import Login from './routes/login.tsx';
import Dashboard from './routes/dashboard.tsx';
import ProtectedRoute from './routes/protectedRoute.tsx';
import FaceRecognition from './routes/FaceRecognition.tsx';
import DynamicQR from './routes/DynamicQR.tsx';
import RVisitas from './routes/RVisitas.tsx';
import NewOwner from './routes/newowner.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
    element: <NewOwner />, // agrega esta línea si no existe
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element:<Dashboard/>, // Remove {null}, just use <Dashboard />
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AuthPorvider>
      <ThemeProvider>
        <ThemeSync /> {/* Aplica la clase light-mode al body si el tema lo requiere */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthPorvider>
  </StrictMode>
);
