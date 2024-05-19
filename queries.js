// queries.js
const connection = require('./db');

const getCategories = (callback) => {
  const query = 'SELECT * FROM categoria';
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getArticles = (callback) => {
  const query = 'SELECT * FROM articulo';
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getArticlesWithComments = (callback) => {
  const query = `
    SELECT a.articulo_id, a.titulo, a.contenido, a.fecha_creacion,
           c.comentario_id, c.user_id, c.comentario, c.fecha_creacion AS comentario_fecha_creacion
    FROM articulo a
    LEFT JOIN comentario c ON a.articulo_id = c.articulo_id
    ORDER BY a.articulo_id, c.fecha_creacion
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const insertUsuarioRegistro = (usuario, callback) => {
  const { nombre, correo, contraseña } = usuario;
  const query = `
    INSERT INTO usuario(nombre, correo, contraseña, rol_id, fecha_creacion)
    VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
  `;
  connection.query(query, [nombre, correo, contraseña], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results.insertId); // Devuelve el ID del nuevo registro insertado
  });
};
module.exports = { getCategories, getArticles, getArticlesWithComments, insertUsuarioRegistro };
