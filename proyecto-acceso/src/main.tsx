import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Singup from './routes/singup.tsx'
import Login from './routes/login.tsx'
import Dashboard from './routes/dashboard.tsx'
import ProtectedRoute from './routes/protectedRoute.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/singup",
    element: <Singup />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      }
    ],
  },
]);


createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
