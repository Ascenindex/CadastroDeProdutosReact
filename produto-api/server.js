const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dados em memória
let produtos = [];

// 1. Criar um produto
app.post('/produtos', (req, res) => {
  const { nome, descricao, preco } = req.body;
  
  if (!nome || !preco) {
    return res.status(400).send({ message: "Nome e preço são obrigatórios!" });
  }

  const novoProduto = {
    id: produtos.length + 1,  // Gerando um ID simples
    nome,
    descricao,
    preco: parseFloat(preco),
  };

  produtos.push(novoProduto);
  res.status(201).send(novoProduto);
});

// 2. Buscar todos os produtos
app.get('/produtos', (req, res) => {
  res.status(200).send(produtos);
});

// 3. Atualizar um produto
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco } = req.body;

  const produtoIndex = produtos.findIndex(p => p.id === parseInt(id));
  
  if (produtoIndex === -1) {
    return res.status(404).send({ message: 'Produto não encontrado' });
  }

  produtos[produtoIndex] = { id: parseInt(id), nome, descricao, preco: parseFloat(preco) };
  res.status(200).send(produtos[produtoIndex]);
});

// 4. Deletar um produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const produtoIndex = produtos.findIndex(p => p.id === parseInt(id));

  if (produtoIndex === -1) {
    return res.status(404).send({ message: 'Produto não encontrado' });
  }

  produtos.splice(produtoIndex, 1);
  res.status(200).send({ message: 'Produto deletado' });
});

// Iniciar o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
