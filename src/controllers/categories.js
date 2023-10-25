const knex = require('../connection');

const getAllCategories = async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Endpoint para listar as categorias cadastradas.'
  /* #swagger.responses[200] = {
      schema: { $ref: "#/definitions/InternalServerError" },
      description: 'Erro Interno do Servidor.'
} */
  /* #swagger.responses[500] = {
      schema: { $ref: "#/definitions/listCategories" },
      description: 'Sucesso.'
} */
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
