import React, { useEffect, useState } from 'react';

function App() {
  // Estado para almacenar la respuesta del backend
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    // Obtener la URL de la API desde la variable de entorno
    const apiUrl = process.env.REACT_APP_API_URL;

    // Realizar la petición al backend
    fetch(apiUrl)
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => {
        console.error('Error al conectar con el backend:', error);
        setMessage('Error al conectar con el backend');
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Carta en Línea - Frontend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
