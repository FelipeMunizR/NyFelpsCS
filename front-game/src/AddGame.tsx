import React, { useState, useEffect } from 'react';
import './App.css';

interface Categoria {
  id: number;
  nome: string;
}

interface Jogo {
  id: number;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  favorito: boolean;
  categoriaId: number;
}

interface AddGameProps {
  token: string;
  onSave: (novoJogo: Jogo) => void;
}

const AddGame: React.FC<AddGameProps> = ({ token, onSave }) => {
  const [titulo, setTitulo]         = useState('');
  const [descricao, setDescricao]   = useState('');
  const [imagemUrl, setImagemUrl]   = useState('');
  const [categoriaId, setCategoriaId] = useState<number>(0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro]             = useState<string | null>(null);

  // 1) Carrega as categorias ao montar o componente
  useEffect(() => {
    fetch('http://localhost:5000/api/categoria')
      .then(res => res.json())
      .then((cats: Categoria[]) => setCategorias(cats))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const corpo = { 
        titulo, 
        descricao, 
        imagemUrl, 
        favorito: false,        // ou o estado que você quiser
        categoriaId             // envia o ID, não o nome
      };

      const res = await fetch('http://localhost:5000/api/jogo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(corpo),
      });

      if (!res.ok) throw new Error('Falha ao adicionar jogo');

      const novo: Jogo = await res.json();
      onSave(novo);
    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Adicionar Jogo</h2>
        {erro && <p className="status error">{erro}</p>}

        <label htmlFor="titulo">Título</label>
        <input id="titulo" value={titulo}
               onChange={e => setTitulo(e.target.value)} required />

        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" value={descricao}
                  onChange={e => setDescricao(e.target.value)} required />

        <label htmlFor="imagemUrl">URL da Imagem</label>
        <input id="imagemUrl" value={imagemUrl}
               onChange={e => setImagemUrl(e.target.value)} required />

        <label htmlFor="categoria">Categoria</label>
        <select id="categoria" value={categoriaId}
                onChange={e => setCategoriaId(Number(e.target.value))}
                required>
          <option value={0} disabled>— selecione —</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default AddGame;
