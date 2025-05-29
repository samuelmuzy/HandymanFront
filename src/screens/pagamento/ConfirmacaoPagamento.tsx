import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { URLAPI } from '../../constants/Api';

export const ConfirmacaoPagamento = () => {
    const { idServico } = useParams<{ idServico: string }>();

    const navigate = useNavigate();

    

    const atualizarStatus = async (id_servico: string | undefined, status: string) => {
        try {
            const data = {
                id_servico: id_servico,
                status: status
            }

            const response = await axios.put(`${URLAPI}/servicos`, data);

            console.log(response.data);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    useEffect(()=>{
        atualizarStatus(idServico,'concluido')
    },[])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-5">
            <div className="mb-8">
                <svg 
                    className="w-24 h-24 text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
                Pagamento Aprovado!
            </h1>
            <p className="text-lg text-gray-600 mb-10 text-center">
                O valor foi recebido com sucesso
            </p>

            <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 ease-in-out shadow-md"
                onClick={() => navigate('/servicos')}
            >
                Voltar para Serviços
            </button>
        </div>
    );
};