const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt'); // Importa bcrypt para el hashing de contraseñas

const app = express();
const port = 3000;

// Middleware para permitir CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Permitir métodos específicos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Permitir encabezados específicos
  next();
});

// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'blog'
});

// Conecta a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Termina el proceso de Node.js si hay un error de conexión
  }
  console.log('Conexión establecida con la base de datos MySQL');
});

// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());




app.get('/categories', (req, res) => {
  // Consulta SQL para obtener todas las categorías
  const query = 'SELECT * FROM categoria';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener categorías:', err);
      res.status(500).send('Error al obtener categorías');
      return;
    }

    res.json(results);  // Envía las categorías como respuesta JSON
  });
});











































// Define un endpoint para manejar solicitudes de inicio de sesión
app.post('/login', (req, res) => {
  const { email, contraseña } = req.body;

  // Validación de datos de entrada
  if (!email || !contraseña) {
    return res.status(400).json({ message: 'Correo electrónico y contraseña son requeridos' });
  }

  // Busca el usuario en la base de datos
  connection.query('SELECT * FROM UsuariosRegistrados WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error al buscar usuario:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
    
    // Verifica si se encontró un usuario con el correo electrónico proporcionado
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verifica la contraseña utilizando bcrypt
    bcrypt.compare(contraseña, results[0].contraseña, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Usuario autenticado exitosamente
      res.status(200).json({ message: 'Inicio de sesión exitoso' });
    });
  });
});

// Define un endpoint para manejar solicitudes de registro
app.post('/register', (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;

  // Validación de datos de entrada
  if (!nombre || !apellido || !email || !contraseña) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Hash de la contraseña utilizando bcrypt
  bcrypt.hash(contraseña, 10, (err, hash) => {
    if (err) {
      console.error('Error al hashear la contraseña:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Inserta el usuario en la base de datos con la contraseña hasheada
    connection.query('INSERT INTO UsuariosRegistrados (nombre, apellido, email, contraseña) VALUES (?, ?, ?, ?)', [nombre, apellido, email, hash], (error, results) => {
      if (error) {
        console.error('Error al registrar el usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      console.log('Usuario registrado con éxito');
      res.status(200).json({ message: 'Usuario registrado con éxito' });
    });
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
