import { useParams } from "react-router-dom";
import { ExibirAgendamentoFornecedor } from "../components/perfilFornecedor/ExibirAgendamento"


export const ExibirAgenda = () =>{
    const { id } = useParams<{ id: string }>();

 

    return(
        <>
            <ExibirAgendamentoFornecedor idServico={id as string} />
        </>
    )
}