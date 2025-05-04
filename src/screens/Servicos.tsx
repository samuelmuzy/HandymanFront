import Footer from "../components/Footer"
import Header from "../components/Header"
import { PaginaPrincipal } from "../components/servicos/PaginaPrincipal"

export const Servicos = () =>{
    return(
        <div className="min-h-screen">
            <Header />
            <PaginaPrincipal/>
            <Footer/>
        </div>
    )
}