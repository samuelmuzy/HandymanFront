import axios from "axios";
import { useEffect, useState } from "react";
import { Solicitacoes } from "./Solicitacoens";
import { DadosFornecedor } from "./DadosFornecedor";
import { URLAPI } from "../../constants/ApiUrl";


export type typeEndereco = {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
}

export type typeDisponibilidade = {
    data: string;
    horario: string;
    status: 'livre' | 'ocupado';
}

export type typeFornecedor = {
    id_fornecedor?: string;
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    endereco: typeEndereco;
    categoria_servico: string[];
    descricao: string;
    sub_descricao: string;
    imagemPerfil: string;
    imagemIlustrativa: string;
    imagemServicos: string[];
    valor: number;
    sobre:string;
    disponibilidade: typeDisponibilidade[];
    solicitacoes: string[];
    media_avaliacoes: number;
}

interface PerfilProps {
    idFornecedor: string | undefined
}

export const PerfilFornecedor = ({ idFornecedor }: PerfilProps) => {
    
    const [mudarPagina, setMudarPagina] = useState(1);
    const [usuario, setUsuario] = useState<typeFornecedor | null>(null);

    const procurarUsuario = async () => {
        try {
            const response = await axios.get(`${URLAPI}/fornecedor/${idFornecedor}`);
            setUsuario(response.data);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    useEffect(() => {
        procurarUsuario();
    }, []);

    return (
        <div className="pt-8 px-5 md:px-8">
            <div className="flex md:flex-row flex-col gap-8">
                {/* Coluna dos botões */}
                <div className="md:w-64 md:justify-start justify-center flex-shrink-0">
                    <div className="sticky top-8">
                        <div className="flex md:gap-0 gap-6 md:flex-col  md:w-full md:justify-start items-center justify-center  md:space-y-4">
                            <button
                                onClick={() => setMudarPagina(1)}
                                className={`px-4 py-2 md:w-full rounded-md transition-colors ${
                                    mudarPagina === 1
                                        ? 'bg-[#A75C00] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Solicitações
                            </button>
                            <button
                                onClick={() => setMudarPagina(2)}
                                className={`px-4 py-2  md:w-full rounded-md transition-colors ${
                                    mudarPagina === 2
                                        ? 'bg-[#A75C00] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Dados do Perfil
                            </button>
                        </div>
                    </div>
                </div>
                

                {/* Coluna do conteúdo */}
                <div className="flex-1">
                    {mudarPagina === 1 && (
                        <Solicitacoes idFornecedor={idFornecedor}/>
                    )}

                    {mudarPagina === 2 && (
                        <DadosFornecedor 
                            idFornecedor={idFornecedor}
                            usuario={usuario}
                            onUpdate={procurarUsuario}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};