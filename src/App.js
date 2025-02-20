// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Componente principal de la aplicación
function App() {
  // Estado para saber si el usuario está autenticado (basado en si existe el token en localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Función para manejar el éxito del login, que actualiza el estado de autenticación
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Carta en Línea - Frontend</h1>
      {/* Definición de rutas usando React Router */}
      <Routes>
        {/* Ruta para el login. Si el usuario no está autenticado, se muestra el formulario de Login */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        {/* Ruta protegida para el dashboard: si el usuario está autenticado se muestra el Dashboard,
            de lo contrario se redirige al login */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        {/* Ruta raíz: redirige al dashboard si está autenticado, o al login si no */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        {/* Puedes agregar rutas adicionales según avances en el desarrollo */}
      </Routes>
    </div>
  );
}

export default App;

