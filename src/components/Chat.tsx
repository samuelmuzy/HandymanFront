import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGetToken } from '../hooks/useGetToken';

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

const Chat = ({ idFornecedor }: ChatProps) => {
  
  const URLAPI = import.meta.env.VITE_URLAPI;

  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const [id,nome,email,imagemPerfil, role ] = useGetToken();
  const nomeRemetente = nome;
  
  const remetenteId = id;
  const destinatarioId = idFornecedor;

  console.log(remetenteId,destinatarioId)

  useEffect(() => {
    const socket = io(`${URLAPI}`);
    socketRef.current = socket;

    if (remetenteId) {
      socket.emit('join', remetenteId);
    }

    socket.on('nova_mensagem', (msg: Mensagem) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect(); // Desconecta ao desmontar o componente
    };
  }, [remetenteId]);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await fetch(
          `http://localhost:3003/mensagem/conversa/${remetenteId}/${destinatarioId}`
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

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Chat</h2>

      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mensagens.map((msg) => (
            <li
              key={msg._id}
              style={{
                textAlign: msg.remetenteId === remetenteId ? 'right' : 'left',
                marginBottom: '0.5rem',
              }}
            >
              <div>
                <strong>{msg.remetenteId === remetenteId ? 'Você' : msg.nomeDestinatario}</strong>:
              </div>
              <div>{msg.texto}</div>
              <div style={{ fontSize: '0.75rem', color: 'gray' }}>
                {formatarData(msg.dataEnvio)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <input
        type="text"
        placeholder="Mensagem"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        style={{ width: '80%' }}
      />
      <button onClick={enviarMensagem} style={{ width: '18%', marginLeft: '2%' }}>
        Enviar
      </button>
    </div>
  );
};

export default Chat;
