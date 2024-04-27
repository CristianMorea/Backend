const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000; // Usar variable de entorno para el puerto

// Middleware para CORS
app.use(cors({
  origin: ['http://localhost:8080'], // Restringir orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', // Configuración segura para el host
  user: process.env.DB_USER || 'root', // Usar variables de entorno para configuración sensible
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'blog',
});

// Manejo de errores de conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err); // Mostrar error en la consola
    process.exit(1); // Salir si hay un error de conexión
  } else {
    console.log('Conexión establecida con la base de datos MySQL'); // Conexión exitosa
  }
});

// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());

// Endpoint para obtener categorías
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categoria'; // Consulta para obtener categorías
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener categorías:', err); // Manejar errores de la consulta
      res.status(500).send('Error al obtener categorías'); // Código de estado 500 en caso de error
    } else {
      res.json(results); // Enviar resultados como JSON
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`); // Confirmación de que el servidor está ejecutándose
});
















