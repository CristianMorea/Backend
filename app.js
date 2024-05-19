const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { insertUsuarioRegistro } = require('./queries'); // Asegúrate de importar la función correcta para insertar usuarios
const connection = require('./db');

const app = express();
const port = 3000;

// Middleware para CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(bodyParser.json());

// Endpoint raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de artículos y comentarios');
});

// Endpoint para registrar un nuevo usuario
app.post('/register', (req, res) => {
  const { nombre, email, contraseña } = req.body;

  // Validación de datos de entrada
  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Inserta el usuario en la base de datos
  const usuario = { nombre, correo: email, contraseña };
  insertUsuarioRegistro(usuario, (err, userId) => {
    if (err) {
      console.error('Error al registrar el usuario:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
    console.log('Usuario registrado con éxito');
    res.status(201).json({ message: 'Usuario registrado con éxito', userId });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
