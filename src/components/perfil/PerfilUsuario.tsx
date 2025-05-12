import axios from "axios";
import { useEffect, useState } from "react";
import { Pagina_inicial } from "./Pagina_inicial";

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
    

    const URLAPI = import.meta.env.VITE_URLAPI;

    const mudarPagina = useState(1);

    const [usuario, setUsuario] = useState<typeUsuario | null>(null)

    const procurarUsuario = async () => {
        try {
            const response = await axios.get(`${URLAPI}/usuarios/buscar-id/${id}`)

            setUsuario(response.data);
        } catch (error: unknown) {
            console.log(error)
        }
    }

    useEffect(() => {
        procurarUsuario();
    }, [])


    return (
        <div className="bg-white min-h-screen flex font-sans">
            {/* Menu lateral */}
            <div className="w-64 bg-gray-100 border-r px-6 py-8">
                <h2 className="text-lg font-semibold mb-6">Conta</h2>
                <ul className="space-y-4 text-gray-800">
                    <li className="font-medium text-black">Página inicial</li>
                    <li className="hover:text-orange-500 cursor-pointer">Dados pessoais</li>
                    <li className="hover:text-orange-500 cursor-pointer">Segurança</li>
                    <li className="hover:text-orange-500 cursor-pointer">Privacidade e dados</li>
                </ul>
            </div>

            <Pagina_inicial usuario={usuario}/>
        </div>
    );

}