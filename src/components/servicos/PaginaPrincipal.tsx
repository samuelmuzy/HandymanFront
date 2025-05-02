import { CardFornecedor } from "./CardFornecedor";
import imagem from '../../assets/trabalhador.png'
import Header from "../Header";
import Footer from "../Footer";


export const PaginaPrincipal = () => {
    return(
        <>
            <Header/>
            <CardFornecedor
                imagemFornecedor={imagem}
                nome="Nome do Fornecedor"
                avaliacao="4.5"
                descricao="Descrição do fornecedor Muito longa e detalhada mais de 20 palavras"
                imagemIcone={imagem}
                subDescricao="Sub descrição do fornecedor"
                valor="R$ 100,00"
            />
            <Footer/>
        </>
    );
}