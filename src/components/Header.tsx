import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const navegarLogin = () => {
    navigate('/login');
  }
  
  return (
    <header className="header">
      <div className="container">
        <h1>HANDYMAN</h1>
        <nav>
          <a href="#">Serviços</a>
          <a href="#">Sobre nós</a>
          <a href="#">Ajuda</a>
        </nav>
        <div className="buttons">
          <button onClick={navegarLogin} className="btn-outline">Entrar</button>
          <button className="btn-fill">Cadastrar-se</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
