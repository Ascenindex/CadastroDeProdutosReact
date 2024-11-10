import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';  // Importando o Bootstrap
import './App.css'; // Seu CSS customizado se necessário

function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [produtoEditando, setProdutoEditando] = useState(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/produtos');
      setProdutos(res.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const criarProduto = async () => {
    try {
      const precoNumero = parseFloat(preco);
      if (isNaN(precoNumero)) {
        setErro('Preço inválido!');
        return;
      }

      const novoProduto = { nome, descricao, preco: precoNumero };
      await axios.post('http://localhost:5000/produtos', novoProduto);
      fetchProdutos();
      setNome('');
      setDescricao('');
      setPreco('');
      setErro('');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      setErro('Erro ao cadastrar o produto.');
    }
  };

  const buscarProduto = (e) => {
    setBusca(e.target.value);
  };

  const editarProduto = (produto) => {
    setProdutoEditando(produto);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
  };

  const atualizarProduto = async () => {
    if (!produtoEditando) return;
    try {
      const precoNumero = parseFloat(preco);
      if (isNaN(precoNumero)) {
        setErro('Preço inválido!');
        return;
      }

      const produtoAtualizado = { nome, descricao, preco: precoNumero };
      await axios.put(`http://localhost:5000/produtos/${produtoEditando.id}`, produtoAtualizado);
      fetchProdutos();
      setProdutoEditando(null);
      setNome('');
      setDescricao('');
      setPreco('');
      setErro('');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setErro('Erro ao atualizar o produto.');
    }
  };

  const deletarProduto = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/produtos/${id}`);
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      setErro('Erro ao deletar o produto.');
    }
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="App container-fluid mt-5">
      <h1 className="text-center mb-4">Cadastro de Produtos</h1>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="row mb-4">
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <button
          className="btn btn-primary btn-lg btn-block"
          onClick={produtoEditando ? atualizarProduto : criarProduto}
        >
          {produtoEditando ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </button>
      </div>

      <div className="form-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar Produto"
          value={busca}
          onChange={buscarProduto}
        />
      </div>

      <h2 className="text-center">Lista de Produtos</h2>
      <ul className="list-group">
        {produtosFiltrados.map((produto) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={produto.id}>
            {produto.nome} - R$ {produto.preco.toFixed(2)}
            <div>
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => editarProduto(produto)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deletarProduto(produto.id)}
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
