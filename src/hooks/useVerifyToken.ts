import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useProtectedPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return; // Impede a continuação do código abaixo
        }

        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000; // in seconds

            if (currentTime > decodedToken.exp) {
                localStorage.removeItem("token");
                navigate("/");
            }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                localStorage.removeItem("token");
                navigate("/");
            }
    }, [navigate]);
};
