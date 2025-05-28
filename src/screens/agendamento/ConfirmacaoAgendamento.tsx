import { useLocation, useNavigate } from 'react-router-dom';
import { AgendamentoType } from '../../types/agendamento';


export const ConfirmacaoAgendamento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { agendamento, valor } = location.state as { agendamento: AgendamentoType, valor: string };

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHora = (data: Date) => {
    return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-white">
      <div className="w-[600px] mx-auto p-8 border border-[#A75C00]/20 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-[#A75C00]">Agendamento Confirmado!</h2>
          <p className="text-gray-600 mt-2">Seu serviço foi agendado com sucesso</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#A75C00] mb-3">Detalhes do Agendamento</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Categoria:</span> {agendamento.categoria}</p>
              <p><span className="font-medium">Data:</span> {formatarData(agendamento.data)}</p>
              <p><span className="font-medium">Horário:</span> {formatarHora(agendamento.horario)}</p>
              <p><span className="font-medium">Valor:</span> R$ {valor}</p>
              <p><span className="font-medium">Descrição:</span> {agendamento.descricao}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate(`/perfil-usuario/${agendamento.id_usuario}`)}
              className="w-full bg-[#A75C00] text-white py-2.5 rounded-md hover:bg-[#8B4D00] transition-colors"
            >
              Ver Meus Agendamentos
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full border border-[#A75C00] text-[#A75C00] py-2.5 rounded-md hover:bg-[#A75C00]/10 transition-colors"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 