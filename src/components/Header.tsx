import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../services/isUserLoggedIn';
import { useGetToken } from '../hooks/useGetToken';
import { Modal } from './Modal';
import imagemPerfilProvisoria from '../assets/perfil.png';
import Chat from './Chat';
import axios from 'axios';
import { URLAPI } from '../constants/ApiUrl';

type typeUsuario = {
  picture: string;
}

const Header = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [imagemPerfil,setImagemPerfil] = useState<typeUsuario | null>(null);

  console.log(imagemPerfil);

  const imagem = localStorage.getItem("imagemPerfil");

  const deslogar = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('imagemPerfil');
    navigate('/')
    setIsLoggedIn(false);
  }

  const token = useGetToken();

  const procurarImagemPerfil = async () => {
    try {
      const response = await axios.get(`${URLAPI}/usuarios/buscar-id/${token?.id}`);
      const imagem = response.data.picture;
  
      setImagemPerfil({ picture: imagem });
      localStorage.setItem("imagemPerfil", imagem);
    } catch (error) {
      console.log(error);
      setImagemPerfil({ picture: imagemPerfilProvisoria });
    }
  };
  
  const procurarImagemPerfilFornecedor = async () => {
    try {
      const response = await axios.get(`${URLAPI}/fornecedor/${token?.id}`);
      const imagem = response.data.imagemPerfil;
  
      setImagemPerfil({ picture: imagem });
      localStorage.setItem("imagemPerfil", imagem);
    } catch (error) {
      console.log(error);
      setImagemPerfil({ picture: imagemPerfilProvisoria });
    }
  };
  

  useEffect(() => {
    setIsLoggedIn(isUserLoggedIn());
  
    if (token?.id && !imagem) {
      if(token.role === 'Fornecedor'){
        procurarImagemPerfilFornecedor()
      }else{
        procurarImagemPerfil();
      }
    }
  }, [token]);


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

  const navegarPerfilUsuario = () => {
    navigate(`/perfil-usuario/${token?.id}`)
  }

  const navegarHome = () => {
    navigate('/');
  }

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev); // alterna entre true/false
  };

  return (
    <header className="bg-white shadow-sm border-b border-b-[#A75C00]">
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
            <div className='flex items-center gap-4'>
              <div className="relative inline-block">
                <div>
                  <img
                    onClick={toggleModal}
                    className="w-12 rounded-full cursor-pointer"
                    src={imagem || imagemPerfilProvisoria}
                    alt="imagem-perfil"
                  />
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  <div className="flex flex-col gap-2 p-4 text-sm">
                    <p className="cursor-pointer hover:text-orange-500">Conta</p>
                    <p onClick={navegarPerfilUsuario} className="cursor-pointer hover:text-orange-500">Perfil</p>
                    <p className="cursor-pointer hover:text-orange-500">Suporte</p>
                    <p onClick={deslogar} className="cursor-pointer hover:text-orange-500">Sair</p>
                  </div>
                </Modal>
              </div>
            </div>
          ) : (
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

      <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div onClick={() => setIsChatOpen(false)} className="fixed inset-0 bg-black opacity-40"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-[1000px] w-[90vw] h-[80vh] max-h-[600px] flex flex-col">
            <Chat idFornecedor="" />
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
