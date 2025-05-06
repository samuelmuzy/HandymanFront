import axios from "axios";
import { useEffect, useState } from "react";
import { PerfilFornecedor } from "./PerfilFornecedor";
import { Loading } from "../Loading";

interface PropsFornecedor {
    id: string | undefined;
}

interface Fornecedor {
    id_fornecedor: string;
    nome: string;
    media_avaliacoes: string;
    descricao: string;
    sub_descricao: string;
    valor: string;
    imagemPerfil: string;
    imagemIlustrativa: string;
    endereco: enderecoFornecedor;
    imagemServicos: string[];
    categoria_servico: string[];
}

interface enderecoFornecedor {
    cep: string;
    pais: string;
    cidade: string;
    estado: string;
    rua: string;
}


export const Pagina_principal = ({ id }:PropsFornecedor) => {

    const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);
    
    const pesquisarFornecedor = async () => {
        setLoading(true);
        try{
            const response = await axios.get(`http://localhost:3003/fornecedor/${id}`);
            setFornecedor(response.data);
            setLoading(false);
        }catch (error:unknown) {
            console.error('Erro ao buscar fornecedor:', error);
            setError('Erro ao buscar fornecedor');
            setLoading(false);
        }
    }

    useEffect(() => {
        pesquisarFornecedor();
    },[]);

 

    return (
        <>
            {loading && <Loading/>}
            {error && <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>}
            {fornecedor && (
                <PerfilFornecedor
                    local={fornecedor.endereco.cidade}
                    imagemFornecedor={fornecedor.imagemIlustrativa}
                    nome={fornecedor.nome}
                    media_avaliacoes={fornecedor.media_avaliacoes}
                    descricao={fornecedor.descricao}
                    imagemPerfil={fornecedor.imagemPerfil ?? ""}
                    sub_descricao={fornecedor.sub_descricao}
                    valor={fornecedor.valor}
                    imagensServicos={fornecedor.imagemServicos}
                    categoria_servico={fornecedor.categoria_servico}
                />
            )}
        </>
    )
}