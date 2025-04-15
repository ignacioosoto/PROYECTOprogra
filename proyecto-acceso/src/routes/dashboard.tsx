import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Navigate to the login page
  };

  const handleSignup = () => {
    navigate("/signup"); // Navigate to the signup page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>nombre de la aplicacion</h1>
      <p style={styles.subtitle}>frasesita epica.</p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        <button style={styles.button} onClick={handleSignup}>
          Signup
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw", // Ensure it takes the full width of the viewport
    backgroundColor: "#ffffff", // White background
    fontFamily: "Arial, sans-serif",
    padding: "1rem", // Padding for responsiveness
    boxSizing: "border-box", // Ensure padding doesn't affect layout
    textAlign: "center", // Center text alignment
  },
  title: {
    fontSize: "2.5rem", // Adjusted for responsiveness
    color: "#333",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.25rem", // Adjusted for responsiveness
    color: "#555",
    marginBottom: "2rem",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column" as const, // Stack buttons vertically on smaller screens
    gap: "1rem",
    width: "100%", // Ensure buttons take full width on smaller screens
    maxWidth: "300px", // Limit button width on larger screens
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    width: "100%", // Make buttons responsive
    textAlign: "center",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
};