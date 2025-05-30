import { useNavigate } from "react-router-dom";
import { typeUsuario } from "./PerfilUsuario"
import imagemPerfilProvisoria from '../../assets/perfil.png';
import { Dispatch, SetStateAction, useState } from "react";
import { HistoricoServico } from "../../types/historicoServico";
import { Modal } from "../Modal";
import Chat from "../Chat";
import axios from "axios";
import { useGetToken } from "../../hooks/useGetToken";
import { URLAPI } from "../../constants/ApiUrl";

interface Pagina_inicialProps {
    usuario: typeUsuario | null
    historico: HistoricoServico[] | null
    setMudarPagina: Dispatch<SetStateAction<number>>;
}

export const Pagina_inicial = ({ usuario, setMudarPagina, historico }: Pagina_inicialProps) => {
    const navigate = useNavigate();
    

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);

    const token = useGetToken();

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

    console.log(historico)

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
                return 'bg-yellow-100 text-gray-800';
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

    const handleOpenChat = (idServico: string) => {
        setIdServico(idServico);
        console.log(idServico)
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

                                        {servico.status === 'Em Andamento' && (
                                            <div className="flex justify-end">
                                                <button onClick={() => handleOpenChat(servico.id_fornecedor)} className="bg-green-200">Entrar em Contato</button>
                                            </div>
                                        )}

                                        {servico.status === 'Aquardando pagamento' && (
                                            <div className="flex justify-end">
                                                <button onClick={() => navigate(`/detalhes-servico-confirmado/${servico.id_servico}`)} className="bg-green-200">Pagamento</button>
                                            </div>
                                        )}
                                        {servico.status === 'concluido' && (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleAvaliarServico(servico)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    Avaliar Serviço
                                                </button>
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
            <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div onClick={() => setIsChatOpen(false)} className="fixed inset-0 bg-black opacity-40"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-[1000px] w-[90vw] h-[80vh] max-h-[600px] flex flex-col">
                        <Chat idFornecedor={id_servico} />
                    </div>
                </div>
            </Modal>

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