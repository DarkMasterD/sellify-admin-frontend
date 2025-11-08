// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Componente para proteger rutas que requieren autenticación
 * Verifica si el usuario está autenticado antes de permitir el acceso
 */
const ProtectedRoute = () => {
  const { autenticado, cargando } = useAuth();

  // Mostrar un loader mientras se verifica la autenticación
  if (cargando) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}
          ></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
