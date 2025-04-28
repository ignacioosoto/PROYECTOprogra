import { Link } from "react-router-dom";
import { useState } from "react";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <nav className="nav">
          <div className="nav-container">
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              ☰
            </button>
            <ul className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
              <li><Link to="/">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
              <li><Link to="/face-recognition">Reconocimiento Facial</Link></li>
              <li><Link to="/dynamic-qr">QR Dinámico</Link></li>
            </ul>
          </div>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
    </>
  );
}
