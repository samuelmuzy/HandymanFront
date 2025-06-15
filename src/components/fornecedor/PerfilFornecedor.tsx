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
        return toast.error("Crie um conta para fazer um serviço")
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
            <h2 className="text-xl font-semibold text-orange-700">{nome}</h2>
            <p className="text-lg text-gray-700">⭐ {media_avaliacoes}</p>
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
        <div className="flex flex-col border border-orange-400 rounded-lg p-4 w-72">
          <div className="flex items-center gap-2 mb-2">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={imagemPerfil || imagemPefilDefault}
              alt="Imagem Ilustrativa"
            />
            <h2 className="font-semibold text-orange-600">{nome}</h2>
          </div>
          <p className="text-xl font-bold text-gray-900 mb-1">R$ {valor},00</p>
          <p className="text-xs text-gray-500 mb-2">* Valor cobrado por hora</p>
          <p className="text-xs text-gray-500 mb-4">Finalização em 2 dias</p>

          <button onClick={navegarAgendamento} className="bg-orange-500 text-white text-sm px-4 pt-2 rounded hover:bg-orange-500-600 transition-colors">
            Fazer chamado
          </button>
        </div>
      </div>

      {/* Serviços oferecidos */}
      <div className="mt-6 w-full max-w-5xl bg-orange-50 rounded-lg p-4 shadow-lg">
        <h3 className="text-orange-700 font-semibold mb-2">
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