const knex = require('../connection');

const editUserInDatabase = async (nome, email, senha, id) => {
  return await knex('usuarios')
    .update({ nome, email, senha })
    .where({ id: id });
};

module.exports = editUserInDatabase;
