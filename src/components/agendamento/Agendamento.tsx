import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useGetToken } from '../../hooks/useGetToken';
import { Loading } from '../Loading';
import { useNavigate } from 'react-router-dom';
import { AgendamentoType } from '../../types/agendamento';
import { URLAPI } from '../../constants/ApiUrl';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface AgendamentoProps {
    idFornecedor: string;
}

export const Agendamento = ({idFornecedor}:AgendamentoProps) => {
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const token = useGetToken();

  const [formData, setFormData] = useState({
    categoria: "",
    data: "",
    horario: "",
    status: "pendente",
    id_pagamento: "",
    id_avaliacao: "",
    descricao:"",
    valor:""
  });

  // Inicializa o socket
  useEffect(() => {
    const socket = io(URLAPI);
    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgendar = async (e: React.FormEvent) => {
    setIsLoading(true)
    try {
      e.preventDefault();
      
      // Combinando data e hora para criar o objeto Date
      const dataHora = new Date(`${formData.data}T${formData.horario}`);
      
      const agendamentoData: AgendamentoType = {
        id_usuario: token?.id as string,
        id_fornecedor: idFornecedor,
        categoria: formData.categoria,
        data: new Date(formData.data),
        horario: dataHora,
        status: formData.status,
        id_pagamento: formData.id_pagamento || undefined,
        id_avaliacao: formData.id_avaliacao || undefined,
        descricao: formData.descricao
      };

      console.log('Enviando dados do agendamento:', agendamentoData);
      const response = await axios.post(`${URLAPI}/servicos`, agendamentoData);
      console.log('Resposta do servidor:', response.data);
      
      // Emite o evento de novo agendamento
      if (socketRef.current) {
        console.log('Emitindo evento de novo agendamento');
        socketRef.current.emit('novo_agendamento', {
          ...response.data,
          id_fornecedor: idFornecedor
        });
      } else {
        console.error('Socket não está conectado');
      }
      
      // Salvar o agendamento confirmado e redirecionar
      navigate('/confirmacao-agendamento', { 
        state: { 
          agendamento: response.data,
          valor: formData.valor
        } 
      });
      
    } catch (error) {
      console.error('Erro ao agendar serviço:', error);
      toast.error('Erro ao agendar serviço. Tente novamente.');
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
}

  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-white'>
      <div className="w-[600px] mx-auto p-8 border border-[#A75C00]/20 rounded-lg">
        <h2 className="text-2xl font-medium mb-8 text-center text-[#A75C00]">Agendamento de Serviço</h2>

        <form onSubmit={handleAgendar} className="space-y-5">
          <div>
            <label className="block text-sm text-[#A75C00] mb-1">Categoria do Serviço</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00]"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Elétrica">Elétrica</option>
              <option value="Encanamento">Encanamento</option>
              <option value="Carpintaria">Carpintaria</option>
              <option value="Jardinagem">Jardinagem</option>
              <option value="Mudança">Mudança</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#A75C00] mb-1">Data</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#A75C00] mb-1">Hora</label>
              <input
                type="time"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#A75C00] mb-1">Descrição do Serviço</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#A75C00] text-white py-2.5 mt-8 rounded-md hover:bg-[#8B4D00] transition-colors"
          >
            Agendar
          </button>
        </form>
      </div>
    </div>
  );
};
