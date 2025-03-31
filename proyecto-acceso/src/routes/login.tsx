import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupNavigation = () => {
    navigate('/signup'); // Navigate to the signup route
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form>
        {/* Your login form fields */}
        <button type="submit">Login</button>
      </form>
      <button onClick={handleSignupNavigation}>Registro</button>
    </div>
  );
};

export default Login;