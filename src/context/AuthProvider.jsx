// frontend/src/context/AuthProvider.jsx
import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import * as authService from '../services/authService';

// Solo exportar el componente Provider
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  /**
   * Verificar si hay token guardado y si es válido
   */
  const verificarSesion = useCallback(async () => {
    try {
      const tokenGuardado = localStorage.getItem('token');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (tokenGuardado && usuarioGuardado) {
        // Verificar que el token sigue siendo válido
        const response = await authService.verificarToken();

        if (response.success) {
          setToken(tokenGuardado);
          setUsuario(JSON.parse(usuarioGuardado));
          setAutenticado(true);
        } else {
          // Token inválido, limpiar
          cerrarSesion();
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      cerrarSesion();
    } finally {
      setCargando(false);
    }
  }, []); 

  // Verificar si hay sesión activa al cargar la aplicación
  useEffect(() => {
    verificarSesion();
  }, [verificarSesion]);

  /**
   * Iniciar sesión
   * @param {Object} credenciales - { email, contrasenia }
   */
  const iniciarSesion = async (credenciales) => {
    try {
      const response = await authService.login(credenciales);

      setToken(response.token);
      setUsuario(response.usuario);
      setAutenticado(true);

      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        mensaje: error.mensaje || 'Error al iniciar sesión'
      };
    }
  };

  /**
   * Registrar nuevo usuario
   * @param {Object} datos - { nombre, email, contrasenia }
   */
  const registrarUsuario = async (datos) => {
    try {
      const response = await authService.registro(datos);

      setToken(response.token);
      setUsuario(response.usuario);
      setAutenticado(true);

      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        mensaje: error.mensaje || 'Error al registrar usuario'
      };
    }
  };

  /**
   * Cerrar sesión
   */
  const cerrarSesion = () => {
    authService.logout();
    setToken(null);
    setUsuario(null);
    setAutenticado(false);
  };

  /**
   * Actualizar datos del usuario
   * @param {Object} nuevosDatos - Datos actualizados del usuario
   */
  const actualizarUsuario = (nuevosDatos) => {
    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    setUsuario(usuarioActualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
  };

  // Valor del contexto que se compartirá
  const value = {
    usuario,
    token,
    autenticado,
    cargando,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    actualizarUsuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
