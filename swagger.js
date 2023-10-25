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
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
