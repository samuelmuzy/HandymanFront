import { CardFornecedor } from "./CardFornecedor";
import imagem from '../../assets/trabalhador.png'
import axios from "axios";
import { useEffect, useState } from "react";
import { Loading } from "../Loading";

export const PaginaPrincipal = () => {
    interface Fornecedor {
        id_fornecedor: number;
        nome: string;
        media_avaliacoes: string;
        descricao: string;
        sub_descricao: string;
        valor: string;
        imagemPerfil: string;
        imagemIlustrativa: string;
    }
    
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        axios.get('http://localhost:3003/fornecedor')
            .then((response) => {
                setFornecedores(response.data);
            })
            .catch((error) =>{ 
                console.error('Erro ao buscar fornecedores:', error)
                setError('Erro ao buscar fornecedores')
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const listarFornecedores = fornecedores.map((fornecedor) => (
        <CardFornecedor
            key={fornecedor.id_fornecedor} // ideal incluir uma key
            imagemFornecedor={fornecedor.imagemIlustrativa || imagem}
            nome={fornecedor.nome}
            avaliacao={fornecedor.media_avaliacoes}
            descricao={fornecedor.descricao}
            imagemIcone={fornecedor.imagemPerfil || imagem}
            subDescricao={fornecedor.sub_descricao}
            valor={fornecedor.valor}
        />
    ));

    return (
        <>
            
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
                {loading && <Loading/>}
                
                <div className="flex flex-wrap justify-start max-w-8xl mx-auto gap-4">

                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {listarFornecedores}

                </div>
            </div>
            
        </>
    );
}
