import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PerfilProps {
    id:string | undefined
}

export type typeUsuario = {
    id_usuario:string;
    email: string;
    nome: string;
    sub: string;
    picture: string;
    autenticacaoVia: string;
    historico_servicos:string[];
    telefone:string;
}

export const PerfilUsuario = ({id}:PerfilProps) =>{
    const navigate = useNavigate();

    const URLAPI = import.meta.env.VITE_URLAPI;

    const logout = () =>{
        localStorage.removeItem("token");
        navigate('/');
    }

    const [usuario,setUsuario] = useState<typeUsuario | null>(null)

    const procurarUsuario = async () =>{
        try{
            const response = await axios.get(`${URLAPI}/usuarios/buscar-id/${id}`)

            setUsuario(response.data);
        }catch(error:unknown){
            console.log(error)
        }
    }

    useEffect(() =>{
        procurarUsuario();
    },[])

    const historico = usuario?.historico_servicos.map((his) =>{
        return(
            <p>{his}</p>
        )
    })

    return(
        <div className="bg-white h-screen flex">
            <div className="flex-col h-screen border-r border-r-orange-500 p-3">
                <p className="pt-4">Página inicial</p>
                <p className="pt-4">Dados Pessoais</p>
                <p className="pt-4">Histórico</p>
            </div>
            <div className="flex-col">
                <img src={usuario?.picture} />
                <p>{usuario?.nome}</p>
                <p>{usuario?.email}</p>
            </div>
            <p>{usuario?.telefone}</p>
            <p>{historico}</p>
            <button onClick={logout}>Sair</button>
        </div>
    );
}