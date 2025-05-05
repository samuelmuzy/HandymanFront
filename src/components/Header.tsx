import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../services/isUserLoggedIn';
import { useGetToken } from '../hooks/useGetToken';


const Header = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [id,role] = useGetToken();

  useEffect(() => {
    setIsLoggedIn(isUserLoggedIn());
  }, []);
  
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
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
            <span onClick={navegarHome} className="cursor-pointer text-[#A75C00] font-bold text-lg">HANDYMAN</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a onClick={navegarServicos} className="cursor-pointer text-gray-700 hover:text-[#A75C00]">Serviços</a>
              <a onClick={navegarSobreNos} className="cursor-pointer text-gray-700 hover:text-[#A75C00]">Sobre nós</a>
              <a onClick={navegarAjuda} className="cursor-pointer text-gray-700 hover:text-[#A75C00]">Ajuda</a>
            </nav>
            
            {isLoggedIn ? (
                <>
                  <p>{role}</p>
                </>
            ): (
              <div className="flex items-center space-x-4">
                <button onClick={navegarLogin} className="px-4 py-2 border border-[#A75C00] text-[#A75C00] rounded-md hover:bg-[#A75C00] hover:text-white">
                  Entrar
                </button>
                <button onClick={navegarCadastro} className="px-4 py-2 bg-[#A75C00] text-white rounded-md hover:bg-[#8B4D00]">
                  Cadastrar-se
                </button>
              </div>

          )}
          </div>
        </div>
      </header>
  );
};

export default Header;
