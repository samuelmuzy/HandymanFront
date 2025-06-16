import { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useGetToken } from '../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import { URLAPI } from '../constants/ApiUrl';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';


type UserContextType = {
    isLoggedIn: boolean;
    imagemPerfil: string;
    deslogar: () => void;
    setStatus: React.Dispatch<React.SetStateAction<string>>
};
interface StatusUpdate {
    id_servico: string;
    novo_status: string;
    timestamp: Date;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const token = useGetToken();
    
    const [status,setStatus] = useState("")


    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [imagemPerfil, setImagemPerfil] = useState<string>(''); // Apenas a URL da imagem

    const navigate = useNavigate(); // <- Aqui!

    const deslogar = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('imagemPerfil');
        setIsLoggedIn(false);
        setImagemPerfil('');
        navigate('/'); // <- Redireciona para a home
    };

    const procurarImagemPerfil = async () => {
        try {
            const response = await axios.get(`${URLAPI}/usuarios/buscar-id/${token?.id}`);
            const imagem = response.data.picture;
            setImagemPerfil(imagem);
            localStorage.setItem("imagemPerfil", imagem);
        } catch (error) {
            console.log("Erro ao buscar imagem de perfil:", error);
        }
    };

    useEffect(() => {
        const tokenExiste = !!token?.id;
        setIsLoggedIn(tokenExiste);

        if (tokenExiste) {
            const imagemSalva = localStorage.getItem("imagemPerfil");
            if (imagemSalva) {
                setImagemPerfil(imagemSalva);
            } else {
                procurarImagemPerfil();
            }
        }

    }, [token]);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!token?.id) return;

        const socket = io(URLAPI, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        
        socketRef.current = socket;

        // Entra na sala do usuário
        socket.emit('join', token?.id);

        // Escuta atualizações de status
        socket.on('atualizacao_status', (update: StatusUpdate) => {
            toast.info(`Status do serviço atualizado para: ${update.novo_status}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });

        // Eventos de conexão
        socket.on('connect', () => {
            console.log('Conectado ao servidor de notificações');
        });

        socket.on('disconnect', () => {
            console.log('Desconectado do servidor de notificações');
        });

        socket.on('novo_agendamento', (novoAgendamento) => {
            console.log('Novo agendamento recebido:', novoAgendamento);
            // Busca as solicitações atualizadas

            // Mostra uma notificação toast
            toast.info('Nova solicitação recebida!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [token?.id,status]);

    return (
        <UserContext.Provider value={{ isLoggedIn, imagemPerfil, deslogar,setStatus }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser deve ser usado dentro de um UserProvider');
    }
    return context;
};
