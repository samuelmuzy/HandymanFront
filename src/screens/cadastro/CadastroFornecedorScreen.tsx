import { useEffect } from "react";
import { CadastroFornecedor } from "../../components/cadastro/CadastroFornecedor"

export const CadastroFornecedorScreen = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token'); // Remove o token do localStorage
        }
    }, []);
    return(
        <div className="min-h-screen flex items-center justify-center bg-background">
            <CadastroFornecedor/>
        </div>
    )
}