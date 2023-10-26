const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../connection');
const { schemaNumber } = require('../utils/schemas');

const validateToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: 'Não autorizado' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_PASS);

    const user = await knex('usuarios').where({ id }).first();

    if (!user) {
      return res.status(401).json({ mensagem: 'Não autorizado' });
    }
    const { senha: cifra, ...usuario } = user;

    req.usuario = usuario;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ mensagem: 'É necessário fazer um login válido' });
  }
};

const validateRequestBody = (joinSchema) => async (req, res, next) => {
  try {
    await joinSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const validateLogin = async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    const user = await knex('usuarios').where({ email }).select('*').first();

    if (!user) {
      return res
        .status(400)
        .json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      return res
        .status(400)
        .json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao validar o login' });
  }
};

const validateExistEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const findUser = await knex('usuarios').where('email', email);

    if (findUser.length > 0) {
      return res.status(400).json({ mensagem: 'Este e-mail já está em uso' });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem:
        'Erro interno do servidor ao verificar validação do email existente',
    });
  }
};

const validateExistProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    await schemaNumber.validateAsync(id);

    const productFind = await knex('produtos').where('id', id).first();

    if (!productFind) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const validateExistClient = async (req, res, next) => {
  const { id } = req.params;

  try {
    await schemaNumber.validateAsync(id);

    const findClient = await knex('clientes').where('id', id).first();

    if (!findClient) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const validateExistEmailCpf = async (req, res, next) => {
  const { id } = req.params;
  const { email, cpf } = req.body;

  try {
    if (id) {
      await schemaNumber.validateAsync(id);
    }

    const clientEmail = await knex('clientes').where('email', email).first();

    if (clientEmail) {
      return res.status(400).json({ mensagem: 'Este e-mail já está em uso' });
    }
    const clientCpf = await knex('clientes').where('cpf', cpf).first();

    if (clientCpf) {
      return res.status(400).json({ mensagem: 'Este CPF já está em uso' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const validateExistCategory = async (req, res, next) => {
  let category = undefined;

  if (req.body.categoria_id) {
    category = req.body.categoria_id;
  }

  if (req.query.categoria_id) {
    category = req.query.categoria_id;
  }

  try {
    if (category) {
      await schemaNumber.validateAsync(category);

      const findCategorie = await knex('categorias')
        .where({ id: category })
        .first();

      if (!findCategorie) {
        return res
          .status(400)
          .json({ mensagem: 'A categoria informada não existe' });
      }
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const validateExistClientOrder = async (req, res, next) => {
  const { cliente_id } = req.body;

  try {
    const findClient = await knex('clientes').where('id', cliente_id).first();

    if (!findClient) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const validateStock = async (req, res, next) => {
  const { pedido_produtos } = req.body;

  try {
    for (const pedido of pedido_produtos) {
      const stock = await knex('produtos')
        .where('id', pedido.produto_id)
        .select('quantidade_estoque')
        .first();

      if (stock.quantidade_estoque < pedido.quantidade_produto) {
        const nameProduct = await knex('produtos')
          .where('id', pedido.produto_id)
          .select('descricao')
          .first();

        return res.status(404).json({
          mensagem: `Estoque insuficiente do produto: ${nameProduct.descricao}`,
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const validateRequestOrder = async (req, res, next) => {
  const { cliente_id, pedido_produtos } = req.body;

  try {
    if (!cliente_id) {
      return res
        .status(400)
        .json({ mensagem: 'O campo cliente é obrigatório' });
    }

    await schemaNumber.validateAsync(cliente_id);

    for (const pedido of pedido_produtos) {
      await schemaNumber.validateAsync(pedido.produto_id);
      await schemaNumber.validateAsync(pedido.quantidade_produto);
      if (!pedido.produto_id) {
        return res
          .status(400)
          .json({ mensagem: 'O campo produto id é obrigatório' });
      }
      if (!pedido.quantidade_produto) {
        return res
          .status(400)
          .json({ mensagem: 'O campo quantidade de produtos é obrigatório' });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const validateExistProductOrder = async (req, res, next) => {
  const { pedido_produtos } = req.body;

  try {
    for (const pedido of pedido_produtos) {
      const productFind = await knex('produtos')
        .where('id', pedido.produto_id)
        .first();

      if (!productFind) {
        return res.status(400).json({ mensagem: 'Produto não encontrado' });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const validateImage = (req, res, next) => {
  const { file } = req;
  if (!file) {
    next();
  } else {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      next();
    } else {
      return res
        .status(400)
        .json({ message: 'Envie uma imagem no formato JPEG ou PNG' });
    }
  }
};

const validateDeleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const productOnOrder = await knex('pedido_produtos')
      .where('produto_id', id)
      .first();
    if (productOnOrder) {
      return res
        .status(400)
        .json({
          mensagem: 'Este produto está em um pedido e não pode ser deletado',
        });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro ao validar exclusão de um produto' });
  }
};

module.exports = {
  validateToken,
  validateRequestBody,
  validateLogin,
  validateExistEmail,
  validateExistProduct,
  validateExistClient,
  validateExistEmailCpf,
  validateExistCategory,
  validateRequestOrder,
  validateExistProductOrder,
  validateImage,
  validateStock,
  validateExistClientOrder,
  validateDeleteProduct,
};
