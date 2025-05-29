import { useEffect, useState } from 'react';
import { HistoricoServico } from '../types/historicoServico';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { URLAPI } from '../constants/ApiUrl';

export const DetalhesServicoConfirmadoScreen = () => {
    const { id } = useParams<{ id: string }>();

    
    
    const [service, setService] = useState<HistoricoServico | null>(null);
    
    const procurarServico = async () => {
        try {
            const response = await axios.get(`${URLAPI}/servicos/${id}`);
            setService(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePagar = async () => {
        try {
            const res = await fetch(`${URLAPI}/pagamento/criar-preferencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: 'Agendamento de Serviço',
                    servicoId: id,
                    quantity: 1,
                    unit_price: /*service?.valor*/  1,
                    payer: {
                        name: service?.fornecedor?.nome || '',
                        email: service?.fornecedor?.email || '',
                        identification: {
                            type: 'CPF',
                            number: /*service?.fornecedor?.cpf*/  '',
                        },
                    },
                    description: service?.descricao || 'Serviço Handyman',
                    external_reference: JSON.stringify({
                        endereco: /*service?.endereco*/  '',
                        data: service?.data || '',
                        hora: service?.horario || '',
                        telefone: /*service?.telefone*/  ''
                    })
                }),
            });

            if (!res.ok) {
                throw new Error('Erro ao processar pagamento');
            }

            const data = await res.json();
            window.location.href = data.init_point;
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
        }
    };

    useEffect(() => {
        procurarServico();
    }, [])

    if (!service) {
        return <div className="text-center py-10">Detalhes do serviço não disponíveis.</div>;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Detalhes do Serviço Confirmado:</h1>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-[#A75C00] mb-4">{service.categoria}:</h2>
                            <div className="space-y-3">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Fornecedor:</span> {service.fornecedor?.nome}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Status:</span> 
                                    <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                        service.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                                        service.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                                        service.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {service.status}
                                    </span>
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Data:</span> {new Date(service.data).toLocaleDateString('pt-BR')}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Horário:</span> {new Date(service.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-[#A75C00] mb-4">Informações do Fornecedor:</h3>
                            <div className="space-y-3">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Email:</span> {service.fornecedor?.email}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Telefone:</span> {service.fornecedor?.telefone}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Categorias:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {service.fornecedor?.categoria_servico.map((cat, index) => (
                                            <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Média de Avaliações:</span> {service.fornecedor?.media_avaliacoes || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-[#A75C00] mb-4">Descrição do Serviço:</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{service.descricao}</p>
                    </div>

                    <button
                        onClick={handlePagar}
                        className="mt-6 bg-[#A75C00] text-white py-2 px-6 rounded-md hover:bg-[#8B4D00] transition-colors w-full md:w-auto"
                    >
                        Ir para Pagamento
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}; 