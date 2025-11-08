// frontend/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from '../config/axios';
import '../css/DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Estado para las peticiones
  const [peticiones, setPeticiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Estado para confirmación de aprobación
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [peticionSeleccionada, setPeticionSeleccionada] = useState(null);

  /**
   * Cargar peticiones desde el backend
   */
  const cargarPeticiones = async () => {
    try {
      setCargando(true);
      setError('');

      const response = await axios.get('/admin/requests'); // Ajustar endpoint según backend
      setPeticiones(response.data || []);
    } catch (err) {
      setError('Error al cargar las peticiones');
      console.error('Error cargando peticiones:', err);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Aprobar una petición
   */
  const aprobarPeticion = async (id) => {
    try {
      await axios.patch(`/admin/approve/${id}`);
      // Recargar las peticiones después de aprobar
      await cargarPeticiones();
      setMostrarConfirmacion(false);
      setPeticionSeleccionada(null);
    } catch (err) {
      setError('Error al aprobar la petición');
      console.error('Error aprobando petición:', err);
    }
  };

  /**
   * Mostrar confirmación de aprobación
   */
  const confirmarAprobacion = (peticion) => {
    setPeticionSeleccionada(peticion);
    setMostrarConfirmacion(true);
  };

  /**
   * Cancelar confirmación
   */
  const cancelarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setPeticionSeleccionada(null);
  };

  /**
   * Formatear fecha
   */
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular índices para paginación
  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const peticionesActuales = peticiones.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(peticiones.length / registrosPorPagina);

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  // Cargar peticiones al montar el componente
  useEffect(() => {
    cargarPeticiones();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Peticiones de Cambio de Rol</h1>
        <p className="dashboard-subtitle">
          Gestiona las solicitudes de usuarios para cambiar su rol en el sistema
        </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* Tabla de peticiones */}
      <div className="dashboard-table-container">
        {cargando ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Cargando peticiones...</p>
          </div>
        ) : peticiones.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">📋</div>
            <h3>No hay peticiones pendientes</h3>
            <p>Cuando los usuarios soliciten cambiar su rol, aparecerán aquí para su revisión.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Fecha de Solicitud</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {peticionesActuales.map((peticion) => (
                    <tr key={peticion.id}>
                      <td>{peticion.id}</td>
                      <td>{peticion.nombre}</td>
                      <td>{peticion.correo}</td>
                      <td>{formatearFecha(peticion.creado_en)}</td>
                      <td>
                        <button
                          className="btn-approve"
                          onClick={() => confirmarAprobacion(peticion)}
                        >
                          Aceptar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`pagination-btn ${paginaActual === numero ? 'active' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && peticionSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Aprobación</h3>
            <p>
              ¿Estás seguro de que deseas aprobar la solicitud de <strong>{peticionSeleccionada.nombre}</strong>
              ({peticionSeleccionada.correo}) para cambiar de rol?
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={cancelarConfirmacion}
              >
                Cancelar
              </button>
              <button
                className="btn-confirm"
                onClick={() => aprobarPeticion(peticionSeleccionada.id)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
