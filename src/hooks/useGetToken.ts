import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

interface MyJwtPayload {
    id: string;
    nome: string;
    email: string;
    imagemPerfil: string;
    role: string;
}

export const useGetToken = () => {
    const [tokenData, setTokenData] = useState<MyJwtPayload | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode<MyJwtPayload>(token);
                setTokenData(decodedToken);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    return tokenData;
};
