import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import imagemPefilDefault from '../../assets/perfil.png';
import { useNavigate } from "react-router-dom";
import { useGetToken } from "../../hooks/useGetToken";
import { toast } from "react-toastify";

interface FornecedorProps {
  id: string
  nome: string;
  media_avaliacoes: string;
  descricao: string;
  valor: string;
  imagemPerfil: string;
  local: string;
  imagensServicos: string[];
  categoria_servico: string[];
  sobre: string;
}
export const PerfilFornecedor = ({ id, local, nome, media_avaliacoes, descricao, valor, imagemPerfil, imagensServicos, categoria_servico, sobre }: FornecedorProps) => {

  const images = imagensServicos.map((imagem) => ({
    original: imagem,
    thumbnail: imagem,
  }));

  const token = useGetToken()

  const navegarAgendamento = () =>{
    if(!token){
        return toast.error("Crie um conta para fazer um serviço");
    }
    if(token.role === 'Fornecedor'){
        return toast.error("Entre como usuário para agendar serviços");
    }
    navigate(`/pagamento/${id}`)
  }

  const categorias = categoria_servico.map((fornecedor) => (
    <button className="border border-orange-400 rounded px-3 py-1 text-sm hover:bg-orange-100" key={fornecedor}>
      {fornecedor}
    </button>
  ));
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex flex-col md:flex-row justify-around w-full  bg-white rounded-lg  p-6 gap-6">
        {/* Perfil do profissional */}
        <div className="flex items-center gap-4">
          <img
            className="w-32 h-32 rounded-full object-cover"
            src={imagemPerfil || imagemPefilDefault}
            alt="Imagem do Fornecedor"
          />
          <div>
            <h2 className="text-3xl font-semibold text-[#AD5700]">{nome}</h2>
            <p className="text-lg text-gray-700 flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {media_avaliacoes}
            </p>
            <p className="text-gray-600">{local}</p>
            <div className="mt-2">
              <h3 className="font-semibold text-orange-700">Especialidades:</h3>
              <p className="text-gray-700">
                {descricao}
              </p>
            </div>
          </div>
        </div>

        {/* Card lateral com valor */}
        <div className="flex flex-col border border-[#AD5700] rounded-lg p-6 w-72 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={imagemPerfil || imagemPefilDefault}
              alt="Imagem Ilustrativa"
            />
            <h2 className="font-semibold text-[#AD5700] text-lg">{nome}</h2>
          </div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-2xl font-bold text-gray-900">
              R$ {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(valor))}
            </p>
            <button className="flex items-center text-gray-600 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Salvar
            </button>
          </div>
          <p className="text-green-600 text-xs mb-2">Cadastre e ganhe 15% de Desconto</p>
          <p className="text-xs text-gray-500 mb-1">* Valor cobrado por hora</p>
          <p className="text-xs text-gray-500 mb-4">Finalização em 2 dias</p>

          <button onClick={navegarAgendamento} className="bg-green-500 text-white text-base px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200">
            Me contate
          </button>
        </div>
      </div>

      {/* Serviços oferecidos */}
      <div className="mt-8 w-full max-w-5xl bg-orange-50 rounded-lg p-6 shadow-lg">
        <h3 className="text-orange-700 font-semibold mb-3">
          Este serviço é oferecido por um profissional.
        </h3>
        <div className="flex gap-4">
          {categorias}
        </div>
      </div>
      {/*imagem ilustrativa */}
      {images.length !== 0 && (
        <div className="mt-6 w-full max-w-4xl rounded-lg p-4">
          <h2 className="text-orange-700 font-semibold mb-5">Imagens do serviço:</h2>
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={false}
            showThumbnails={true}
            thumbnailPosition="bottom" // top, bottom, left, right
          />
        </div>
      )}

      {/* Sobre o profissional */}
      <div className="mt-6 w-full max-w-5xl rounded-lg p-4">
        <p className="text-orange-700 font-semibold mb-2">sobre-min:</p>
        <p>{sobre}</p>
      </div>

    </div>

  )
}