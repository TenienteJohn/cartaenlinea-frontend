// src/components/CommerceForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

/*
  Este componente permite al SUPERUSER gestionar los comercios (tenants):
    - Crear un comercio ingresando su nombre, subdominio y las credenciales para el usuario OWNER.
    - Listar los comercios creados en tarjetas.
    - Eliminar un comercio.
  
  La lógica multi-tenant en el backend asegura que, al crear un comercio, el owner se asocia correctamente.
*/
const CommerceForm = ({ onCommerceCreated }) => {
  // Estados para el formulario de creación
  const [businessName, setBusinessName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para el listado de comercios
  const [commerces, setCommerces] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');

  // Recuperar el token del SUPERUSER desde localStorage
  const token = localStorage.getItem('token');

  // Función para obtener la lista de comercios del backend
  const fetchCommerces = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/commerces`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommerces(response.data);
    } catch (err) {
      console.error("Error al obtener comercios:", err);
      setListError("Error al obtener comercios");
    } finally {
      setListLoading(false);
    }
  };

  // Ejecutar fetchCommerces al montar el componente
  useEffect(() => {
    fetchCommerces();
  }, []);

  // Función para manejar el envío del formulario de creación de comercio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Datos para crear el comercio
      const commerceData = {
        business_name: businessName,
        subdomain: subdomain
      };

      // Llamada al endpoint POST /api/commerces para crear el comercio
      const commerceResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/commerces`,
        commerceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const commerce = commerceResponse.data;

      // Datos para crear el usuario OWNER asociado al comercio recién creado
      const ownerData = {
        email: ownerEmail,
        password: ownerPassword,
        role: "OWNER",
        commerce_id: commerce.id
      };

      // Llamada al endpoint POST /api/auth/register para crear el owner
      const ownerResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        ownerData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Llamar al callback opcional para notificar al padre, si se proporciona
      if (onCommerceCreated) {
        onCommerceCreated(commerce, ownerResponse.data.user);
      }

      alert("Comercio y usuario owner creados correctamente.");
      // Refrescar la lista de comercios
      fetchCommerces();
      // Limpiar el formulario
      setBusinessName('');
      setSubdomain('');
      setOwnerEmail('');
      setOwnerPassword('');
    } catch (err) {
      console.error("Error al crear comercio:", err);
      setError('Error al crear comercio. Revisa los datos e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un comercio mediante el endpoint DELETE
  const handleDeleteCommerce = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/commerces/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Actualizar la lista de comercios después de la eliminación
      fetchCommerces();
    } catch (err) {
      console.error("Error al eliminar comercio:", err);
      alert("Error al eliminar comercio.");
    }
  };

  return (
    <div>
      <h2>Gestión de Comercios (Tenants)</h2>

      {/* Formulario para crear un nuevo comercio */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>Crear Nuevo Comercio</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Nombre del Comercio:</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subdominio:</label>
          <input
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
          />
        </div>
        <h4>Credenciales para el Owner</h4>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={ownerPassword}
            onChange={(e) => setOwnerPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Comercio'}
        </button>
      </form>

      {/* Listado de comercios en tarjetas */}
      <h3>Comercios Creados</h3>
      {listLoading ? (
        <p>Cargando comercios...</p>
      ) : listError ? (
        <p style={{ color: 'red' }}>{listError}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {commerces.map((commerce) => (
            <div key={commerce.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '250px' }}>
              <p><strong>ID:</strong> {commerce.id}</p>
              <p><strong>Nombre:</strong> {commerce.business_name}</p>
              <p><strong>Subdominio:</strong> {commerce.subdomain}</p>
              {/* Si se desea, se pueden mostrar credenciales del owner si se guardan */}
              <button onClick={() => handleDeleteCommerce(commerce.id)}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommerceForm;
