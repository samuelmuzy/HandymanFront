import axios from "axios";
import { useEffect, useState } from "react";
import { Solicitacoes } from "./Solicitacoens";
import { DadosFornecedor } from "./DadosFornecedor";

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
    valor: number;
    disponibilidade: typeDisponibilidade[];
    solicitacoes: string[];
    media_avaliacoes: number;
}

interface PerfilProps {
    idFornecedor: string | undefined
}

export const PerfilFornecedor = ({ idFornecedor }: PerfilProps) => {
    const URLAPI = import.meta.env.VITE_URLAPI;
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
        <div className="space-y-6">
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setMudarPagina(1)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        mudarPagina === 1
                            ? 'bg-[#A75C00] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Solicitações
                </button>
                <button
                    onClick={() => setMudarPagina(2)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        mudarPagina === 2
                            ? 'bg-[#A75C00] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Dados do Perfil
                </button>
            </div>

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
    );
};