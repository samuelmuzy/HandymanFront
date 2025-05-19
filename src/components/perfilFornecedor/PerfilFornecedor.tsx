import axios from "axios";
import { useEffect, useState } from "react";

export type typeEndereco = {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
}

export type typeDisponibilidade = {
    data: string;
    horario: string;
    status: 'livre' | 'ocupado';
}

export type typeFornecedor = {
    id_fornecedor?: string;
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    endereco: typeEndereco;
    categoria_servico: string[];
    descricao: string;
    sub_descricao:string;
    imagemPerfil:string;
    imagemIlustrativa:string;
    valor:number;
    disponibilidade: typeDisponibilidade[];
    solicitacoes: string[];
    media_avaliacoes: number;
} 

interface PerfilProps {
    idFornecedor: string | undefined
}

export const PerfilFornecedor = ({idFornecedor}:PerfilProps) =>{
    const URLAPI = import.meta.env.VITE_URLAPI;

    const [mudarPagina, setMudarPagina] = useState(1);

    const [usuario, setUsuario] = useState<typeFornecedor | null>(null)

    const procurarUsuario = async () => {
        try {
            const response = await axios.get(`${URLAPI}/fornecedor/${idFornecedor}`)

            setUsuario(response.data);
        } catch (error: unknown) {
            console.log(error)
        }
    }

    useEffect(() => {
        procurarUsuario();
    }, [])

    const solicitacoes = usuario?.solicitacoes.map((sol) =>{
        return(
            <p>{sol}</p>
        );
    })

    return(
        <>
            <p>Solicitaçoens</p>
            {solicitacoes}
            <p>{usuario?.nome}</p>
        </>
    )
}