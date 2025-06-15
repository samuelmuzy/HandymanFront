import axios from "axios";
import { useEffect, useState, useRef, useMemo } from "react";
import { URLAPI } from "../../constants/ApiUrl";
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import fotoPerfil from '../../assets/perfil.png';
import { useNavigate } from "react-router-dom";
import { Solicitacao } from "../../types/agendamento";
import { Modal } from "../Modal";
import Chat from "../Chat";
import { Loading } from "../Loading";


interface PerfilProps {
    idFornecedor: string | undefined
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

const statusOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'em andamento', label: 'Em Andamento' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' },
    { value: 'aguardando pagamento', label: 'Aguardando Pagamento' },
    { value: 'recusado', label: 'Recusado' }
];

const dataOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Última Semana' },
    { value: 'mes', label: 'Último Mês' },
    { value: 'ano', label: 'Último Ano' }
];

export const Solicitacoes = ({ idFornecedor }: PerfilProps) => {
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
    const [verificarStatus, setVerificarStatus] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [filtroData, setFiltroData] = useState('todos');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [id_servico, setIdServico] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    const socketRef = useRef<Socket | null>(null);

    const navigate = useNavigate();

    const buscarSolicitacoes = async () => {
        setIsLoading(true)
        try {
          
            const response = await axios.get(`${URLAPI}/fornecedor/${idFornecedor}/solicitacoes`);    
            setSolicitacoes(response.data);
        } catch (error: unknown) {
            console.error('Erro ao buscar solicitações:', error);

        }finally{
            setIsLoading(false);
        }
    };

    const handleOpenChat = (idServico: string) => {
        setIdServico(idServico);
        setIsChatOpen(true);
    }

    // Efeito para carregar solicitações iniciais e quando verificarStatus mudar
    useEffect(() => {
        if (idFornecedor) {
            console.log('Efeito de carregar solicitações - ID Fornecedor:', idFornecedor);
            buscarSolicitacoes();
        }
    }, [verificarStatus, idFornecedor]);

    // Efeito para configurar o socket
    useEffect(() => {
        if (!idFornecedor) return;

        console.log('Iniciando conexão socket para fornecedor:', idFornecedor);

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
            socket.emit('join', idFornecedor);
        });

        socket.on('disconnect', () => {
            console.log('Socket desconectado');
        });

        socket.on('connect_error', (error) => {
            console.error('Erro na conexão do socket:', error);
        });

        // Escuta o evento de novo agendamento
        socket.on('novo_agendamento', (novoAgendamento) => {
            console.log('Novo agendamento recebido:', novoAgendamento);
            // Busca as solicitações atualizadas
            buscarSolicitacoes();

            // Mostra uma notificação toast
            toast.info('Nova solicitação recebida!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });

        return () => {
            console.log('Desconectando socket');
            socket.disconnect();
        };
    }, [idFornecedor]);

    const handleStatusUpdate = (update: { id_servico: string; novo_status: string }) => {
        console.log('Atualização de status recebida:', update);
        setSolicitacoes(prevSolicitacoes =>
            prevSolicitacoes.map(solicitacao =>
                solicitacao.servico.id_servico === update.id_servico
                    ? {
                        ...solicitacao,
                        servico: {
                            ...solicitacao.servico,
                            status: update.novo_status
                        }
                    }
                    : solicitacao
            )
        );

        // Mostra uma notificação toast
        toast.info(`Status atualizado para: ${update.novo_status}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const { emitirMudancaStatus } = useStatusNotifications(handleStatusUpdate, idFornecedor);

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

            // Emite o evento de socket
            emitirMudancaStatus(id_servico, status, idFornecedor as string);

            setVerificarStatus((verificar) => !verificar);
            console.log(response.data);
        } catch (error: unknown) {
            console.log(error);
            toast.error('Erro ao atualizar status');
        }
    }

    const solicitacoesFiltradas = useMemo(() => {
        if (!solicitacoes) return [];

        // Primeiro aplica os filtros
        const servicosFiltrados = solicitacoes.filter(solicitacao => {
            // Filtro por status
            if (filtroStatus !== 'todos' && solicitacao.servico.status.toLowerCase() !== filtroStatus) {
                return false;
            }

            // Filtro por data
            const dataServico = new Date(solicitacao.servico.data);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            switch (filtroData) {
                case 'hoje':
                    return dataServico.toDateString() === hoje.toDateString();
                case 'semana':
                    const umaSemanaAtras = new Date(hoje);
                    umaSemanaAtras.setDate(hoje.getDate() - 7);
                    return dataServico >= umaSemanaAtras;
                case 'mes':
                    const umMesAtras = new Date(hoje);
                    umMesAtras.setMonth(hoje.getMonth() - 1);
                    return dataServico >= umMesAtras;
                case 'ano':
                    const umAnoAtras = new Date(hoje);
                    umAnoAtras.setFullYear(hoje.getFullYear() - 1);
                    return dataServico >= umAnoAtras;
                default:
                    return true;
            }
        });

        // Se não houver filtro de data ativo, ordena por data
        if (filtroData === 'todos') {
            return servicosFiltrados.sort((a, b) => {
                const dataA = new Date(a.servico.data_submisao).getTime();
                const dataB = new Date(b.servico.data_submisao).getTime();
                return dataB - dataA; // Ordem decrescente (mais recente primeiro)
            });
        }

        return servicosFiltrados;
    }, [solicitacoes, filtroStatus, filtroData]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Filtros */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Filtro de Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => setFiltroStatus(status.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                        ${filtroStatus === status.value
                                            ? 'bg-[#AC5906] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtro de Data */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por Data
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {dataOptions.map((data) => (
                                <button
                                    key={data.value}
                                    onClick={() => setFiltroData(data.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                        ${filtroData === data.value
                                            ? 'bg-[#AC5906] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {data.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#A75C00] mb-4">Solicitações de Serviço:</h2>

                {solicitacoesFiltradas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {solicitacoesFiltradas.map((solicitacao, index) => {
                            const statusConfig = getStatusConfig(solicitacao.servico.status);

                            return (
                                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                                    {/* Cabeçalho do Card */}
                                    <div onClick={() => navigate(`/exibirAgenda/${solicitacao.servico.id_servico}`)} className="p-6 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <img
                                                        src={solicitacao.usuario?.picture || fotoPerfil}
                                                        alt="Cliente"
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-[#AC5906]"
                                                    />
                                                    <div
                                                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                                                        style={{ backgroundColor: statusConfig.color }}
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {solicitacao.usuario?.nome}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{solicitacao.servico.categoria}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Corpo do Card */}
                                    <div className="p-6">
                                        <div onClick={() => navigate(`/exibirAgenda/${solicitacao.servico.id_servico}`)} className="space-y-4">
                                            <div className="flex items-center text-gray-600">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatarData(solicitacao.servico.data)}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{formatarHora(solicitacao.servico.horario)}</span>
                                            </div>
                                            <p className="text-gray-600 line-clamp-2">{solicitacao.servico.descricao}</p>
                                        </div>

                                        {/* Informações de Contato */}
                                        {solicitacao.usuario && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div
                                                        className="px-3 w-32 py-1 rounded-full text-center text-sm font-medium"
                                                        style={{
                                                            backgroundColor: statusConfig.bgColor,
                                                            color: statusConfig.color
                                                        }}
                                                    >
                                                        {statusConfig.text}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Ações do Card */}
                                        <div className="mt-6 space-y-3">
                                            {solicitacao.servico.status === 'pendente' && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => atualizarStatus(solicitacao.servico.id_servico, 'negociar valor')}
                                                        className="bg-[#4CAF50] text-white py-2.5 rounded-lg font-medium hover:bg-[#3d8b40] transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Aceitar
                                                    </button>
                                                    <button
                                                        onClick={() => atualizarStatus(solicitacao.servico.id_servico, 'Recusado')}
                                                        className="bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Recusar
                                                    </button>
                                                </div>
                                            )}
                                            {solicitacao.servico.status === 'negociar valor' && (
                                                <div className="mt-6 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={() => navigate(`/exibirAgenda/${solicitacao.servico.id_servico}`)}
                                                            className="bg-[#4CAF50] text-white py-2.5 rounded-lg font-medium hover:bg-[#3d8b40] transition-colors flex items-center justify-center"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Negociar Preço
                                                        </button>
                                                        <button
                                                            onClick={() => atualizarStatus(solicitacao.servico.id_servico, 'Recusado')}
                                                            className="bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            Recusar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {solicitacao.servico.status === 'confirmado' && (
                                                <button
                                                    onClick={() => handleOpenChat(solicitacao.usuario.id_usuario)}
                                                    className="w-full bg-[#AC5906] text-white py-2.5 rounded-lg font-medium hover:bg-[#8B4705] transition-colors flex items-center justify-center"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    Entrar em contato
                                                </button>
                                            )}
                                            {solicitacao.servico.status === 'confirmado' && (
                                                
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => atualizarStatus(solicitacao.servico.id_servico, 'Em Andamento')}
                                                        className="bg-[#4CAF50] text-white py-2.5 rounded-lg font-medium hover:bg-[#3d8b40] transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Iniciar serviço
                                                    </button>
                                                    <button
                                                        onClick={() => atualizarStatus(solicitacao.servico.id_servico, 'cancelado')}
                                                        className="bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Cancelar
                                                    </button>
                                                </div>
                                                
                                            )}
                                            {solicitacao.servico.status === 'Em Andamento' && (
                                                <button
                                                    onClick={() => handleOpenChat(solicitacao.usuario.id_usuario)}
                                                    className="w-full bg-[#AC5906] text-white py-2.5 rounded-lg font-medium hover:bg-[#8B4705] transition-colors flex items-center justify-center"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    Entrar em contato
                                                </button>
                                            )}


                                            {solicitacao.servico.status === 'Em Andamento' && (
                                                
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => atualizarStatus(solicitacao.servico.id_servico, 'Aguardando pagamento')}
                                                        className="bg-[#4CAF50] text-white py-2.5 rounded-lg font-medium hover:bg-[#3d8b40] transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Finalizar
                                                    </button>
                                                    <button
                                                        onClick={() => atualizarStatus(solicitacao.servico.id_servico, 'cancelado')}
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
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Nenhuma solicitação encontrada com os filtros selecionados.</p>
                    </div>
                )}
            </div>
            <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div onClick={() => setIsChatOpen(false)} className="fixed inset-0 bg-black opacity-40"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-[1000px] w-[90vw] h-[80vh] max-h-[600px] flex flex-col">
                        <Chat idFornecedor={id_servico} />
                    </div>
                </div>
            </Modal>
        </div>
        
    );
};