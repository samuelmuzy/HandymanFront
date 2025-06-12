import { HistoricoServico } from "../../types/historicoServico"
import fotoPerfil from '../../assets/perfil.png'
import { useState, useMemo } from 'react'

interface AgendaProps{
    historicoServico:HistoricoServico[] | null
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

export const Agenda = ({historicoServico}:AgendaProps) =>{
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [filtroData, setFiltroData] = useState('todos');

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
                                            <button className="w-full bg-[#AC5906] text-white py-2.5 rounded-lg font-medium hover:bg-[#8B4705] transition-colors flex items-center justify-center">
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
                                                <button className="bg-[#2196F3] text-white py-2.5 rounded-lg font-medium hover:bg-[#1976D2] transition-colors flex items-center justify-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Pagamento Local
                                                </button>
                                            </div>
                                        )}

                                        {servico.status === 'Em Andamento' && (
                                            <button className="w-full bg-[#AC5906] text-white py-2.5 rounded-lg font-medium hover:bg-[#8B4705] transition-colors flex items-center justify-center">
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
                                            <button className="w-full border border-red-500 text-red-500 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center">
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
        </div>
    )
}