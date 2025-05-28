import { useNavigate } from "react-router-dom";
import { typeUsuario } from "./PerfilUsuario"
import imagemPerfilProvisoria from '../../assets/perfil.png';
import { Dispatch, SetStateAction } from "react";
import { HistoricoServico } from "../../types/historicoServico";

interface Pagina_inicialProps {
    usuario: typeUsuario | null
    historico: HistoricoServico[] | null
    setMudarPagina: Dispatch<SetStateAction<number>>;
}

export const Pagina_inicial = ({ usuario, setMudarPagina, historico }: Pagina_inicialProps) => {
    const navigate = useNavigate();

    const formatarData = (data: Date) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarHora = (data: Date) => {
        return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'Esperando confirmação':
                return 'bg-green-100 text-green-800';
            case 'Em Andamento':
                return 'bg-gray-100 text-gray-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            case 'concluido':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem('imagemPerfil');
        navigate('/');
    }

    return (
        <div>
            <div className="flex-1 px-10 py-8">
                <div className="flex items-center space-x-6 mb-6">
                    <img
                        src={usuario?.picture || imagemPerfilProvisoria}
                        alt="Foto de perfil"
                        className="w-16 h-16 rounded-full border border-gray-300"
                    />
                    <div>
                        <h1 className="text-xl font-semibold">{usuario?.nome}</h1>
                        <p className="text-gray-600">{usuario?.email}</p>
                    </div>
                </div>

                <div className="flex space-x-4 mb-8">
                    <button onClick={() => setMudarPagina(2)} className="bg-gray-100 w-32 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                        Dados pessoais
                    </button>
                    <button className="bg-gray-100 w-32 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                        Segurança
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-100 w-32 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                    >
                        Sair
                    </button>
                </div>

                <div className="text-gray-700 space-y-4">
                    <p><strong>Telefone:</strong> {usuario?.telefone}</p>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Histórico de Serviços</h3>
                        {historico && historico.length > 0 ? (
                            <div className="space-y-4">
                                {historico.map((servico, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-medium text-[#A75C00]">{servico.categoria}</h4>
                                                <p className="text-sm text-gray-600">{servico.fornecedor?.nome}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(servico.status)}`}>
                                                {servico.status}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong>Data:</strong> {formatarData(servico.data)}</p>
                                            <p><strong>Horário:</strong> {formatarHora(servico.horario)}</p>
                                            <p><strong>Descrição:</strong> {servico.descricao}</p>
                                        </div>

                                        {servico.status === 'confirmado' && (
                                            <div className="flex justify-end">
                                                <button onClick={() => navigate(`/detalhes-servico-confirmado/${servico.id_servico}`)} className="bg-green-200">Confirmar</button>
                                            </div>
                                        )}
                                    </div>

                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Nenhum serviço encontrado no histórico.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}