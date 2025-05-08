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

    const logout = () =>{
        localStorage.removeItem("token");
        navigate('/');
    }

    const [usuario,setUsuario] = useState<typeUsuario | null>(null)

    const procurarUsuario = async () =>{
        try{
            const response = await axios.get(`http://localhost:3003/usuarios/buscar-id/${id}`)

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
        <div className="bg-white h-screen">
            <div>
                <p>Página inicial</p>
                <p>Dados Pessoais</p>
                <p>Histórico</p>
            </div>
            <div>
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