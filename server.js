const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000; // Asegúrate de usar el puerto correcto

// Middleware para CORS
app.use(cors({
  origin: ['http://localhost:8080','http://localhost:8081'], // Restringir orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

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
    console.log('Conexión establecida con la base de datos MySQL'); // Confirmación de conexión
  }
});

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



// Endpoint para obtener artículos
app.get('/articles', (req, res) => {
  const query = 'SELECT * FROM articulo'; // Consulta para obtener todos los artículos
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener artículos:', err); // Manejar errores de la consulta
      res.status(500).send('Error al obtener artículos'); // Código de estado 500 en caso de error
    } else {
      res.json(results); // Enviar resultados como JSON
    }
  });
});


// Iniciar el servidor
app.listen(port, () => {

  console.log(`Servidor corriendo en el puerto ${port}`); // Confirmación de que el servidor está ejecutándose
});

