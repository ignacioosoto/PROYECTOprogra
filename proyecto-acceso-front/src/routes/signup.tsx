import { useState } from "react";
import { useAuth } from "../auth/authProvider";
import DefaultLayout from "../layout/defaultLayout";
import { Navigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const auth = useAuth()

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />
  }
  return (
    <DefaultLayout>
      <form className="form">
        <h1>Signup</h1>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Username</label>
        <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button>Create User</button>
      </form>
    </DefaultLayout>
  )

}