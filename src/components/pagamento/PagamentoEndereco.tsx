import axios from "axios"
import { PagamentoForma } from "./PagamentoForma"
import { useGetToken } from "../../hooks/useGetToken"
import { useEffect, useState } from "react";
import { Loading } from "../Loading";

interface PagamentoEnderecoProps {
    id:string | undefined
}

interface Indereco{
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
}

export const PagamentoEndereco = ({id}:PagamentoEnderecoProps) =>{
    const [endereco, setEndereco] = useState<Indereco | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const URLAPI = import.meta.env.VITE_URLAPI;
    const token = useGetToken();

    const buscarEndereco = async () => {
        if (!token?.id || hasSearched) return;
        
        try {
            setIsLoading(true);
            const response = await axios.get(`${URLAPI}/usuarios/buscar-id/${token.id}`);
            console.log("Resposta completa da API:", response.data);
            
            // Verifica se a resposta contém os dados de endereço
            if (response.data && response.data.endereco) {
                setEndereco(response.data.endereco);
            } else {
                console.log("Dados de endereço não encontrados na resposta");
                setEndereco(null);
            }
        } catch (error) {
            console.log("Erro ao buscar endereço:", error);
            setEndereco(null);
        } finally {
            setIsLoading(false);
            setHasSearched(true);
        }
    };

    useEffect(() => {
        if (token?.id && !hasSearched) {
            buscarEndereco();
        }
    }, [token, hasSearched]);

    if (isLoading) {
        return <Loading/>;
    }

    return(
        <div>
            <h2>Fale seu endereço para o serviço</h2>

            <div>
                {endereco ? (
                    <>
                        <p>Rua</p>
                        {endereco.rua}
                        <p>cep</p>
                        {endereco.cep}
                        <p>Nome cidade</p>
                        {endereco.cidade}
                        <button>Alter localização</button>
                    </>
                ) : (
                    <div>
                        <p>Nenhum endereço encontrado</p>
                        <button>Adicionar endereço</button>
                    </div>
                )}
            </div>
            <button>Continuar</button>
            <PagamentoForma/>
        </div>
    )
}