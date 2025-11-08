// frontend/src/components/Layout.jsx
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, ClipboardList, LogOut } from 'lucide-react';
import '../css/Layout.css';

const Layout = () => {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  // Función para determinar si una ruta está activa
  const esRutaActiva = (ruta) => {
    return location.pathname === ruta;
  };

  return (
    <div className="layout-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/logo.png" alt="Sellify Logo" className="sidebar-logo" />
            <div className="clinic-info">
              <div className="clinic-title">Sellify</div>
              <div className="clinic-subtitle">Sistema de Sellos</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="nav-menu">
          <div className="nav-section">
            <div className="nav-section-title">Principal</div>
            <Link to="/" className={`nav-item ${esRutaActiva('/') ? 'active' : ''}`}>
              <Home size={20} className="nav-icon" />
              Dashboard
            </Link>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Reportes</div>
            <Link to="/reportes" className={`nav-item ${esRutaActiva('/reportes') ? 'active' : ''}`}>
              <ClipboardList size={20} className="nav-icon" />
              Panel Reportes
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Sistema</div>
            <button onClick={handleLogout} className="nav-item logout-btn">
              <LogOut size={20} className="nav-icon" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
