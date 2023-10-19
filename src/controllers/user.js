const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../connection');
const editUserInDatabase = require('../utils/editUserInDatabase');
const { formatName, formatEmail } = require('../utils/formatData');
require('dotenv').config();

const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(senha, 10);

    await knex('usuarios').insert({
      nome: formatName(nome),
      email: formatEmail(email),
      senha: encryptedPassword,
    });

    return res
      .status(201)
      .json({ message: 'Novo usuário criado com sucesso!' });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao registrar um usuário' });
  }
};

const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await knex('usuarios').where({ email }).select('*');

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS, {
      expiresIn: '8h',
    });

    const { senha: cifra, ...usuario } = user;

    return res.status(200).json({ usuario, token });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao fazer o login' });
  }
};

const editUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { usuario } = req;

  try {
    if (usuario.email !== email) {
      const isEmailAlreadyExists = await knex('usuarios').where({ email });

      if (isEmailAlreadyExists.length > 0) {
        return res.status(400).json({ mensagem: 'Este e-mail já está em uso' });
      }
    }

    const encryptedPassword = await bcrypt.hash(senha, 10);

    await editUserInDatabase(
      formatName(nome),
      formatEmail(email),
      encryptedPassword,
      usuario.id
    );

    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: 'Erro interno do servidor ao editar o usuário' });
  }
};

const detailUser = (req, res) => {
  return res.status(200).json(req.usuario);
};

module.exports = { registerUser, loginUser, editUser, detailUser };
