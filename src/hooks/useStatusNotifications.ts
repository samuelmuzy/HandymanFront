import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { URLAPI } from '../constants/ApiUrl';

interface StatusUpdate {
    id_servico: string;
    novo_status: string;
    timestamp: Date;
}

export const useStatusNotifications = (
    onStatusUpdate: (update: StatusUpdate) => void,
    userId: string | undefined
) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const socket = io(URLAPI, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        
        socketRef.current = socket;

        // Entra na sala do usuário
        socket.emit('join', userId);

        // Escuta atualizações de status
        socket.on('atualizacao_status', (update: StatusUpdate) => {
            onStatusUpdate(update);
        });

        // Eventos de conexão
        socket.on('connect', () => {
            console.log('Conectado ao servidor de notificações');
        });

        socket.on('disconnect', () => {
            console.log('Desconectado do servidor de notificações');
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, onStatusUpdate]);

    const emitirMudancaStatus = useCallback((
        id_servico: string,
        novo_status: string,
        id_fornecedor: string
    ) => {
        if (!socketRef.current || !userId) return;

        socketRef.current.emit('mudanca_status', {
            id_servico,
            novo_status,
            id_usuario: userId,
            id_fornecedor
        });
    }, [userId]);

    return { emitirMudancaStatus };
};