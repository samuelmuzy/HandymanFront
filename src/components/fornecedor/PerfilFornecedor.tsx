import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface FornecedorProps {
    nome: string;
    media_avaliacoes: string;
    descricao: string;
    sub_descricao: string;
    valor: string;
    imagemPerfil: string;
    imagemFornecedor: string;
    local: string;
}
export const PerfilFornecedor = ({local,nome,media_avaliacoes,descricao,sub_descricao,valor,imagemPerfil,imagemFornecedor}:FornecedorProps) => {
    const images = [
        {
          original: "https://res.cloudinary.com/dswmubmr2/image/upload/v1746478621/fornecedores/bcc2clxphpjvlha9shue.jpg",
          thumbnail: "https://res.cloudinary.com/dswmubmr2/image/upload/v1746478621/fornecedores/bcc2clxphpjvlha9shue.jpg",
        },
        {
          original: "https://res.cloudinary.com/dswmubmr2/image/upload/v1746478621/fornecedores/bcc2clxphpjvlha9shue.jpg",
          thumbnail: "https://res.cloudinary.com/dswmubmr2/image/upload/v1746478621/fornecedores/bcc2clxphpjvlha9shue.jpg",
        },
        {
          original: "https://res.cloudinary.com/dswmubmr2/image/upload/v1746478621/fornecedores/bcc2clxphpjvlha9shue.jpg",
          thumbnail: "https://res.cloudinary.com/dswmubmr2/image/upload/v1746478621/fornecedores/bcc2clxphpjvlha9shue.jpg",
        },
      ];
    return(
        <div className="flex flex-col items-center p-6">
        <div className="flex flex-col md:flex-row justify-around w-full  bg-white rounded-lg  p-6 gap-6">
          {/* Perfil do profissional */}
          <div className="flex items-center gap-4">
            <img
              className="w-32 h-32 rounded-full object-cover"
              src={imagemPerfil}
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
                src={imagemPerfil}
                alt="Imagem Ilustrativa"
              />
              <h2 className="font-semibold text-orange-600">{nome}</h2>
            </div>
            <p className="text-xl font-bold text-gray-900 mb-1">R$ {valor},00</p>
            <p className="text-xs text-gray-500 mb-2">* Valor cobrado por hora</p>
            <p className="text-xs text-gray-500 mb-4">Finalização em 2 dias</p>
            <button className="mb-2 border border-gray-400 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-100">
              Salvar
            </button>
            <button className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition-colors">
              Me contate
            </button>
          </div>
        </div>
      
        {/* Serviços oferecidos */}
        <div className="mt-6 w-full max-w-5xl bg-orange-50 rounded-lg p-4 shadow-lg">
          <h3 className="text-orange-700 font-semibold mb-2">
            Este serviço é oferecido por um profissional.
          </h3>
          <div className="flex gap-4">
            <button className="border border-orange-400 rounded px-3 py-1 text-sm hover:bg-orange-100">
              Reparos em madeira
            </button>
            <button className="border border-orange-400 rounded px-3 py-1 text-sm hover:bg-orange-100">
              Reparos em casas de madeira
            </button>
          </div>
        </div>
        {/*imagem ilustrativa */}
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

        {/* Sobre o profissional */}
        <div className="mt-6 w-full max-w-5xl rounded-lg p-4">
            <p className="text-orange-700 font-semibold mb-2">sobre-min:</p>
            <p>textkjjhkjhjkkj jkhkjhkjhjkhk hjkhkjhjkhjkhj hkjhkjhkjh</p>
        </div>
      </div>
      
    )
}