import { HistoricoServico } from "../../types/historicoServico"
import fotoPerfil from '../../assets/perfil.png'
import { useState, useMemo } from 'react'
import { Modal } from "../Modal";
import Chat from "../Chat";
import axios from "axios";
import { URLAPI } from "../../constants/ApiUrl";
import { useGetToken } from "../../hooks/useGetToken";
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import { toast } from 'react-toastify';

interface AgendaProps{
    historicoServico:HistoricoServico[] | null
    setHistorico: React.Dispatch<React.SetStateAction<HistoricoServico[] | null>>
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
    { value: 'aguardando pagamento', label: 'Aguardando Pagamento' }
];

const dataOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Última Semana' },
    { value: 'mes', label: 'Último Mês' },
    { value: 'ano', label: 'Último Ano' }
];

export const Agenda = ({historicoServico, setHistorico}:AgendaProps) =>{
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [filtroData, setFiltroData] = useState('todos');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);
    const [id_servico, setIdServico] = useState("");
    const [servicoSelecionado, setServicoSelecionado] = useState<HistoricoServico | null>(null);
    const [avaliacao, setAvaliacao] = useState({
        nota: 5,
        comentario: "",
        id_servico: "",
        id_usuario: "",
        id_fornecedor: "",
        data: ""
    });

    const token = useGetToken();

    const handleStatusUpdate = (update: { id_servico: string; novo_status: string }) => {
        if (historicoServico) {
            const novoHistorico = historicoServico.map(servico => 
                servico.id_servico === update.id_servico
                    ? { ...servico, status: update.novo_status }
                    : servico
            );
            setHistorico(novoHistorico);
        }

        toast.info(`Status do serviço atualizado para: ${update.novo_status}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const { emitirMudancaStatus } = useStatusNotifications(handleStatusUpdate, token?.id);

    const handleOpenChat = (idServico: string) => {
        setIdServico(idServico);
        setIsChatOpen(true);
    }

    const handleAvaliarServico = (servico: HistoricoServico) => {
        setServicoSelecionado(servico);
        setIsAvaliacaoOpen(true);
    };

    const handleSubmitAvaliacao = async () => {
        if (!servicoSelecionado) return;
        
        try {
            const dataAvaliacao = {
                id_servico: servicoSelecionado.id_servico,
                id_usuario: token?.id,
                id_fornecedor: servicoSelecionado.id_fornecedor,
                data: servicoSelecionado.data,
                nota: avaliacao.nota,
                comentario: avaliacao.comentario
            };
            
            await axios.post(`${URLAPI}/avaliacao/`, dataAvaliacao);
            setIsAvaliacaoOpen(false);
            setAvaliacao({ nota: 5, comentario: "", data:"",id_fornecedor:"",id_servico:"",id_usuario:"" });
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
        }
    };

    const servicosFiltrados = useMemo(() => {
        if (!historicoServico) return [];

        // Primeiro aplica os filtros
        const servicosFiltrados = historicoServico.filter(servico => {
            // Filtro por status
            if (filtroStatus !== 'todos' && servico.status.toLowerCase() !== filtroStatus) {
                return false;
            }

            // Filtro por data
            const dataServico = new Date(servico.data);
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

        // Se não houver filtro de data ativo, ordena por data_submisao
        if (filtroData === 'todos') {
            return servicosFiltrados.sort((a, b) => {
                const dataA = new Date(a.data_submisao).getTime();
                const dataB = new Date(b.data_submisao).getTime();
                return dataB - dataA; // Ordem decrescente (mais recente primeiro)
            });
        }

        return servicosFiltrados;
    }, [historicoServico, filtroStatus, filtroData]);

    return(
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

            {/* Lista de Serviços */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicosFiltrados.length > 0 ? (
                    servicosFiltrados.map((servico, index) => {
                        const statusConfig = getStatusConfig(servico.status);
                        
                        return (
                            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                {/* Cabeçalho do Card */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <img 
                                                    src={servico.fornecedor?.imagemPerfil || fotoPerfil} 
                                                    alt="Fornecedor" 
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-[#AC5906]"
                                                />
                                                <div 
                                                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                                                    style={{ backgroundColor: statusConfig.color }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {servico.fornecedor?.nome}
                                                </h3>
                                                <p className="text-sm text-gray-500">{servico.categoria}</p>
                                            </div>
                                        </div>
                                        <div 
                                            className="px-3 py-1 rounded-full text-sm font-medium"
                                            style={{ 
                                                backgroundColor: statusConfig.bgColor,
                                                color: statusConfig.color
                                            }}
                                        >
                                            {statusConfig.text}
                                        </div>
                                    </div>
                                </div>

                                {/* Corpo do Card */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{new Date(servico.data).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{new Date(servico.horario).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-gray-600 line-clamp-2">{servico.descricao}</p>
                                    </div>

                                    {/* Ações do Card */}
                                    <div className="mt-6 space-y-3">
                                        {servico.status === 'concluido' && (
                                            <button 
                                                onClick={() => handleAvaliarServico(servico)}
                                                className="w-full bg-[#AC5906] text-white py-2.5 rounded-lg font-medium hover:bg-[#8B4705] transition-colors flex items-center justify-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                                Avaliar Serviço
                                            </button>
                                        )}

                                        {servico.status === 'Aguardando pagamento' && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <button className="bg-[#4CAF50] text-white py-2.5 rounded-lg font-medium hover:bg-[#3d8b40] transition-colors flex items-center justify-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    Pagar pelo App
                                                </button>
                                                <button 
                                                    onClick={() => emitirMudancaStatus(servico.id_servico,'concluido',servico.id_fornecedor )}
                                                    className="bg-[#2196F3] text-white py-2.5 rounded-lg font-medium hover:bg-[#1976D2] transition-colors flex items-center justify-center"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Pagamento Local
                                                </button>
                                            </div>
                                        )}

                                        {servico.status === 'Em Andamento' && (
                                            <button 
                                                onClick={() => handleOpenChat(servico.id_fornecedor)}
                                                className="w-full bg-[#AC5906] text-white py-2.5 rounded-lg font-medium hover:bg-[#8B4705] transition-colors flex items-center justify-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Entrar em contato
                                            </button>
                                        )}

                                        {servico.status.toLowerCase() === 'pendente' && (
                                            <div className="text-center">
                                                <p className="text-[#FFA500] text-sm mb-3">
                                                    Aguardando confirmação do fornecedor
                                                </p>
                                            </div>
                                        )}

                                        {['pendente', 'confirmado', 'em andamento'].includes(servico.status.toLowerCase()) && (
                                            <button 
                                                onClick={() => emitirMudancaStatus(servico.id_servico,'cancelado',servico.id_fornecedor )}
                                                className="w-full border border-red-500 text-red-500 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancelar Serviço
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">Nenhum serviço encontrado com os filtros selecionados.</p>
                    </div>
                )}
            </div>

            {/* Modal de Chat */}
            <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div onClick={() => setIsChatOpen(false)} className="fixed inset-0 bg-black opacity-40"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-[1000px] w-[90vw] h-[80vh] max-h-[600px] flex flex-col">
                        <Chat idFornecedor={id_servico} />
                    </div>
                </div>
            </Modal>

            {/* Modal de Avaliação */}
            <Modal isOpen={isAvaliacaoOpen} onClose={() => setIsAvaliacaoOpen(false)}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div onClick={() => setIsAvaliacaoOpen(false)} className="fixed inset-0 bg-black opacity-40"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Avaliar Serviço</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nota
                            </label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((nota) => (
                                    <button
                                        key={nota}
                                        onClick={() => setAvaliacao(prev => ({ ...prev, nota }))}
                                        className="focus:outline-none"
                                    >
                                        <svg
                                            className={`w-8 h-8 ${avaliacao.nota >= nota
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comentário
                            </label>
                            <textarea
                                value={avaliacao.comentario}
                                onChange={(e) => setAvaliacao(prev => ({ ...prev, comentario: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                                placeholder="Conte-nos sua experiência com o serviço..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsAvaliacaoOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmitAvaliacao}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                Enviar Avaliação
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}