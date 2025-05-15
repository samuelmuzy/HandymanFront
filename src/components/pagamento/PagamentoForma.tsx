export const PagamentoForma = () =>{

    const URLAPI = import.meta.env.VITE_URLAPI;

    
    const handlePagar = async () => {
        const res = await fetch(`${URLAPI}/pagamento/criar-preferencia`, { method: 'POST' });
        const data = await res.json();
        window.location.href = data.init_point; // Redireciona para o Checkout Pro
      };
      
    return(
        <div>
            <button onClick={handlePagar}>Pagar</button>
        </div>
    )
}