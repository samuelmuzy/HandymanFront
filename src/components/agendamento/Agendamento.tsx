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

export const Agendamento = ({ idFornecedor }: AgendamentoProps) => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categoriasServico, setCategoriasServico] = useState<string[] | null>(null)

  const socketRef = useRef<Socket | null>(null);

  const token = useGetToken();

  const [formData, setFormData] = useState({
    categoria: "",
    data: "",
    horario: "",
    status: "pendente",
    id_pagamento: "",
    id_avaliacao: "",
    descricao: "",
    valor: ""
  });

  const [imagens, setImagens] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);


  const buscarCategoria = async () => {
    try {
      const response = await axios.get(`${URLAPI}/fornecedor/${idFornecedor}`)
      setCategoriasServico(response.data.categoria_servico);
    } catch (error: unknown) {
      toast.error("Erro ao buscar Categorias")
    }
  }

  useEffect(() => {
    buscarCategoria();
  }, [])

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Validar se todos os arquivos são imagens
      const validFiles = filesArray.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          toast.error(`O arquivo ${file.name} não é uma imagem válida. Apenas JPG, PNG e GIF são permitidos.`);
          return false;
        }
        return true;
      });

      setImagens(prev => [...prev, ...validFiles]);
      
      // Criar URLs de preview apenas para arquivos válidos
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImagens(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      return newUrls.filter((_, i) => i !== index);
    });
  };

  const enviarImagens = async (idServico: string) => {
    try {
      // Cria um array de promessas para enviar cada imagem
      const promessasEnvio = imagens.map(async (imagem) => {
        const formData = new FormData();
        formData.append('imagem', imagem);

        return axios.post(`${URLAPI}/servicos/inserir-imagems/${idServico}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      // Aguarda todas as imagens serem enviadas
      await Promise.all(promessasEnvio);

      toast.success(`${imagens.length} imagens enviadas com sucesso!`);
    } catch (error) {
      console.error('Erro ao enviar imagens:', error);
      toast.error('Erro ao enviar imagens. Tente novamente.');
    }
  };

  const handleAgendar = async (e: React.FormEvent) => {
    setIsLoading(true)
    try {
      e.preventDefault();

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

      const response = await axios.post(`${URLAPI}/servicos`, agendamentoData);

      // Se houver imagens, envia-as separadamente
      if (imagens.length > 0) {
        await enviarImagens(response.data.id_servico);
      }

      // Emite o evento de novo agendamento
      if (socketRef.current) {
        socketRef.current.emit('novo_agendamento', {
          ...response.data,
          id_fornecedor: idFornecedor
        });
      }

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
              {categoriasServico?.map((categoria, index) => (
                <option key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
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

          <div>
            <label className="block text-sm text-[#A75C00] mb-1">Imagens do Serviço</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#A75C00]/20 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-[#A75C00]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-[#A75C00]"><span className="font-semibold">Clique para fazer upload</span></p>
                  <p className="text-xs text-[#A75C00]">PNG, JPG ou GIF (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Preview das imagens */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
