// Controlador de pedido
const knex = require('../connection');
const htmlCompiled = require('../utils/htmlCompiled');
const transporter = require('../utils/email');

const listOrders = async (req, res) => {
  const { cliente_id } = req.query;

  try {
    if (cliente_id) {
      const findClient = await knex('clientes').where('id', cliente_id);

      if (findClient) {
        const clientOrders = await knex('pedidos').where(
          'cliente_id',
          cliente_id
        );

        const allOrdersArray = [];

        for (let pedido of clientOrders) {
          const pedido_produtos = await knex('pedido_produtos').where(
            'pedido_id',
            pedido.id
          );

          allOrdersArray.push({ pedido, pedido_produtos });
        }

        return res.status(200).json(allOrdersArray);
      } else {
        return res.status(404).json({ mensagem: 'Cliente não encontrado' });
      }
    }
    const allOrders = await knex('pedidos');

    const allOrdersArray = [];

    for (let pedido of allOrders) {
      const pedido_produtos = await knex('pedido_produtos').where(
        'pedido_id',
        pedido.id
      );

      allOrdersArray.push({ pedido, pedido_produtos });
    }

    return res.status(200).json(allOrdersArray);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro ao listar todos os pedidos' });
  }
};

const registerOrder = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  try {
    let totalValue = 0;

    for (const pedido of pedido_produtos) {
      const unitValue = await knex('produtos')
        .where('id', pedido.produto_id)
        .select('valor')
        .first();
      const value = pedido.quantidade_produto * unitValue.valor;
      totalValue += value;
    }

    const newOrder = {};

    newOrder.cliente_id = cliente_id;
    newOrder.observacao = observacao;
    newOrder.valor_total = totalValue;

    await knex('pedidos').insert(newOrder);

    const orderProducts = {};
    for (const pedido of pedido_produtos) {
      const unitValue = await knex('produtos')
        .where('id', pedido.produto_id)
        .select('valor')
        .first();

      const pedido_id = await knex('pedidos')
        .orderBy('id', 'desc')
        .select('id')
        .first();

      const stock = await knex('produtos')
        .where('id', pedido.produto_id)
        .select('quantidade_estoque')
        .first();

      let stockActual = stock.quantidade_estoque - pedido.quantidade_produto;

      await knex('produtos')
        .update({ quantidade_estoque: stockActual })
        .where('id', pedido.produto_id);

      orderProducts.pedido_id = pedido_id.id;
      orderProducts.produto_id = pedido.produto_id;
      orderProducts.quantidade_produto = pedido.quantidade_produto;
      orderProducts.valor_produto = unitValue.valor;
      await knex('pedido_produtos').insert(orderProducts);
    }

    const customer = await knex('clientes')
      .select('nome', 'email')
      .where({ id: cliente_id })
      .first();

    const html = await htmlCompiled('./src/templates/login.html', {
      nomeusuario: customer.nome,
    });

    await transporter.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
      to: `${customer.nome} <${customer.email}>`,
      subject: 'Pedido Cadastrado com Sucesso',
      html,
    });

    return res.status(201).json({ mensagem: 'Pedido cadastrado com sucesso' });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao cadastrar o pedido' });
  }
};

module.exports = {
  registerOrder,
  listOrders,
};
