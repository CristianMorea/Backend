const mysql = require('mysql');

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

module.exports = connection;
