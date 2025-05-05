import {jwtDecode} from "jwt-decode";
import { useState, useEffect } from "react";

interface MyJwtPayload {
    id: string;
    role: string;
    // outros campos se quiser, como exp, sub, etc.
}

export const useGetToken = () => {
    const [id, setId] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode<MyJwtPayload>(token); // Decodifica o token
                setId(decodedToken.id); // Define o ID no estado
                setRole(decodedToken.role); // Define o Role no estado
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    return [id, role];
};