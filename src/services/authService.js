// frontend/src/services/authService.js
import axios from '../config/axios';

/**
 * Servicio de autenticación
 * Todas las funciones para comunicarse con el backend
 */

/**
 * Iniciar sesión
 * @param {Object} credenciales - { email, contrasenia }
 * @returns {Promise} Datos del usuario y token
 */
export const login = async (credenciales) => {
  try {
    const response = await axios.post('/auth/login', credenciales);

    // Guardar token y usuario en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al iniciar sesión' };
  }
};

/**
 * Registrar nuevo usuario
 * @param {Object} datos - { nombre, email, contrasenia }
 * @returns {Promise} Datos del usuario y token
 */
export const registro = async (datos) => {
  try {
    const response = await axios.post('/auth/registro', datos);

    // Guardar token y usuario en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar usuario' };
  }
};

/**
 * Obtener perfil del usuario actual
 * @returns {Promise} Datos del usuario
 */
export const obtenerPerfil = async () => {
  try {
    const response = await axios.get('/auth/perfil');
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener perfil' };
  }
};

/**
 * Verificar si el token es válido
 * @returns {Promise} Estado de validación
 */
export const verificarToken = async () => {
  try {
    const response = await axios.get('/auth/verificar');
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Token inválido' };
  }
};

/**
 * Cerrar sesión
 * Limpia el localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};
