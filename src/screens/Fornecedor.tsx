import Footer from "../components/Footer";
import { Pagina_principal } from "../components/fornecedor/Pagina_principal";
import Header from "../components/Header"
import { useParams } from "react-router-dom";



export const Fornecedor = () => {
    const { id } = useParams<{ id: string }>();


    return (
        <div className="bg-white">
            <Header/>
            <Pagina_principal id={id}/>
            <Footer/>
        </div>
    );
}