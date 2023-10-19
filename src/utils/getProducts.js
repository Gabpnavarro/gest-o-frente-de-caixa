const knex = require('../connection');

const getProductsByCategory = async (category) => {
  const products = await knex('produtos').where({ categoria_id: category });
  return products;
};

const getProducts = async () => {
  const products = await knex('produtos');
  return products;
};

module.exports = { getProducts, getProductsByCategory };
