import { useParams } from "react-router-dom";
import { PagamentoEndereco } from "../components/agendamento/PagamentoEndereco";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { Agendamento } from "../components/agendamento/Agendamento";

export const AgendamentoScreen = () =>{
    const { id } = useParams<{ id: string }>();

    const [step,setStep] = useState(1);

    return(
        <div>
            <Header/>
            {step === 1 && <PagamentoEndereco setStep={setStep}/>}
            {step === 2 && <Agendamento idFornecedor={id as string}/>}
            
            <Footer/>
        </div>
    )
}