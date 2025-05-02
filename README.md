# NyFelpsCS
Site criado para entrega do trabalho de Tópicos Especiais em Sistemas. 

Documentação da Aplicação NyFelps
Este documento descreve como instalar, configurar e usar a aplicação NyFelps, composta por uma API em .NET 7 e um front-end em React.

A aplicação foi desenvolvida por Felipe Muniz da Rosa, Nycolas Polato Roberto e Bernardo Aurelio

Índice

1 - Pré-requisitos


2 - Clonar o repositório


3 - Configuração da API (.NET)
3.1. Instalação de dependências
3.2. Configuração do banco de dados
3.3. Rodando migrations
3.4. Executando a API


4 - Configuração do Front-end (React)
4.1. Instalação de dependências
4.2. Variáveis de ambiente (opcional)
4.3. Executando o front-end


5 - Uso da aplicação
5.1. Rotas da API
5.2. Fluxo de tela: cadastro, login e gestão de jogos


Pré-requisitos

Git (para clonar o repositório)
.NET 7 SDK (para executar a API)
Node.js (versão 16 ou superior) e npm ou yarn (para executar o front-end)
SQLite (arquivo de banco nyfelps.db gerenciado pelo EF Core)

Clonar o repositório
No terminal, execute:
git clone https://github.com/FelipeMunizR/NyFelpsCS.git
cd front-game

O repositório possui duas pastas principais:
api: código da API em .NET 7 (Projeto NyFelps.API)


front: código do front-end em React (criado com Vite)


3 - Configuração da API (.NET)

3.1. Instalação de dependências
Abra o terminal dentro da pasta api/NyFelps.API:
cd api/NyFelps.API

Verifique as dependências do projeto:
dotnet restore

3.2. Configuração do banco de dados
A API usa Entity Framework Core com SQLite. Por padrão, o arquivo de banco é nyfelps.db na raiz do projeto.
Se é a primeira vez executando, crie as migrations:
dotnet tool install --global dotnet-ef     (se ainda não instalado)
dotnet add package Microsoft.EntityFrameworkCore.Design

gerar a migration inicial (caso não exista)
dotnet ef migrations add InitialCreate

3.3. Rodando migrations
Para aplicar as migrations e criar o banco e tabelas:
dotnet ef database update

Alternativa: para ambientes de desenvolvimento, o Program.cs já pode chamar db.Database.Migrate() automaticamente.
3.4. Executando a API
dotnet run

Por padrão, a API ficará disponível em:
http://localhost:5000
ou conforme configurado em launchSettings.json.

4 - Configuração do Front-end (React)

4.1. Instalação de dependências
Abra outro terminal na pasta raíz do front-end:
cd front
npm install
# ou yarn install

4.2. Variáveis de ambiente (opcional)
Pode configurar o endereço da API criando um arquivo .env na raiz do front:
VITE_API_URL=http://localhost:5000
O código do front lê import.meta.env.VITE_API_URL para definir o BASE_URL.

4.3. Executando o front-end
npm run dev
# ou yarn dev

O front-end será servido em:
http://localhost:5173

5 - Uso da aplicação

5.1. Rotas da API
Auth
POST /api/auth/register → cadastra novo usuário
POST /api/auth/login → gera JWT


Categoria
GET /api/categoria → lista todas categorias
POST /api/categoria → cria nova categoria


Jogo
GET /api/jogo → lista todos jogos
POST /api/jogo → cria novo jogo (Bearer token requerido)


5.2. Fluxo de tela
Cadastro: usuário preenche nome, email e senha. Após sucesso (201), redireciona para login.

Login: usuário entra com email e senha. Após validar, armazena token no localStorage.

Listagem de jogos: traz jogos via GET /api/jogo, exibindo título, descrição e imagem.

Adicionar jogo: abre formulário, busca categorias, envia dados com token.

Favoritar e remover jogos (dependendo da implementação no front).


Dicas e solução de problemas
CORS: verifique se a política AllowFrontend em Program.cs permite http://localhost:5173.


Failed to fetch: confirme se a API está rodando em http://localhost:5000 e que o BASE_URL do front aponta pra lá.


Erros de FK: carregue as categorias antes de criar jogos; use <select> para escolher categoriaId válido.


Migrations: se alterar modelos, gere nova migration e aplique dotnet ef database update.





