create table usuarios (
  id serial primary key,
  nome text not null,
  email varchar(200) unique,
  senha varchar(250) not null);


create table categorias (
  id serial primary key,
  descricao text);


insert into categorias (descricao) values
  ('Informática'),
  ('Celulares'),
  ('Beleza e Perfumaria'),
  ('Mercado'),
  ('Livros e Papelaria'),
  ('Brinquedos'),
  ('Moda'),
  ('Bebê'),
  ('Games');

  create table produtos (
  id serial primary key,
  descricao text not null,
  quantidade_estoque integer check (quantidade_estoque >= 0) not null,
  valor integer not null,
  categoria_id integer not null references categorias(id),
  produto_imagem text);

  create table clientes (
  id serial primary key,
  nome text not null,
  email varchar(200) unique not null,
  cpf varchar(11) unique not null,
  cep varchar(8),
  rua text,
  numero integer,
  bairro text,
  cidade text,
  estado varchar(2));

create table pedidos (
  id serial primary key,
  cliente_id integer not null references clientes(id),
  observacao text,
  valor_total integer not null);

create table pedido_produtos (
  id serial primary key,
  pedido_id integer not null references pedidos(id),
  produto_id integer not null references produtos(id),
  quantidade_produto integer not null,
 	valor_produto integer not null);








