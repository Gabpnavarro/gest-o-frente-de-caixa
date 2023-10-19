const knex = require('../connection');
const { formatName } = require('../utils/formatData');
const { getProductsByCategory, getProducts } = require('../utils/getProducts');
const uploadImage = require('../utils/uploadImage');
const deleteImage = require('../utils/deleteImage');
const { formatPathLink } = require('../utils/formatPath');

const registerProduct = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { file } = req;

  try {
    if (file) {
      const urlFile = await uploadImage(file);
      await knex('produtos').insert({
        descricao: formatName(descricao),
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: urlFile,
      });
    } else {
      await knex('produtos').insert({
        descricao: formatName(descricao),
        quantidade_estoque,
        valor,
        categoria_id,
      });
    }
    return res.status(201).json({ mensagem: 'Produto cadastrado com sucesso' });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao cadastrar o produto' });
  }
};

const listProducts = async (req, res) => {
  const { categoria_id } = req.query;
  try {
    if (categoria_id) {
      const produtctsByCategory = await getProductsByCategory(categoria_id);
      return res.status(200).json(produtctsByCategory);
    }
    const products = await getProducts();
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao listar produtos' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { file } = req;

  try {
    if (file) {
      const urlFile = await uploadImage(file);
      await knex('produtos')
        .update({
          descricao: formatName(descricao),
          quantidade_estoque,
          valor,
          categoria_id,
          produto_imagem: urlFile,
        })
        .where('id', id);
    } else {
      await knex('produtos')
        .update({
          descricao: formatName(descricao),
          quantidade_estoque,
          valor,
          categoria_id,
          produto_imagem: null,
        })
        .where('id', id);
    }
    return res.status(200).json({ mensagem: 'Produto atualizado com sucesso' });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidorao atualizar o produto' });
  }
};

const detailProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await knex('produtos').where('id', id).first();
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json('Erro interno do servidor ao detalhar produto');
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const productUrl = await knex('produtos')
      .where('id', id)
      .select('produto_imagem')
      .first();

    if (productUrl && productUrl.produto_imagem) {
      const url = String(productUrl.produto_imagem);
      const newUrl = formatPathLink(url);
      deleteImage(newUrl);
    }

    await knex('produtos').where({ id }).delete();

    return res.status(204).json();
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao deletar produto' });
  }
};

module.exports = {
  listProducts,
  updateProduct,
  registerProduct,
  deleteProduct,
  detailProduct,
};
