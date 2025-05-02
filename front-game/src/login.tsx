// src/login.tsx
import React, { useState } from 'react';
import './App.css';
import { loginUser } from './services/api';

interface LoginProps {
  onLogin: (user: { id: number; nome: string }, token: string) => void;
  onCadastro: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCadastro }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aqui chamamos a função centralizada em services/api.ts
      const { token, user } = await loginUser(email, senha);

      // Guardamos o token no localStorage
      localStorage.setItem('token', token);

      // Disparamos o callback passando o usuário e o token
      onLogin(user, token);

    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {erro && <p className="status error">{erro}</p>}

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

        <button type="submit">Entrar</button>
        <p className="register-link">
          Não tem uma conta?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onCadastro}
          >
            Cadastre-se
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
