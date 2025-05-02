// src/cadastro.tsx
import React, { useState } from 'react';
import './App.css';
import { registerUser } from './services/api';

interface CadastroProps {
  onCadastrado: () => void;
}

const Cadastro: React.FC<CadastroProps> = ({ onCadastrado }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await registerUser(nome, email, senha);   // << envia { nome, email, senha }
        onCadastrado();                           // navega pra tela de login
    } catch (err: any) {
      setErro(err.message);
    }
  };
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleCadastro}>
        <h2>Cadastro</h2>
        {erro && <p className="status error">{erro}</p>}

        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
