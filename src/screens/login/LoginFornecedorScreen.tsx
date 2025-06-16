import { useEffect } from "react";
import { LoginFornecedor } from "../../components/login/LoginFornecedor"

export const LoginFornecedorScreen = () =>{
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token'); // Remove o token do localStorage
        }
    }, []);
    return(
        <>
            <LoginFornecedor/>
        </>
    )
}