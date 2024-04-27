const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000; // Asegúrate de usar el puerto correcto

// Middleware para CORS
// Permitir solicitudes desde cualquier origen o desde un origen específico
app.use(cors({ origin: '*' })); // Permitir solicitudes desde cualquier origen

// Middleware para solicitudes JSON
app.use(bodyParser.json()); // Permitir solicitudes en formato JSON

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'blog',
});

// Manejar errores de conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Termina si hay un error de conexión
  } else {
    console.log('Conexión establecida con la base de datos MySQL');
  }
});

// Endpoint para obtener categorías
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categoria'; // Consulta para obtener categorías
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener categorías:', err); // Manejar errores
      res.status(500).send('Error al obtener categorías'); // Retornar un error
    } else {
      console.log('Categorías obtenidas:', results); // Mostrar resultados en la consola del servidor
      res.json(results); // Enviar resultados como JSON al cliente
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`); // Confirmar que el servidor está ejecutándose
});
