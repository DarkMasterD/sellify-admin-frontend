import { useState, useEffect } from 'react';
import axios from '../config/axios';
import '../css/NegociosPage.css';

const NegociosPage = () => {
  // Estado para los negocios
  const [negocios, setNegocios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 20;

  // Estado para confirmación de actualización de todos los códigos
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  /**
   * Cargar negocios desde el backend
   */
  const cargarNegocios = async () => {
    try {
      setCargando(true);
      setError('');

      const response = await axios.get('/admin/listar-negocios');
      setNegocios(response.data || []);
    } catch (err) {
      setError('Error al cargar los negocios');
      console.error('Error cargando negocios:', err);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Actualizar todos los códigos de acceso
   */
  const actualizarTodosCodigos = async () => {
    try {
      await axios.patch('/admin/actualizar-codigos-todos');
      // Recargar los negocios después de actualizar
      await cargarNegocios();
      setMostrarConfirmacion(false);
    } catch (err) {
      setError('Error al actualizar los códigos de acceso');
      console.error('Error actualizando códigos:', err);
    }
  };

  /**
   * Generar código de acceso para un negocio específico
   */
  const generarCodigo = async (idUsuario) => {
    try {
      const response = await axios.post(`/admin/generar-codigo/${idUsuario}`);
      if (response.data.success) {
        // Actualizar el negocio en la lista
        setNegocios(negocios.map(negocio =>
          negocio.id_usuario === idUsuario ? response.data.negocio : negocio
        ));
      }
    } catch (err) {
      setError('Error al generar el código de acceso');
      console.error('Error generando código:', err);
    }
  };

  /**
   * Mostrar confirmación de actualización de todos los códigos
   */
  const confirmarActualizacion = () => {
    setMostrarConfirmacion(true);
  };

  /**
   * Cancelar confirmación
   */
  const cancelarConfirmacion = () => {
    setMostrarConfirmacion(false);
  };

  // Calcular índices para paginación
  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const negociosActuales = negocios.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(negocios.length / registrosPorPagina);

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  // Cargar negocios al montar el componente
  useEffect(() => {
    cargarNegocios();
  }, []);

  return (
    <div className="negocios-container">
      <div className="negocios-header">
        <h1 className="negocios-title">Códigos de Acceso</h1>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="negocios-error">
          {error}
        </div>
      )}

      {/* Botón para actualizar todos los códigos */}
      <div className="negocios-actions">
        <button
          className="btn-update-all"
          onClick={confirmarActualizacion}
        >
          Actualizar Todos los Códigos
        </button>
      </div>

      {/* Tabla de negocios */}
      <div className="negocios-table-container">
        {cargando ? (
          <div className="negocios-loading">
            <div className="loading-spinner"></div>
            <p>Cargando negocios...</p>
          </div>
        ) : negocios.length === 0 ? (
          <div className="negocios-empty">
            <div className="empty-icon">🏢</div>
            <h3>No hay negocios registrados</h3>
            <p>Los negocios aparecerán aquí una vez que se registren.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="negocios-table">
                <thead>
                  <tr>
                    <th>ID Usuario</th>
                    <th>Nombre del Negocio</th>
                    <th>Rubro</th>
                    <th>Código de Acceso</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {negociosActuales.map((negocio) => (
                    <tr key={negocio.id_usuario}>
                      <td>{negocio.id_usuario}</td>
                      <td>{negocio.nombre_negocio}</td>
                      <td>{negocio.rubro}</td>
                      <td>{negocio.codigo_acceso}</td>
                      <td>
                        <button
                          className="btn-generate"
                          onClick={() => generarCodigo(negocio.id_usuario)}
                        >
                          Generar Código
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
      {mostrarConfirmacion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Actualización</h3>
            <p>
              ¿Estás seguro de que deseas actualizar todos los códigos de acceso?
              Esta acción no se puede deshacer.
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
                onClick={actualizarTodosCodigos}
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

export default NegociosPage;
