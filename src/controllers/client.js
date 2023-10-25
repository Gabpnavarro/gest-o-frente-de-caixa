const knex = require('../connection');
const address = require('../utils/address');
const { formatName, formatEmail } = require('../utils/formatData');
const { getClients } = require('../utils/getClients');

const registerClient = async (req, res) => {
  // #swagger.tags = ['Clients']
  // #swagger.description = 'Endpoint responsável por cadastrar um cliente.'
  /*  #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Dados para cadastrar um cliente',
      schema:{ $ref: "#/definitions/addClient" }
    }
   */
  /* #swagger.responses[500] = {
      schema: { $ref: "#/definitions/InternalServerError" },
      description: 'Erro Interno do Servidor.'
} */
  /* #swagger.responses[400] = {
      schema: { message: "O CEP não existe" },
      description: 'CEP Inválido.'
} */
  /* #swagger.responses[201] = {
      schema: { message: "Cliente cadastrado com sucesso!" },
      description: 'Sucesso.'
} */
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
  /* #swagger.responses[200] = {
      schema: { $ref: "#/definitions/getClients" },
      description: 'Sucesso.'
} */
  /* #swagger.responses[500] = {
      schema: { $ref: "#/definitions/InternalServerError" },
      description: 'Erro Interno do Servidor.'
} */
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
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID do cliente' } */
  /*  #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Dados para atualizar um cliente',
      schema:{ $ref: "#/definitions/addClient" }
    }
   */
  /* #swagger.responses[500] = {
      schema: { $ref: "#/definitions/InternalServerError" },
      description: 'Erro Interno do Servidor.'
} */
  /* #swagger.responses[400] = {
      schema: { message: "O CEP não existe" },
      description: 'CEP Inválido.'
} */
  /* #swagger.responses[200] = {
      schema: { message: "Atualização realizada com sucesso!" },
      description: 'Sucesso.'
} */
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
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID do cliente' } */
  /* #swagger.responses[200] = {
      schema: { $ref: "#/definitions/getOneClient" },
      description: 'Sucesso.'
} */
  /* #swagger.responses[500] = {
      schema: { $ref: "#/definitions/InternalServerError" },
      description: 'Erro Interno do Servidor.'
} */
  const { id } = req.params;

  try {
    const client = await knex('clientes').where('id', id).first();
    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json('Erro interno do servidor');
  }
};

module.exports = { listClients, updateClient, registerClient, detailClient };
