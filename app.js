const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getCategories, getArticles, getArticlesWithComments } = require('./queries');
const { processArticlesWithComments } = require('./services');

const app = express();
const port = 3000; // Asegúrate de usar el puerto correcto

// Middleware para CORS
app.use(cors({
  origin: ['http://localhost:8080','http://localhost:8081'], // Restringir orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Endpoint para obtener categorías
app.get('/categories', (req, res) => {
  getCategories((err, results) => {
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
  getArticles((err, results) => {
    if (err) {
      console.error('Error al obtener artículos:', err); // Manejar errores de la consulta
      res.status(500).send('Error al obtener artículos'); // Código de estado 500 en caso de error
    } else {
      res.json(results); // Enviar resultados como JSON
    }
  });
});

// Endpoint para obtener artículos con comentarios
app.get('/articles/comments', (req, res) => {
  getArticlesWithComments((err, results) => {
    if (err) {
      console.error('Error al obtener artículos y comentarios:', err);
      res.status(500).send('Error al obtener artículos y comentarios');
    } else {
      const articles = processArticlesWithComments(results);
      console.log(articles);
      res.json(articles);
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`); // Confirmación de que el servidor está ejecutándose
});
