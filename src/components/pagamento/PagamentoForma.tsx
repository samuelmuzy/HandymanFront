import { useState } from 'react';

export const PagamentoForma = () => {
    const URLAPI = import.meta.env.VITE_URLAPI;
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        data: '',
        hora: '',
        descricao: '',
        valor: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePagar = async () => {
        try {
            const res = await fetch(`${URLAPI}/pagamento/criar-preferencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Agendamento de Serviço',
                    quantity: 1,
                    unit_price: Number(formData.valor),
                    payer: {
                        name: formData.nome,
                        email: formData.email,
                        identification: {
                            type: 'CPF',
                            number: '12345678909', // Você pode adicionar um campo para CPF se necessário
                        },
                    },
                    description: formData.descricao,
                    external_reference: JSON.stringify({
                        endereco: formData.endereco,
                        data: formData.data,
                        hora: formData.hora,
                        telefone: formData.telefone
                    })
                }),
            });

            const data = await res.json();

            if (data?.init_point) {
                window.location.href = data.init_point;
            } else {
                alert('Erro ao gerar link de pagamento!');
                console.error('Erro:', data);
            }
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Agendamento de Serviço</h2>
            
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data</label>
                        <input
                            type="date"
                            name="data"
                            value={formData.data}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hora</label>
                        <input
                            type="time"
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição do Serviço</label>
                    <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Valor do Serviço (R$)</label>
                    <input
                        type="number"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="button"
                    onClick={handlePagar}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Agendar e Pagar
                </button>
            </form>
        </div>
    );
};
  