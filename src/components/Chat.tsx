import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGetToken } from '../hooks/useGetToken';
import axios from 'axios';
import imagemPerfilProvisoria from '../assets/perfil.png';
import { URLAPI } from '../constants/ApiUrl';

interface Mensagem {
  _id: string;
  remetenteId: string;
  destinatarioId: string;
  nomeDestinatario: string;
  texto: string;
  dataEnvio: string;
}

interface ChatProps {
  idFornecedor: string;
}

interface Usuario {
  id: string
  picture: string;
  nome: string;
}

const Chat = ({ idFornecedor }: ChatProps) => {



  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const socketRef = useRef<Socket | null>(null);

  const tokenVerify = localStorage.getItem("token")

  const token = useGetToken();
  const nomeRemetente = token?.nome;

  const remetenteId = token?.id;
  const [destinatarioId, setDestinatarioId] = useState(idFornecedor);

  const mensagensRef = useRef<HTMLDivElement>(null);

  const buscarConversas = async () => {
    try {
      const response = await axios.get(`${URLAPI}/mensagem/buscar-usuarios-conversas/${token?.id}`, {
        headers: {
          Authorization: tokenVerify
        }
      });
      setUsuarios(response.data);

    } catch (error: unknown) {
      console.log(error)
    }
  }

  useEffect(() => {
    buscarConversas()
  }, [usuarios])


  useEffect(() => {
    const socket = io(`${URLAPI}`);
    socketRef.current = socket;

    if (remetenteId) {
      socket.emit('join', remetenteId);
    }

    socket.on('nova_mensagem', (msg: Mensagem) => {
      setMensagens((prev) => [...prev, msg]);
      setTimeout(() => {
        if (mensagensRef.current) {
          mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => {
      socket.disconnect(); // Desconecta ao desmontar o componente
    };
  }, [remetenteId]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await fetch(
          `${URLAPI}/mensagem/conversa/${remetenteId}/${destinatarioId}`
        );
        if (!response.ok) throw new Error('Erro ao buscar histórico');

        const historico: Mensagem[] = await response.json();
        setMensagens(historico);
      } catch (error) {
        console.error('Erro ao carregar histórico de mensagens:', error);
      }
    };

    if (remetenteId && destinatarioId) {
      fetchHistorico();
    }
  }, [remetenteId, destinatarioId]);



  const enviarMensagem = () => {
    if (!remetenteId || !destinatarioId || !mensagem.trim()) return;

    socketRef.current?.emit('mensagem', {
      remetenteId,
      destinatarioId,
      nomeDestinatario: nomeRemetente,
      texto: mensagem,
    });

    setMensagem('');
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const listarUsuariosConversa = usuarios.map((usu) => (
    <div
      key={usu.id}
      onClick={() => {
        setDestinatarioId(usu.id);
        setMensagens([]); // Limpa as mensagens antes de carregar as novas
      }}
      className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${destinatarioId === usu.id ? 'bg-gray-200' : ''
        }`}
    >
      <img
        src={usu.picture || imagemPerfilProvisoria}
        alt={usu.nome}
        className="w-10 h-10 rounded-full mr-2"
      />
      <span className="font-medium">{usu.nome}</span>
    </div>
  ));

  return (
    <div className='flex h-full overflow-hidden'>
      {token?.role === 'Fornecedor' && (
        <div className='w-1/4 border-r pr-4 overflow-y-auto flex flex-col'>
          <h2 className='text-xl font-bold mb-4 sticky top-0 bg-white py-2'>Conversas</h2>
          <div className='flex-1 overflow-y-auto'>
            {listarUsuariosConversa}
          </div>
        </div>

      )}

      <div className='w-3/4 pl-4 flex flex-col h-full'>
        <h2 className='text-xl font-bold mb-4 sticky top-0 bg-white py-2'>Chat</h2>

        <div 
          ref={mensagensRef}
          className='flex-1 overflow-y-auto mb-4 border rounded-lg p-4'
        >
          {mensagens.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <svg 
                className="w-16 h-16 mb-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
              <p className="text-lg font-medium">Nenhuma mensagem ainda</p>
              <p className="text-sm mt-2">Comece a conversa enviando uma mensagem!</p>
            </div>
          ) : (
            <ul className='space-y-4'>
              {mensagens.map((msg) => (
                <li
                  key={msg._id}
                  className={`flex flex-col ${msg.remetenteId === remetenteId ? 'items-end' : 'items-start'
                    }`}
                >
                  <div className='flex items-center mb-1'>
                    <img
                      src={
                        msg.remetenteId === token?.id
                          ? token.imagemPerfil // quando o usuário é o remetente
                          : usuarios.find(u => u.id === msg.remetenteId)?.picture || imagemPerfilProvisoria
                      }
                      alt=""
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <strong className='text-sm'>
                      {msg.remetenteId === remetenteId ? 'Você' : msg.nomeDestinatario}
                    </strong>
                  </div>
                  <div className='bg-gray-100 rounded-lg p-2 max-w-[70%]'>
                    {msg.texto}
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    {formatarData(msg.dataEnvio)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex gap-2 mt-auto'>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
            className='flex-1 p-2 border rounded-lg'
          />
          <button
            onClick={enviarMensagem}
            className='bg-[#A75C00] text-white px-4 py-2 rounded-lg hover:bg-[#8B4D00]'
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
