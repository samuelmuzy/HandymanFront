import { useEffect } from "react";
import { Login } from "../../components/login/Login";


export const LoginSceen = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token'); // Remove o token do localStorage
        }
    }, []); // Executa apenas uma vez quando o componente é montado
    
    return(
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Login/>
        </div>
    );
}