import { useParams } from "react-router-dom";
import { PagamentoEndereco } from "../components/pagamento/PagamentoEndereco";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useGetToken } from "../hooks/useGetToken";
import { useState } from "react";
import { PagamentoForma } from "../components/pagamento/PagamentoForma";

export const PagamentoScreen = () =>{
    const { id } = useParams<{ id: string }>();

    const token = useGetToken();

    const [step,setStep] = useState(1);

    return(
        <div>
            <Header/>
            {step === 1 && <PagamentoEndereco setStep={setStep}/>}
            {step === 2 && <PagamentoForma/>}
            
            <Footer/>
        </div>
    )
}