const { buscarEndereco } = require('utils-playground');

const address = async (req, res) => {
  try {
    const { cep } = req.body;
    if (cep) {
      const address = await buscarEndereco(cep);

      return address;
    }
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao buscar o CEP' });
  }
};

module.exports = address;
