import React from 'react';
import './App.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>Sobre Nós</h1>
        <p>
          A <strong>NyFelps</strong> é uma startup apaixonada por jogos e tecnologia. Criamos soluções que permitem aos usuários montar catálogos personalizados com seus jogos favoritos, de forma prática e moderna.
        </p>
        <p>
          Nossa missão é proporcionar uma experiência única de curadoria digital para gamers de todos os estilos, conectando entretenimento com organização e inovação.
        </p>
        <p>
          Estamos em constante evolução, acompanhando as tendências do mercado e ouvindo a comunidade para tornar o NyFelps a principal plataforma de organização de bibliotecas de jogos do Brasil.
        </p>
        <p>
          Entre em contato conosco para parcerias, sugestões ou só pra bater um papo gamer! 🎮
        </p>
      </div>
    </div>
  );
};

export default About;
