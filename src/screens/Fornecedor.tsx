import Footer from "../components/Footer";
import Header from "../components/Header"
import { useParams } from "react-router-dom";
import { Pagina_principal } from "../components/fornecedor/pagina_principal";


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