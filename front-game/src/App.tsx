import './App.css';
import Login from './login';
import Cadastro from './Cadastro';
import About from './about';
import AddGame from './AddGame'; // crie este componente para o formulário de criação
import { useState, useEffect } from 'react';
import { fetchJogos } from './services/api';

interface Jogo {
  id: number;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  categoria?: { nome: string };
}

interface User {
  id: number;
  nome: string;
}

function App() {
  // 1) páginas disponíveis
  const [pagina, setPagina] = useState<
    'home' | 'login' | 'about' | 'cadastro' | 'addGame'
  >('home');

  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  // 2) auth
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  );

  // 2.1) manter token no localStorage
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // 3) carregar jogos sempre que voltar pra home
  useEffect(() => {
    if (pagina !== 'home') return;
    const carregarJogos = async () => {
      try {
        const dados = await fetchJogos();
        setJogos(dados);
        setErro(null);
      } catch (e: any) {
        setErro(e.message);
      }
    };
    carregarJogos();
  }, [pagina]);

  // logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setPagina('home');
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <a href="#" onClick={() => setPagina('home')}>
                Home
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setPagina('about')}>
                Sobre Nós
              </a>
            </li>
            {user ? (
              <li>
                <button onClick={logout}>Logout ({user.nome})</button>
              </li>
            ) : (
              <li>
                <a href="#" onClick={() => setPagina('login')}>
                  Entrar / Cadastrar
                </a>
              </li>
            )}
          </ul>
        </nav>
      </header>

      {/* HOME */}
      {pagina === 'home' && (
        <>
          <div className="hero">
            <h1>Catálogo de Jogos</h1>
            <button
              className="button1"
              onClick={() =>
                token ? setPagina('addGame') : setPagina('cadastro')
              }
            >
              Faça seu Catálogo!
            </button>
          </div>

          <div className="buttons-add-remove">
            <button
              className="add"
              onClick={() =>
                token ? setPagina('addGame') : setPagina('cadastro')
              }
            >
              Adicionar jogo
            </button>
          </div>

          {erro && <p className="status error">{erro}</p>}

          <div className="cards">
            {jogos.length === 0 && !erro && <p>Nenhum jogo encontrado.</p>}
            {jogos.map((jogo) => (
              <div className="card" key={jogo.id}>
                <img
                  src={jogo.imagemUrl || 'https://via.placeholder.com/150'}
                  alt={`Capa do ${jogo.titulo}`}
                />
                <h3>{jogo.titulo}</h3>
                <p>{jogo.descricao}</p>
                {jogo.categoria?.nome && (
                  <p>Categoria: {jogo.categoria.nome}</p>
                )}
                <button
                  onClick={async () => {
                    if (!token) return setPagina('cadastro');
                    await fetch(
                      `http://localhost:5000/api/jogo/${jogo.id}/favoritar`,
                      {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );
                  }}
                >
                  Favoritar
                </button>
                <button
                  className="remove"
                  onClick={async () => {
                    if (!token) return setPagina('cadastro');
                    await fetch(
                      `http://localhost:5000/api/jogo/${jogo.id}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );
                    setJogos((prev) =>
                      prev.filter((j) => j.id !== jogo.id),
                    );
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* LOGIN */}
      {pagina === 'login' && (
        <Login
          onLogin={(usuario, token) => {
            setUser(usuario);      // guarda o usuário no state
            setToken(token);       // guarda o token
            setPagina('home');     // volta pra home após login
          }}
          onCadastro={() => setPagina('cadastro')} // abre a tela de cadastro
        />
      )}

      {/* CADASTRO */}
      {pagina === 'cadastro' && (
        <Cadastro
          onCadastrado={() => setPagina('login')} // volta pro login após cadastro
        />
      )}


      {/* ADD GAME */}
      {pagina === 'addGame' && token && (
        <AddGame
          token={token}
          onSave={(novoJogo) => {
            setJogos((prev) => [novoJogo, ...prev]);
            setPagina('home');
          }}
          
        />
      )}

      {/* ABOUT */}
      {pagina === 'about' && <About />}
    </>
  );
}

export default App;
