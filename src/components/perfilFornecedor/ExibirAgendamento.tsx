import axios from "axios";
import { URLAPI } from "../../constants/ApiUrl";
import { useState, useEffect, useRef } from "react";
import { Loading } from "../Loading";
import fotoPerfil from '../../assets/perfil.png';
import { toast } from 'react-toastify';
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import { useNavigate } from 'react-router-dom';
import { ServicoComUsuario } from "../../types/servicoType";
import MapaBusca from "./MapaBusca";
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { Modal } from "../Modal";
import Chat from "../Chat";

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
        case 'confirmar valor':
            return { color: '#2196F3', bgColor: '#E3F2FD', text: 'Confirmação de valor' }
        default:
            return { color: '#757575', bgColor: '#F5F5F5', text: status };
    }
};

export const ExibirAgendamentoFornecedor = ({ idServico }: ExibirAgendamentoFornecedorProps) => {
    const [agendamento, setAgendamento] = useState<ServicoComUsuario | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imagemExpandida, setImagemExpandida] = useState<string | null>(null);
    const [showNegociacaoModal, setShowNegociacaoModal] = useState(false);
    const [novoValor, setNovoValor] = useState<string>('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [id_servico, setIdServico] = useState("");
    const navigate = useNavigate();
    const socketRef = useRef<Socket | null>(null);

    const handleOpenChat = (idServico: string) => {
        setIdServico(idServico);
        setIsChatOpen(true);
    }

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

    useEffect(() => {
        if (!agendamento?.id_fornecedor) return;

        console.log('Iniciando conexão socket para fornecedor:', agendamento.id_fornecedor);

        // Inicializa o socket
        const socket = io(URLAPI, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketRef.current = socket;

        // Eventos de conexão do socket
        socket.on('connect', () => {
            console.log('Socket conectado');
            socket.emit('join', agendamento.id_fornecedor);
        });

        socket.on('disconnect', () => {
            console.log('Socket desconectado');
        });

        socket.on('connect_error', (error) => {
            console.error('Erro na conexão do socket:', error);
        });

        // Escuta o evento de valor atualizado
        socket.on('valor_atualizado', (update) => {
            if (update.id_servico === idServico) {
                setAgendamento(prev => {
                    if (prev) {
                        return {
                            ...prev,
                            valor: update.novo_valor,
                            status: update.novo_status
                        };
                    }
                    return prev;
                });
                toast.info('Valor do serviço atualizado!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        });

        return () => {
            console.log('Desconectando socket');
            socket.disconnect();
        };
    }, [agendamento?.id_fornecedor, idServico]);

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
        if (valor === undefined || valor === null || isNaN(valor)) {
            return "Combinar Valor";
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const handleNegociarPreco = async () => {
        try {
            if (!novoValor || isNaN(Number(novoValor)) || Number(novoValor) <= 0) {
                toast.error('Por favor, insira um valor válido');
                return;
            }

            const data = {
                id_servico: idServico,
                valor: Number(novoValor)
            };

            await axios.put(`${URLAPI}/servicos/valor`, data);
            atualizarStatus('confirmar valor');

            toast.success('Valor atualizado com sucesso!');

            setShowNegociacaoModal(false);
            setNovoValor('');
            fetchAgendamento();
        } catch (error) {
            console.error('Erro ao atualizar valor:', error);
            toast.error('Erro ao atualizar valor');
        }
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
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl font-bold text-[#AC5906]">
                                        {formatarValor(agendamento.valor)}
                                    </div>
                                    {agendamento.status === 'negociar valor' && (
                                        <button
                                            onClick={() => setShowNegociacaoModal(true)}
                                            className="px-4 py-2 bg-[#AC5906] text-white rounded-lg hover:bg-[#8B4705] flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Negociar Preço
                                        </button>
                                    )}
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

                            {/* Ações */}
                            <div className="mt-6 space-y-3">
                                {agendamento.status === 'pendente' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => atualizarStatus('negociar valor')}
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
                                {agendamento.status === 'confirmado' && (
                                    <button
                                        onClick={() => handleOpenChat(agendamento.id_usuario)}
                                        className="w-full bg-[#AC5906] text-white py-2.5 rounded-lg font-medium hover:bg-[#8B4705] transition-colors flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Entrar em contato
                                    </button>
                                )}
                                {agendamento.status === 'Em Andamento' && (
                                    <button
                                        onClick={() => handleOpenChat(agendamento.id_usuario)}
                                        className="w-full bg-[#AC5906] text-white py-2.5 rounded-lg font-medium hover:bg-[#8B4705] transition-colors flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Entrar em contato
                                    </button>
                                )}
                                {agendamento.status === 'confirmado' && (

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => atualizarStatus('Em Andamento')}
                                            className="bg-[#4CAF50] text-white py-2.5 rounded-lg font-medium hover:bg-[#3d8b40] transition-colors flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Iniciar serviço
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus('cancelado')}
                                            className="bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancelar
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
                    className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center p-4"
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

            {/* Modal de Negociação */}
            {showNegociacaoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Negociar Preço</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Novo Valor (R$)</label>
                            <input
                                type="number"
                                value={novoValor}
                                onChange={(e) => setNovoValor(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AC5906]"
                                placeholder="Digite o novo valor"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowNegociacaoModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleNegociarPreco}
                                className="px-4 py-2 bg-[#AC5906] text-white rounded-lg hover:bg-[#8B4705]"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
                <div className="fixed inset-0 flex items-center justify-center z-[1000]">
                    <div onClick={() => setIsChatOpen(false)} className="fixed inset-0 bg-black opacity-40"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-[1000px] w-[90vw] h-[80vh] max-h-[600px] flex flex-col">
                        <Chat idFornecedor={id_servico} />
                    </div>
                </div>
            </Modal>
        </div>
        
    );
};