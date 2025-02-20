// src/components/Dashboard.js
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import CommerceForm from './CommerceForm';

// Componente para el dashboard del OWNER, con menús desplegables para gestionar categorías, productos y configuración.
const OwnerDashboard = () => {
  return (
    <div>
      <h3>Dashboard de Owner</h3>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard/categories">Gestionar Categorías</Link>
          </li>
          <li>
            <Link to="/dashboard/products">Gestionar Productos</Link>
          </li>
          <li>
            <Link to="/dashboard/config">Configuración</Link>
          </li>
        </ul>
      </nav>
      {/* Outlet para mostrar componentes anidados según la ruta */}
      <Outlet />
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  // Obtenemos el token y decodificamos el rol del usuario (solución simple; en producción se recomienda usar un contexto)
  const token = localStorage.getItem('token');
  let userRole = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
      console.log("Rol del usuario:", userRole);
    } catch (error) {
      console.error("Error al decodificar token:", error);
    }
  }

  // Estado para controlar la visibilidad del formulario de creación de comercio (solo para SUPERUSER)
  const [showCommerceForm, setShowCommerceForm] = useState(false);

  // Función de logout que llama al callback y redirige a la página de login
  const handleLogout = () => {
    console.log("Ejecutando logout en Dashboard");
    onLogout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {/* Botón de Logout */}
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </button>
      {userRole === 'SUPERUSER' ? (
        <>
          {/* Solo se muestra el botón para crear comercio */}
          <button onClick={() => setShowCommerceForm(!showCommerceForm)}>
            {showCommerceForm ? 'Ocultar Formulario de Comercio' : 'Crear Nuevo Comercio'}
          </button>
          {showCommerceForm && <CommerceForm />}
          <Outlet />
        </>
      ) : (
        // Dashboard para OWNER
        <OwnerDashboard />
      )}
    </div>
  );
};

export default Dashboard;
