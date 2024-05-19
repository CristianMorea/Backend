// services.js
const { getCategories, getArticles, getArticlesWithComments, insertUsuarioRegistro } = require('./queries');

const processArticlesWithComments = (results) => {
  const articles = {};

  results.forEach(row => {
    if (!articles[row.articulo_id]) {
      articles[row.articulo_id] = {
        articulo_id: row.articulo_id,
        titulo: row.titulo,
        contenido: row.contenido,
        fecha_publicacion: row.fecha_creacion,
        comentarios: []
      };
    }

    if (row.comentario_id) {
      articles[row.articulo_id].comentarios.push({
        comentario_id: row.comentario_id,
        user_id: row.user_id,
        comentario: row.comentario,
        fecha_publicacion: row.comentario_fecha_creacion
      });
    }
  });

  return Object.values(articles);
};

module.exports = { processArticlesWithComments, insertUsuarioRegistro };
