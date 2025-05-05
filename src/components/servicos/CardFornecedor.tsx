import { useNavigate } from "react-router-dom";
import React from "react";

interface CardProps {
    id:string;
    imagemFornecedor: string;
    nome: string;
    avaliacao: string;
    descricao: string;
    imagemIcone: string;
    subDescricao: string;
    valor: string;
}



export const CardFornecedor = ({
    id,
    imagemFornecedor,
    nome,
    avaliacao,
    descricao,
    imagemIcone,
    subDescricao,
    valor
}: CardProps): JSX.Element => {
    const navigate = useNavigate();

    const handleNavigation = (id: string) => {
        navigate(`/fornecedor/${id}`);
    };


    return (
        <div className="w-72 bg-white rounded-xl shadow-md overflow-hidden flex flex-col m-5">
            <img onClick={() => handleNavigation(id)} src={imagemFornecedor} alt={`Imagem de ${nome}`} className="w-full h-60 p-5 rounded-s cursor-pointer" />

            <div className="flex items-center gap-2 px-4 mt-4">
                <img onClick={() => handleNavigation(id)} src={imagemIcone} alt="Ícone do fornecedor" className="w-8 h-8 rounded-full" />
                <p className="font-semibold">{nome}</p>
                <p className="ml-auto font-medium text-sm text-gray-700">{avaliacao} <span className="text-yellow-400">★</span></p>
            </div>

            <div className="px-4 mt-6 text-sm text-gray-600">
                <p className="">{descricao}</p>
                <p className="text-orange-600 font-semibold">{subDescricao}</p>
            </div>

            <div className="flex items-center justify-between px-4 mt-4 mb-4">
                <p className="text-lg font-bold text-gray-800">{valor + " R$"} <span className="text-sm font-normal text-gray-500">por hora</span></p>
                <button onClick={() => handleNavigation(id)} className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition-colors">CONTRATAR</button>
            </div>
        </div>
    );
}
