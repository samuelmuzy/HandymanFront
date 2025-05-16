import { useParams } from "react-router-dom";
import { PagamentoEndereco } from "../components/pagamento/PagamentoEndereco";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useGetToken } from "../hooks/useGetToken";

export const PagamentoScreen = () =>{
    const { id } = useParams<{ id: string }>();

    const token = useGetToken();
    return(
        <>
            <Header/>
            <PagamentoEndereco id={token?.id}/>
            <Footer/>
        </>
    )
}