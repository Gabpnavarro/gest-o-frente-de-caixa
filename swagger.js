const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = [
  './src/routes/categoriesRoutes.js',
  './src/routes/clientRoutes.js',
];

const doc = {
  info: {
    title: 'Documentação API Gestão de Frente de Caixa',
    description:
      'Projeto desenvolvido ao longo do Móduio final do Curso de Desenvolvimento de Software com Foco em Back-end da Cubos Academy.',
    version: '1.0.0',
  },
  definitions: {
    InternalServerError: {
      message: 'Erro interno do servidor',
    },
    listCategories: [
      {
        id: 1,
        descricao: 'Informática',
      },
      {
        id: 2,
        descricao: 'Celulares',
      },
    ],
    addClient: {
      nome: 'Joao Silva',
      email: 'joaoSilva@gmail.com',
      cpf: '22233322222',
      cep: '40000000',
      numero: 12,
    },
    getOneClient: {
      id: 1,
      nome: 'Maria Das Dores',
      email: 'dorinhamilgrau@gmail.com',
      cpf: '12345612345',
      cep: '41223333',
      rua: 'Rua joão das neves',
      numero: 18,
      bairro: 'Ondina',
      cidade: 'Salvador',
      estado: 'Bahia',
    },
    getClients: [{ $ref: '#/definitions/getOneClient' }],
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
