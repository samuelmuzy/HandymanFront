import { useParams } from "react-router-dom";
import { PagamentoEndereco } from "../components/pagamento/PagamentoEndereco";

export const PagamentoScreen = () =>{
    const { id } = useParams<{ id: string }>();
    return(
        <>
            <p>{id}</p>
            <PagamentoEndereco/>
        </>
    )
}