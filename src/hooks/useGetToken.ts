import {jwtDecode} from "jwt-decode";
import { useState, useEffect } from "react";

interface MyJwtPayload {
    id: string;
    nome:string;
    email:string;
    imagemPerfil:string;
    role: string;
    // outros campos se quiser, como exp, sub, etc.
}

export const useGetToken = () => {
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
    const [nome,setNome] = useState("");
    const [email,setEmail] = useState("");
    const [imagemPerfil,setImagemPerfil] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode<MyJwtPayload>(token); // Decodifica o token
                setId(decodedToken.id); // Define o ID no estado
                setRole(decodedToken.role);
                setEmail(decodedToken.email);
                setNome(decodedToken.nome);
                setImagemPerfil(decodedToken.imagemPerfil) // Define o Role no estado
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    return [id,nome,email,imagemPerfil, role];
};