const knex = require('../connection');

const getAllCategories = async (req, res) => {
  try {
    const selectAllCategories = await knex('categorias');

    return res.status(200).json(selectAllCategories);
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro interno do servidor ao listar todas as categorias',
    });
  }
};

module.exports = { getAllCategories };
