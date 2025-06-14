import axios from "axios";
import { URLAPI } from "../../constants/ApiUrl";
import { useState, useEffect } from "react";
import { Loading } from "../Loading";
import fotoPerfil from '../../assets/perfil.png';
import { toast } from 'react-toastify';
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import { useNavigate } from 'react-router-dom';
import { ServicoComUsuario } from "../../types/servicoType";
import MapaBusca from "./MapaBusca";

interface ExibirAgendamentoFornecedorProps {
    idServico: string;
}

const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pendente':
            return { color: '#FFA500', bgColor: '#FFF3E0', text: 'Pendente' };
        case 'confirmado':
            return { color: '#4CAF50', bgColor: '#E8F5E9', text: 'Confirmado' };
        case 'em andamento':
            return { color: '#2196F3', bgColor: '#E3F2FD', text: 'Em Andamento' };
        case 'concluido':
            return { color: '#4CAF50', bgColor: '#E8F5E9', text: 'Concluído' };
        case 'cancelado':
            return { color: '#F44336', bgColor: '#FFEBEE', text: 'Cancelado' };
        case 'aguardando pagamento':
            return { color: '#FFC107', bgColor: '#FFF8E1', text: 'Aguardando Pagamento' };
        case 'recusado':
            return { color: '#F44336', bgColor: '#FFEBEE', text: 'Recusado' };
        default:
            return { color: '#757575', bgColor: '#F5F5F5', text: status };
    }
};

export const ExibirAgendamentoFornecedor = ({ idServico }: ExibirAgendamentoFornecedorProps) => {
    const [agendamento, setAgendamento] = useState<ServicoComUsuario | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imagemExpandida, setImagemExpandida] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchAgendamento = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${URLAPI}/servicos/${idServico}/usuario`);
            setAgendamento(response.data);
        } catch (error) {
            console.error('Erro ao buscar detalhes do agendamento:', error);
            toast.error('Erro ao carregar detalhes do agendamento');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgendamento();
    }, [idServico]);

    const handleStatusUpdate = (update: { id_servico: string; novo_status: string }) => {
        if (agendamento) {
            setAgendamento({
                ...agendamento,
                status: update.novo_status
            });
        }
    };

    const { emitirMudancaStatus } = useStatusNotifications(handleStatusUpdate, agendamento?.id_fornecedor || '');

    const atualizarStatus = async (status: string) => {
        try {
            const data = {
                id_servico: idServico,
                status: status
            };

            await axios.put(`${URLAPI}/servicos`, data);
            emitirMudancaStatus(idServico, status, agendamento?.id_fornecedor || '');
            toast.success('Status atualizado com sucesso!');
            fetchAgendamento();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.error('Erro ao atualizar status');
        }
    };

    const formatarData = (data: Date) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarHora = (data: Date) => {
        return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    if (loading) {
        return <Loading />;
    }

    if (!agendamento) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Agendamento não encontrado.</p>
            </div>
        );
    }

    const statusConfig = getStatusConfig(agendamento.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Botão Voltar */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Cabeçalho */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={agendamento.usuario?.imagemPerfil || fotoPerfil}
                                    alt="Cliente"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-[#AC5906]"
                                />
                                <div
                                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                                    style={{ backgroundColor: statusConfig.color }}
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    {agendamento.usuario?.nome}
                                </h3>
                                <p className="text-lg text-gray-500">{agendamento.categoria}</p>
                            </div>
                        </div>
                    </div>

                    {/* Corpo */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Status e Valor */}
                            <div className="flex justify-between items-center">
                                <div
                                    className="px-4 py-2 rounded-full text-lg font-medium"
                                    style={{
                                        backgroundColor: statusConfig.bgColor,
                                        color: statusConfig.color
                                    }}
                                >
                                    {statusConfig.text}
                                </div>
                                <div className="text-2xl font-bold text-[#AC5906]">
                                    {formatarValor(agendamento.valor)}
                                </div>
                            </div>

                            {/* Data e Hora */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-lg">{formatarData(agendamento.data)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-lg">{formatarHora(agendamento.horario)}</span>
                                </div>
                            </div>

                            {/* Descrição */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-lg font-medium text-gray-700 mb-2">Descrição do Serviço</h4>
                                <p className="text-gray-600">{agendamento.descricao}</p>
                            </div>

                            {/* Imagens */}
                            {agendamento.imagems && agendamento.imagems.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-medium text-gray-700 mb-4">Imagens do Serviço</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {agendamento.imagems.map((imagem, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square cursor-pointer group"
                                                onClick={() => setImagemExpandida(imagem)}
                                            >
                                                <img
                                                    src={imagem}
                                                    alt={`Imagem do serviço ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {agendamento.usuario?.endereco && (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium text-gray-700 mb-2">Endereço</h4>
                                        <div className="space-y-2">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Rua:</span> {agendamento.usuario.endereco.rua}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Cidade:</span> {agendamento.usuario.endereco.cidade}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Estado:</span> {agendamento.usuario.endereco.estado}
                                            </p>
                                        </div>
                                    </div>

                                    <MapaBusca cidade={agendamento.usuario.endereco.cidade} rua={agendamento.usuario.endereco.rua} />
                                </>
                            )}



                            {/* Informações de Contato */}
                            {agendamento.usuario && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-lg font-medium text-gray-700 mb-2">Contato do Cliente</h4>
                                    <div className="space-y-2">
                                        <p className="text-gray-600">
                                            <span className="font-medium">Email:</span> {agendamento.usuario.email}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">Telefone:</span> {agendamento.usuario.telefone}
                                        </p>
                                    </div>
                                </div>
                            )}


                            {/* Ações */}
                            <div className="mt-6 space-y-3">
                                {agendamento.status === 'pendente' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => atualizarStatus('Em Andamento')}
                                            className="bg-[#4CAF50] text-white py-3 rounded-lg font-medium hover:bg-[#3d8b40] transition-colors flex items-center justify-center text-lg"
                                        >
                                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Aceitar
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus('Recusado')}
                                            className="bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center text-lg"
                                        >
                                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Recusar
                                        </button>
                                    </div>
                                )}

                                {agendamento.status === 'Em Andamento' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => atualizarStatus('cancelado')}
                                            className="bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center text-lg"
                                        >
                                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus('Aguardando pagamento')}
                                            className="bg-[#4CAF50] text-white py-3 rounded-lg font-medium hover:bg-[#3d8b40] transition-colors flex items-center justify-center text-lg"
                                        >
                                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Finalizar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Imagem Expandida */}
            {imagemExpandida && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setImagemExpandida(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                        onClick={() => setImagemExpandida(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="red" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={imagemExpandida}
                        alt="Imagem expandida"
                        className="max-w-full max-h-[90vh] object-contain"
                    />
                </div>
            )}
        </div>
    );
};