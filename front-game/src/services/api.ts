const BASE_URL = 'http://localhost:5000';

export const fetchJogos = async () => {
  const res = await fetch(`${BASE_URL}/api/jogo`);
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  return res.json();
};  // <-- Fecha fetchJogos aqui

export const registerUser = async (nome: string, email: string, senha: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ${res.status}: ${text}`);
  }
  return res.json();
};

export const loginUser = async (email: string, senha: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ${res.status}: ${text}`);
  }
  return res.json(); // { token: string }
};
