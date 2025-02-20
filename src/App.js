// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  // Inicializamos el estado de autenticación revisando si hay un token en localStorage.
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Log de estado inicial
  console.log("Estado de autenticación al iniciar App:", isAuthenticated);

  // Función para manejar el éxito del login, actualiza el estado.
  const handleLoginSuccess = () => {
    console.log("Login exitoso, actualizando estado de autenticación a true");
    setIsAuthenticated(true);
  };

  // Función para logout: elimina el token y actualiza el estado.
  const handleLogout = () => {
    console.log("Ejecutando logout: eliminando token y actualizando estado a false");
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // También podemos usar useEffect para observar cambios en isAuthenticated
  useEffect(() => {
    console.log("El estado de autenticación ha cambiado:", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Carta en Línea - Frontend</h1>
      <Routes>
        {/* Si ya está autenticado, redirige automáticamente al dashboard */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;





