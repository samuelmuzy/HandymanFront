import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { PagamentoEndereco } from "../../components/agendamento/PagamentoEndereco";
import { Agendamento } from "../../components/agendamento/Agendamento";
import Footer from "../../components/Footer";
import { useState } from "react";


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