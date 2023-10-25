const knex = require('../connection');
const address = require('../utils/address');
const { formatName, formatEmail } = require('../utils/formatData');
const { getClients } = require('../utils/getClients');

const registerClient = async (req, res) => {
  // #swagger.tags = ['Clients']
  // #swagger.description = 'Endpoint responsável por cadastrar um cliente.'
  const { nome, email, cpf, cep, numero } = req.body;

  try {
    const itemsIncluded = {};

    itemsIncluded.nome = formatName(nome);

    itemsIncluded.email = formatEmail(email);

    itemsIncluded.cpf = cpf;

    if (cep) {
      const infoAddress = await address(req, res);

      if (address.erro) {
        return res.status(400).json({ mensagem: 'O CEP não existe' });
      }

      itemsIncluded.cep = cep;
      itemsIncluded.rua = infoAddress.logradouro;
      itemsIncluded.bairro = infoAddress.bairro;
      itemsIncluded.cidade = infoAddress.localidade;
      itemsIncluded.estado = infoAddress.uf;
    }
    if (numero) {
      itemsIncluded.numero = numero;
    }

    await knex('clientes').insert(itemsIncluded);

    return res
      .status(201)
      .json({ mensagem: 'Cliente cadastrado com sucesso!' });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao cadastrar cliente' });
  }
};

const listClients = async (req, res) => {
  // #swagger.tags = ['Clients']
  // #swagger.description = 'Endpoint responsável por listar clientes.'
  try {
    const clients = await getClients();
    return res.status(200).json(clients);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao listar clientes' });
  }
};

const updateClient = async (req, res) => {
  // #swagger.tags = ['Clients']
  // #swagger.description = 'Endpoint responsável por atualizar um cliente passado por parâmetro.'
  const { id } = req.params;
  const { nome, email, cpf, cep, numero } = req.body;

  try {
    const itemsIncluded = {};

    if (nome) {
      itemsIncluded.nome = formatName(nome);
    }
    if (email) {
      itemsIncluded.email = formatEmail(email);
    }
    if (cpf) {
      itemsIncluded.cpf = cpf;
    }
    if (cep) {
      const infoAddress = await address(req, res);

      if (address.erro) {
        return res.status(400).json({ mensagem: 'O CEP não existe' });
      }

      itemsIncluded.cep = cep;
      itemsIncluded.rua = infoAddress.logradouro;
      itemsIncluded.bairro = infoAddress.bairro;
      itemsIncluded.cidade = infoAddress.localidade;
      itemsIncluded.estado = infoAddress.uf;
    }
    if (numero) {
      itemsIncluded.numero = numero;
    }

    await knex('clientes').update(itemsIncluded).where('id', id);

    return res
      .status(200)
      .json({ mensagem: 'Atualização realizada com sucesso!' });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao atualizar cliente' });
  }
};

const detailClient = async (req, res) => {
  // #swagger.tags = ['Clients']
  // #swagger.description = 'Endpoint responsável por detalhar um cliente passado por parâmetro.'
  // #swagger.parameters['id'] = { description: 'ID do cliente.' }
  const { id } = req.params;

  try {
    const client = await knex('clientes').where('id', id).first();
    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json('Erro interno do servidor');
  }
};

module.exports = { listClients, updateClient, registerClient, detailClient };
