import '../styles/LoadingScreen.css'; // Importa el CSS desde la carpeta styles

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <p>Cargando...</p>
      <p>🚀</p>
      <div className="spinner"></div>
      <small>Recolectando informacion</small>
    </div>
  );
}

export default LoadingScreen;
