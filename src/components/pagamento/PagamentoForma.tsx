export const PagamentoForma = () => {
    const URLAPI = import.meta.env.VITE_URLAPI;
  
    const handlePagar = async () => {
      const res = await fetch(`${URLAPI}/pagamento/criar-preferencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Camiseta Preta',
          quantity: 1,
          unit_price: 100,
          payer: {
            name: 'João da Silva',
            email: 'joaodasilva-teste@email.com', // TEM QUE ser diferente do vendedor!
            identification: {
              type: 'CPF',
              number: '12345678909',
            },
          },
        }),
      });
  
      const data = await res.json();
  
      if (data?.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro ao gerar link de pagamento!');
        console.error('Erro:', data);
      }
    };
  
    return (
      <div>
        <button onClick={handlePagar}>Pagar</button>
      </div>
    );
  };
  