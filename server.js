const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000; // Asegúrate de usar el puerto correcto

// Middleware para CORS
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
    console.log('Conexión establecida con la base de datos MySQL'); // Confirmación de conexión
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
