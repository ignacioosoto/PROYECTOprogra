import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AuthPorvider } from './auth/authProvider';
import { ThemeProvider } from './styles/ThemeContext';
import ThemeSync from './styles/themesync';
import ThemeSwitch from './styles/ThemeSwitch';

import './index.css';

// Rutas principales
import Signup from './routes/signup';
import Login from './routes/login';
import Dashboard from './routes/dashboard';
import ProtectedRoute from './routes/protectedRoute';
import FaceRecognition from './routes/FaceRecognition';
import DynamicQR from './routes/DynamicQR';
import QRValidation from './routes/QRValidation';
import RVisitas from './routes/RVisitas';
import NewOwner from './routes/newowner';
import FaceVerification from './routes/FaceVerification';
import AddBuilding from './routes/AddBuilding';
import AccessLog from './routes/AccessLog';  // <-- NUEVA IMPORTACIÓN

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
    element: <NewOwner />,
  },
  {
    path: "/verificar",
    element: <FaceVerification />,
  },
  {
    path: "/QRValidation",
    element: <QRValidation />,
  },
  {
    path: "/addbuilding",
    element: <AddBuilding />,
  },
  {
    path: "/accesslog",  // <-- NUEVA RUTA
    element: <AccessLog />,
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
