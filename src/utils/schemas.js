const joi = require('joi');

const schemaLogin = joi.object({
  email: joi.string().required().email().messages({
    'string.email': 'Formato de e-mail inválido',
    'any.required': 'O campo e-mail é obrigatório',
    'string.empty': 'O campo e-mail não pode ficar vazio',
  }),

  senha: joi.string().required().messages({
    'any.required': 'O campo senha é obrigatório',
    'string.empty': 'O campo senha não pode ficar vazio',
  }),
});

const schemaUser = joi.object({
  nome: joi.string().required().messages({
    'any.required': 'O campo nome é obrigatório',
    'string.empty': 'O campo nome não pode ficar vazio',
  }),

  email: joi.string().required().email().messages({
    'string.email': 'Formato de e-mail inválido',
    'any.required': 'O campo e-mail é obrigatório',
    'string.empty': 'O campo e-mail não pode ficar vazio',
  }),

  senha: joi.string().required().messages({
    'any.required': 'O campo senha é obrigatório',
    'string.empty': 'O campo senha não pode ficar vazio',
  }),
});

const schemaClient = joi.object({
  nome: joi
    .string()
    .required()
    .custom((nome, resposta) => {
      if (nome.trim() === '') {
        return resposta.message('Formato de nome inválido');
      }
      return nome;
    })
    .messages({
      'any.required': 'O campo nome é obrigatório',
      'string.empty': 'O campo nome não pode ficar vazio',
    }),

  email: joi.string().required().email().messages({
    'string.email': 'Formato de e-mail inválido',
    'any.required': 'O campo e-mail é obrigatório',
    'string.empty': 'O campo e-mail não pode ficar vazio',
  }),

  cpf: joi
    .string()
    .required()
    .min(11)
    .max(11)
    .regex(/[0-9]{11}/)
    .custom((cpf, res) => {
      if (cpf.trim() === '') {
        return res.message('Formato do CPF inválido');
      }
      return cpf;
    })
    .messages({
      'any.required': 'O campo CPF é obrigatório',
      'string.empty': 'O campo CPF não pode ficar vazio',
      'string.min': 'O CPF deve conter 11 caracteres',
      'string.max': 'O CPF deve conter 11 caracteres',
      'string.pattern.base': 'informe um cpf válido, somente com números',
    }),

  cep: joi
    .string()
    .min(8)
    .max(8)
    .regex(/[0-9]{8}/)
    .custom((cep, res) => {
      if (cep.trim() === '') {
        return res.message('Formato do CEP inválido');
      }
      return cep;
    })
    .messages({
      'string.empty': 'O campo CEP não pode ficar vazio',
      'string.min': 'O CEP deve conter no mínimo 8 caracteres',
      'string.max': 'O CEP deve conter no máximo 8 caracteres',
      'string.pattern.base': 'informe um cep válido, somente com números',
    }),

  rua: joi
    .string()
    .custom((rua, res) => {
      if (rua.trim() === '') {
        return res.message('Formato da rua inválido');
      }
      return rua;
    })
    .messages({
      'string.empty': 'O campo rua não pode ficar vazio',
    }),

  numero: joi.number().integer().positive().messages({
    'number.integer': 'O campo número precisa ser um número inteiro',
    'number.positive': 'O campo número precisa ser um número positivo',
  }),

  bairro: joi
    .string()
    .custom((bairro, res) => {
      if (bairro.trim() === '') {
        return res.message('Formato da rua inválido');
      }
      return bairro;
    })
    .messages({
      'string.empty': 'O campo bairro não pode ficar vazio',
    }),

  cidade: joi
    .string()
    .custom((cidade, res) => {
      if (cidade.trim() === '') {
        return res.message('Formato da cidade inválido');
      }
      return cidade;
    })
    .messages({
      'string.empty': 'O campo cidade não pode ficar vazio',
    }),

  estado: joi
    .string()
    .min(2)
    .max(2)
    .custom((estado, res) => {
      if (estado.trim() === '') {
        return res.message('Formato do estado inválido');
      }
      return estado;
    })
    .messages({
      'string.empty': 'O campo estado não pode ficar vazio',
      'string.min': 'O estado deve conter no mínimo 2 caracteres',
      'string.max': 'O estado deve conter no máximo 2 caracteres',
    }),
});

const schemaProduct = joi.object({
  descricao: joi
    .string()
    .required()
    .custom((descricao, res) => {
      if (descricao.trim() === '') {
        return res.message('Formato de descrição inválido');
      }
      return descricao;
    })
    .messages({
      'any.required': 'O campo descrição é obrigatório',
      'string.empty': 'O campo descrição não pode ficar vázio',
    }),

  quantidade_estoque: joi.number().integer().positive().required().messages({
    'number.integer': 'O campo quantidade precisa ser um número inteiro',
    'number.positive': 'O campo quantidade precisa ser um número positivo',
    'any.required': 'O campo quantidade é obrigatório',
    'number.base': 'O campo quantidade é obrigatório',
  }),

  valor: joi.number().integer().positive().required().messages({
    'number.integer': 'O campo valor precisa ser um número inteiro',
    'number.positive': 'O campo valor precisa ser um número positivo',
    'any.required': 'O campo valor é obrigatório',
    'number.base': 'O campo valor é obrigatório',
  }),

  categoria_id: joi.number().integer().positive().required().messages({
    'number.integer': 'O campo categoria precisa ser um número inteiro',
    'number.positive': 'O campo categoria precisa ser um número positivo',
    'any.required': 'O campo categoria é obrigatório',
    'number.base': 'O campo categoria é obrigatório',
  }),
});

const schemaNumber = joi.number().positive().integer().messages({
  'number.base': 'Informe um id numérico válido',
  'number.positive': 'Informe um id positivo válido',
  'number.integer': 'O campo id precisa ser um número inteiro',
});

module.exports = {
  schemaLogin,
  schemaUser,
  schemaClient,
  schemaProduct,
  schemaNumber,
};
