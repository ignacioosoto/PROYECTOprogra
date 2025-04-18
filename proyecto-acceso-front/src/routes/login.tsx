import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider";
import DefaultLayout from "../layout/defaultLayout";
import { useState } from "react"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const auth = useAuth()

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />
  }
  return (
    <DefaultLayout>
      <form className="form">
        <h1>Login</h1>

        <label>Username</label>
        <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button>Login</button>
      </form>
    </DefaultLayout>
  )

}