import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signup from './routes/signup.tsx'
import Login from './routes/login.tsx'
import Dashboard from './routes/dashboard.tsx'
import ProtectedRoute from './routes/protectedRoute.tsx'
import { AuthPorvider } from './auth/authProvider.tsx'


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
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);


createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AuthPorvider>
      <RouterProvider router={router} />
    </AuthPorvider>
  </StrictMode>,
)
