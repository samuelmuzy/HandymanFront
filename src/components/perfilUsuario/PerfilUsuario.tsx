import axios from "axios";
import { useEffect, useState } from "react";
import { Pagina_inicial } from "./Pagina_inicial";
import { DadosPessoais } from "./DadosPessoais";
import { HistoricoServico } from "../../types/historicoServico";
import { URLAPI } from "../../constants/ApiUrl";
import { Agenda } from "./Agenda";


interface PerfilProps {
    id: string | undefined
}

export type typeUsuario = {
    id_usuario: string;
    email: string;
    nome: string;
    sub: string;
    picture: string;
    autenticacaoVia: string;
    historico_servicos: string[];
    telefone: string;
}

export const PerfilUsuario = ({ id }: PerfilProps) => {

    const [mudarPagina, setMudarPagina] = useState(1);
    const [itemSelecionado, setItemSelecionado] = useState(1);

    const [usuario, setUsuario] = useState<typeUsuario | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [historicoServico, sethistoricoServico] = useState<HistoricoServico[] | null>(null);

    const procurarUsuario = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${URLAPI}/usuarios/buscar-id/${id}`)

            setUsuario(response.data);
        } catch (error: unknown) {
            console.log(error)
        } finally{
            setIsLoading(false);
        }
    }

    const procurarHistoricoServico = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${URLAPI}/usuarios/historico/${id}`)
            sethistoricoServico(response.data);
        } catch (error: unknown) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        procurarUsuario();
        procurarHistoricoServico();
    }, [])

    const handleItemClick = (pagina: number) => {
        setMudarPagina(pagina);
        setItemSelecionado(pagina);
    };

    return (
        <div className="bg-white min-h-screen flex flex-col md:flex-row font-sans">
            {/* Menu lateral */}
            <div className="md:w-64 md:flex md:flex-col  bg-gray-100 border-r px-6 py-8">
                <h2 className="text-lg font-semibold mb-6">Conta</h2>
                <ul className="md:space-y-4 text-gray-800 md:flex md:flex-col flex md:justify-start md:items-start gap-6 items-center justify-center text-center">
                    <li
                        onClick={() => handleItemClick(1)}
                        className={`cursor-pointer transition-colors  ${itemSelecionado === 1
                                ? 'text-black font-medium'
                                : 'text-gray-600 hover:text-orange-500'
                            }`}
                    >
                        Página inicial
                    </li>
                    <li
                        onClick={() => handleItemClick(3)}
                        className={`cursor-pointer transition-colors  ${itemSelecionado === 3
                                ? 'text-black font-medium'
                                : 'text-gray-600 hover:text-orange-500'
                            }`}
                    >
                        Serviços Agendados
                    </li>
                    <li
                        onClick={() => handleItemClick(2)}
                        className={`cursor-pointer transition-colors  ${itemSelecionado === 2
                                ? 'text-black font-medium'
                                : 'text-gray-600 hover:text-orange-500'
                            }`}
                    >
                        Dados pessoais
                    </li>
                </ul>
            </div>
            {mudarPagina === 1 && (
                <Pagina_inicial historico={historicoServico} setMudarPagina={handleItemClick} usuario={usuario} setHistorico={sethistoricoServico} />
            )}
            {mudarPagina === 2 && (
                <DadosPessoais
                    email={usuario?.email}
                    id_usuario={usuario?.id_usuario}
                    nome={usuario?.nome}
                    telefone={usuario?.telefone}
                    picture={usuario?.picture}
                />
            )}

            {mudarPagina === 3 && (
                <Agenda
                    isLoading={isLoading}
                    historicoServico={historicoServico}
                    setHistorico={sethistoricoServico}
                />
            )}
        </div>
    );

}