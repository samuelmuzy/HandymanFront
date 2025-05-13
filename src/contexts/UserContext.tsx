import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useGetToken } from '../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';

type Usuario = {
    picture: string;
};

type UserContextType = {
    isLoggedIn: boolean;
    imagemPerfil: string;
    deslogar: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const token = useGetToken();
    const URLAPI = import.meta.env.VITE_URLAPI;


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

    return (
        <UserContext.Provider value={{ isLoggedIn, imagemPerfil, deslogar }}>
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
