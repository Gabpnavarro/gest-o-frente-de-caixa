const knex = require('../connection');

const getClients = async () => {
  const clients = await knex('clientes');
  return clients;
};

module.exports = { getClients };
