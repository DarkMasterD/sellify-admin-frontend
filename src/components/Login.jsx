// frontend/src/components/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importar desde hooks
import '../css/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  // Estado del formulario
  const [credenciales, setCredenciales] = useState({
    correo: 'admin@gmail.com',
    contrasena: '123'
  });

  // Estado de la UI
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!credenciales.correo || !credenciales.contrasena) {
      setError('Por favor completa todos los campos');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const resultado = await iniciarSesion(credenciales);

      if (resultado.success) {
        // Login exitoso, redirigir al dashboard o home
        navigate('/');
      } else {
        setError(resultado.mensaje || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error('Error en login:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-container">
          <img src="/logo.png" alt="Sellify Logo" className="login-logo" />
        </div>

        {/* Título */}
        <h2 className="login-title">Iniciar Sesión</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <div className="login-form-group">
            <label htmlFor="correo" className="login-form-label">
              Email
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={credenciales.correo}
              onChange={handleChange}
              className="login-form-input"
              placeholder="tu@email.com"
              disabled={cargando}
            />
          </div>

          {/* Contraseña */}
          <div className="login-form-group">
            <label htmlFor="contrasena" className="login-form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={credenciales.contrasena}
              onChange={handleChange}
              className="login-form-input"
              placeholder="••••••••"
              disabled={cargando}
            />
          </div>

          {/* Mensaje de error */}
          {error && <div className="login-error-message">{error}</div>}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={cargando}
            className={`login-submit-button ${cargando ? 'login-submit-button-loading' : 'login-submit-button-normal'}`}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
