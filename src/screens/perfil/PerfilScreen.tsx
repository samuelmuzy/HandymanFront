import { useParams } from "react-router-dom";
import { PerfilUsuario } from "../../components/perfilUsuario/PerfilUsuario";
import { useGetToken } from "../../hooks/useGetToken";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { PerfilFornecedor } from "../../components/perfilFornecedor/PerfilFornecedor";


export const PerfilScreen = () =>{
    const { idPerfil } = useParams<{ idPerfil: string }>();

    const token = useGetToken();
    
    return(
        <div className="">
            <Header/>
            {token?.role === 'Fornecedor' ? (<PerfilFornecedor idFornecedor={idPerfil}/>) : (<PerfilUsuario id={idPerfil}/>)}
            <Footer/>
        </div>
    )
}