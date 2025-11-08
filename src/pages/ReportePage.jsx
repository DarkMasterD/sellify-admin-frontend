import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../css/ReportePage.css';

const ReportePage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroRol, setFiltroRol] = useState('');
  const [loading, setLoading] = useState(false);

  const [negocios, setNegocios] = useState([]);
  const [filtroRubro, setFiltroRubro] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loadingNegocios, setLoadingNegocios] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, [filtroRol]);

  useEffect(() => {
    fetchNegocios();
  }, [filtroRubro, fechaInicio, fechaFin]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/reportes/usuarios', {
        params: { rol: filtroRol || undefined }
      });
      if (response.data.success) {
        setUsuarios(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNegocios = async () => {
    setLoadingNegocios(true);
    try {
      const response = await axios.get('/reportes/negocios', {
        params: {
          rubro: filtroRubro || undefined,
          fechaInicio: fechaInicio || undefined,
          fechaFin: fechaFin || undefined
        }
      });
      if (response.data.success) {
        setNegocios(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching negocios:', error);
    } finally {
      setLoadingNegocios(false);
    }
  };

  const generatePDFUsuarios = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Usuarios', 20, 10);

    const tableColumn = ['Nombre', 'Correo', 'Rol', 'Creado En', 'Actualizado En'];
    const tableRows = [];

    usuarios.forEach(user => {
      const userData = [
        user.nombre,
        user.correo,
        user.rol,
        new Date(user.creado_en).toLocaleDateString(),
        new Date(user.actualizado_en).toLocaleDateString()
      ];
      tableRows.push(userData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('reporte_usuarios.pdf');
  };

  const generatePDFNegocios = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Negocios', 20, 10);

    const tableColumn = ['Nombre del Negocio', 'Rubro', 'Latitud', 'Longitud', 'Creado En', 'Actualizado En'];
    const tableRows = [];

    negocios.forEach(negocio => {
      const negocioData = [
        negocio.nombre_negocio,
        negocio.rubro,
        negocio.ubicacion_local_lat || 'N/A',
        negocio.ubicacion_local_lon || 'N/A',
        new Date(negocio.creado_en).toLocaleDateString(),
        new Date(negocio.actualizado_en).toLocaleDateString()
      ];
      tableRows.push(negocioData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('reporte_negocios.pdf');
  };

  return (
    <div className="reporte-page">
      <h1>Reportes</h1>
      <div className="reporte-cards">
        <div className="reporte-card">
          <h2>Reporte de Usuarios</h2>
          <div className="reporte-body">
            <div className="filtros">
              <label htmlFor="rol">Filtrar por Rol:</label>
              <select
                id="rol"
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="cliente">Cliente</option>
                <option value="negocio">Negocio</option>
              </select>
            </div>
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <div className="usuarios-preview">
                <h3>Usuarios ({usuarios.length})</h3>
                <ul>
                  {usuarios.slice(0, 5).map((user, index) => (
                    <li key={index}>
                      {user.nombre} - {user.correo} - {user.rol}
                    </li>
                  ))}
                </ul>
                {usuarios.length > 5 && <p>... y {usuarios.length - 5} más</p>}
              </div>
            )}
          </div>
          <button onClick={generatePDFUsuarios} disabled={loading}>
            Descargar PDF
          </button>
        </div>
        <div className="reporte-card">
          <h2>Reporte de Negocios</h2>
          <div className="reporte-body">
            <div className="filtros">
              <label htmlFor="rubro">Filtrar por Rubro:</label>
              <select
                id="rubro"
                value={filtroRubro}
                onChange={(e) => setFiltroRubro(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="otros">Otros</option>
                {/* Add more rubro options as needed */}
              </select>
              <label htmlFor="fechaInicio">Fecha Inicio:</label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <label htmlFor="fechaFin">Fecha Fin:</label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            {loadingNegocios ? (
              <p>Cargando...</p>
            ) : (
              <div className="negocios-preview">
                <h3>Negocios ({negocios.length})</h3>
                <ul>
                  {negocios.slice(0, 5).map((negocio, index) => (
                    <li key={index}>
                      {negocio.nombre_negocio} - {negocio.rubro}
                    </li>
                  ))}
                </ul>
                {negocios.length > 5 && <p>... y {negocios.length - 5} más</p>}
              </div>
            )}
          </div>
          <button onClick={generatePDFNegocios} disabled={loadingNegocios}>
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportePage;
