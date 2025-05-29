import axios from "axios";
import { useEffect, useState } from "react";
import { URLAPI } from "../../constants/Api";

interface Solicitacao {
    servico: {
        id_servico: string;
        categoria: string;
        data: Date;
        horario: Date;
        status: string;
        descricao: string;
        id_pagamento?: string;
        id_avaliacao?: string;
    };
    usuario: {
        nome: string;
        email: string;
        telefone: string;
        picture: string;
    } | null;
}

interface PerfilProps {
    idFornecedor: string | undefined
}
export const Solicitacoes = ({ idFornecedor }: PerfilProps) => {
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
    const [verificarStatus, setVerificarStatus] = useState(false);
    

    const formatarData = (data: Date) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarHora = (data: Date) => {
        return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const atualizarStatus = async (id_servico: string, status: string) => {
        try {
            const data = {
                id_servico: id_servico,
                status: status
            }

            const response = await axios.put(`${URLAPI}/servicos`, data);

            setVerificarStatus((verificar) => !verificar)

            console.log(response.data);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmado':
                return 'bg-green-100 text-green-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            case 'concluido':
                return 'bg-green-100 text-green-800';
            case 'Aquardando pagamento':
                return 'bg-yellow-200 text-yellow-800'
            case 'Recusado':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-blue-100 text-gray-800';
        }
    };

    const buscarSolicitacoes = async () => {
        try {
            const response = await axios.get(`${URLAPI}/fornecedor/${idFornecedor}/solicitacoes`);
            setSolicitacoes(response.data);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    useEffect(() => {
        buscarSolicitacoes();
    }, [verificarStatus]);


    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#A75C00] mb-4">Solicitações de Serviço</h2>

                {solicitacoes.length > 0 ? (
                    <div className="grid gap-4">
                        {solicitacoes.map((solicitacao, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-medium text-lg text-[#A75C00]">
                                            {solicitacao.servico.categoria}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Cliente: {solicitacao.usuario?.nome}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(solicitacao.servico.status)}`}>
                                        {solicitacao.servico.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><strong>Data:</strong> {formatarData(solicitacao.servico.data)}</p>
                                    <p><strong>Horário:</strong> {formatarHora(solicitacao.servico.horario)}</p>
                                    <p><strong>Descrição:</strong> {solicitacao.servico.descricao}</p>
                                </div>

                                {solicitacao.usuario && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="font-medium text-[#A75C00] mb-2">Contato do Cliente</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>Email:</strong> {solicitacao.usuario.email}</p>
                                            <p><strong>Telefone:</strong> {solicitacao.usuario.telefone}</p>
                                        </div>
                                    </div>
                                )}
                                {solicitacao.servico.status === 'pendente' && (
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button
                                            className="px-4 py-2 bg-[#A75C00] text-white rounded-md hover:bg-[#8B4D00] transition-colors"
                                            onClick={() => { atualizarStatus(solicitacao.servico.id_servico, 'Em Andamento') }}
                                        >
                                            Aceitar
                                        </button>
                                        <button
                                            className="px-4 py-2 border border-[#A75C00] text-[#A75C00] rounded-md hover:bg-[#A75C00]/10 transition-colors"
                                            onClick={() => { atualizarStatus(solicitacao.servico.id_servico, 'Recusado') }}
                                        >
                                            Recusar
                                        </button>
                                    </div>
                                )}

                                {solicitacao.servico.status === 'Em Andamento' && (
                                    <div className="mt-4 flex justify-end space-x-2">

                                        <button
                                            className="px-4 py-2 border bg-red-700 border-red-500 text-white rounded-md hover:bg-red-800 transition-colors"
                                            onClick={() => { atualizarStatus(solicitacao.servico.id_servico, 'cancelado') }}
                                        >
                                            Cancelar Servico
                                        </button>
                                        <button
                                            onClick={() => { atualizarStatus(solicitacao.servico.id_servico, 'Aquardando pagamento') }}
                                            className="px-4 py-2 border bg-green-500 border-green-200 text-white rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Finalizar Serviço
                                        </button>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Nenhuma solicitação encontrada.</p>
                )}
            </div>
        </div>
    )
}