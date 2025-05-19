import { useState } from 'react';

export const MetodoPagamento = () => {
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
    <div className='flex items-center justify-center w-full min-h-screen bg-white'>
      <div className="w-[600px] mx-auto p-8 border border-[#A75C00]/20 rounded-lg">
        <h2 className="text-2xl font-medium mb-8 text-center text-[#A75C00]">Agendamento de Serviço</h2>
        
        <form className="space-y-5">
         

          <div>
            <label className="block text-sm text-[#A75C00] mb-1">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#A75C00] mb-1">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#A75C00] mb-1">Data</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#A75C00] mb-1">Hora</label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#A75C00] mb-1">Descrição do Serviço</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00] resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#A75C00] mb-1">Valor do Serviço (R$)</label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              className="w-full p-2 border border-[#A75C00]/20 rounded-md focus:outline-none focus:border-[#A75C00]"
              required
            />
          </div>

          <button
            type="button"
            onClick={handlePagar}
            className="w-full bg-[#A75C00] text-white py-2.5 mt-8 rounded-md hover:bg-[#8B4D00] transition-colors"
          >
            Agendar
          </button>
        </form>
      </div>
    </div>
  );
};
