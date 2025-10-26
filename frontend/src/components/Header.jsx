import { Link } from 'react-router-dom';
import './Header.css';

function Header({ onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">WiseTraining</h1>
        <nav className="nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/courses" className="nav-link">Cursos</Link>
          <Link to="/groups" className="nav-link">Grupos</Link>
          <button onClick={onLogout} className="logout-btn">Sair</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
