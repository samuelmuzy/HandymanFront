import { useParams } from "react-router-dom";
import { PerfilUsuario } from "../components/perfil/PerfilUsuario";
import { useGetToken } from "../hooks/useGetToken";
import Header from "../components/Header";
import Footer from "../components/Footer";


export const PerfilUsuarioScreen = () =>{
    const { idPerfil } = useParams<{ idPerfil: string }>();

     const [id,nome,email,imagemPerfil, role ] = useGetToken();
    
    return(
        <div className="">
            <Header/>
            {role === 'Fornecedor' ? (<><p>ola</p></>) : (<PerfilUsuario id={idPerfil}/>)}
            <Footer/>
        </div>
    )
}