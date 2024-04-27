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
