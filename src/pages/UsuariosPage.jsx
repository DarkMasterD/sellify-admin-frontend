import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import Select from 'react-select';
import { Pencil, Check, X } from 'lucide-react';
import '../css/UsuariosPage.css';

const UsuariosPage = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const roleOptions = [
    { value: 'negocio', label: 'Negocio' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'admin', label: 'Admin' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (id, currentRole) => {
    setEditingId(id);
    setSelectedRole(currentRole);
  };

  const handleCancel = () => {
    setEditingId(null);
    setSelectedRole('');
  };

  const handleConfirm = async () => {
    try {
      await axiosInstance.patch(`/admin/change-role/${editingId}/${selectedRole}`);
      await fetchUsers();
      setEditingId(null);
      setSelectedRole('');
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="usuarios-page">
      <h1>Usuarios</h1>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Creado En</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.correo}</td>
              <td>{user.rol}</td>
              <td>{formatDate(user.creado_en)}</td>
              <td>
                {editingId === user.id ? (
                  <div className="edit-controls">
                    <Select
                      value={roleOptions.find(option => option.value === selectedRole)}
                      onChange={(option) => setSelectedRole(option.value)}
                      options={roleOptions}
                      className="role-select"
                      classNamePrefix="select"
                    />
                    <button onClick={handleConfirm} className="confirm-btn">
                      <Check size={16} />
                    </button>
                    <button onClick={handleCancel} className="cancel-btn">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(user.id, user.rol)} className="edit-btn">
                    <Pencil size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosPage;
