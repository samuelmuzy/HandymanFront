import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const navegarLogin = () => {
    navigate('/login');
  }
  
  const navegarCadastro = () => {
    navigate('/cadastro');
  }
  
  const navegarServicos = () => {
    navigate('/servicos');
  }

  const navegarSobreNos = () => {
    navigate('/sobre-nos');
  }

  const navegarAjuda = () => {
    navigate('/ajuda');
  }

  const navegarHome = () => {
    navigate('/');
  }


  
  return (
    <header className="header">
      <div className="container">
        <h1 className='cursor-pointer' onClick={navegarHome}>HANDYMAN</h1>
        <nav>
          <a className='cursor-pointer' onClick={navegarServicos}>Serviços</a>
          <a className='cursor-pointer' onClick={navegarSobreNos}>Sobre nós</a>
          <a className='cursor-pointer' onClick={navegarAjuda}>Ajuda</a>
        </nav>
        <div className="buttons">
          <button onClick={navegarLogin} className="btn-outline">Entrar</button>
          <button onClick={navegarCadastro} className="btn-fill">Cadastrar-se</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
