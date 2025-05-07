import { CardFornecedor } from "./CardFornecedor";
import imagem from '../../assets/trabalhador.png'
import axios from "axios";
import { useEffect, useState } from "react";
import { Loading } from "../Loading";
import imagemCategoriaMudanca from '../../assets/moving-truck_6832074 1 (1).png';
import imagemCategoriaCarpintaria from '../../assets/carpentry_939584 1.png';
import imagemCategoriaEletrica from '../../assets/operator_17972847 1.png';
import imagemCategoriaLimpeza from '../../assets/cleaning_995053 1.png';
import imagemCategoriaEncanador from '../../assets/pipe_4003199 1.png';
import imagemCategoriaJardinagem from '../../assets/trimming_10144805 1.png';

export const PaginaPrincipal = () => {
    interface Fornecedor {
        id_fornecedor: string;
        nome: string;
        media_avaliacoes: string;
        descricao: string;
        sub_descricao: string;
        valor: string;
        imagemPerfil: string;
        imagemIlustrativa: string;
    }

    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [categorias, setCategorias] = useState<string>("Serviço 1");

    const mudarCategorias = (categoria: string) => {
        setCategorias(categoria);
    }

    const buscarFornecedores = async () => {
        setLoading(true);
        axios.get(`http://localhost:3003/fornecedor/categorias/${categorias}`)
            .then((response) => {
                setFornecedores(response.data);
                setError(null); // Limpa o erro se a requisição for bem-sucedida
            })
            .catch((error) => {
                console.error('Erro ao buscar fornecedores:', error)
                setError('Erro ao buscar fornecedores')
                setFornecedores([])
            })
            .finally(() => {
                setLoading(false);
            });
    }



    useEffect(() => {
        buscarFornecedores();
    }, [categorias]);

    const listarFornecedores = fornecedores.map((fornecedor) => (
        <CardFornecedor
            id={fornecedor.id_fornecedor}
            key={fornecedor.id_fornecedor} // ideal incluir uma key
            imagemFornecedor={fornecedor.imagemIlustrativa || imagem}
            nome={fornecedor.nome}
            avaliacao={fornecedor.media_avaliacoes}
            descricao={fornecedor.descricao}
            imagemIcone={fornecedor.imagemPerfil || imagem}
            subDescricao={fornecedor.sub_descricao}
            valor={fornecedor.valor}
        />
    ));

    return (
        <>

            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
                {loading && <Loading />}
                <div className="flex flex-col items-center justify-center mt-6 mb-6 gap-9">
                    <h1 className="w-13 text-center text-[#A75C00] mt-9">Não faça você mesmo,<br></br> encontre um profissional</h1>
                    <div className="flex items-center border-2 border-[#A75C00] rounded-full w-full max-w-md mt-4 overflow-hidden">
                        <input
                            type="text"
                            placeholder="O que procura?"
                            className="px-4 py-3 w-full focus:outline-none"
                        />
                        <button className="bg-orange-700 p-3 rounded-full hover:bg-orange-800 transition">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center mt-6 mb-6">

                    <div className="flex flex-col items-center gap-8 mb-6">
                        {/* Linha de cima */}
                        <div className="flex justify-center pr-6 gap-8">
                            <div className="flex items-center flex-col cursor-pointer" onClick={() => mudarCategorias("Mudança")}>
                                <img className="w-16 h-16" src={imagemCategoriaMudanca} alt="imagem caminhão" />
                                <p>Mudança</p>
                            </div>
                            <div className="flex items-center flex-col cursor-pointer" onClick={() => mudarCategorias("Carpintaria")}>
                                <img className="w-16 h-16" src={imagemCategoriaCarpintaria} alt="imagem carpintaria" />
                                <p>Carpintaria</p>
                            </div>
                            <div className="flex items-center flex-col cursor-pointer" onClick={() => mudarCategorias("Elétricista")}>
                                <img className="w-16 h-16" src={imagemCategoriaEletrica} alt="imagem eletricista" />
                                <p>Elétrica</p>
                            </div>
                        </div>

                        {/* Linha de baixo */}
                        <div className="flex justify-center pr-6 gap-8">
                            <div className="flex items-center flex-col cursor-pointer" onClick={() => mudarCategorias("Limpeza")}>
                                <img className="w-16 h-16" src={imagemCategoriaLimpeza} alt="imagem limpeza" />
                                <p>Limpeza</p>
                            </div>
                            <div className="flex items-center flex-col cursor-pointer" onClick={() => mudarCategorias("Jardinagem")}>
                                <img className="w-16 h-16" src={imagemCategoriaJardinagem} alt="imagem jardinagem" />
                                <p>Jardinagem</p>
                            </div>
                            <div className="flex items-center flex-col cursor-pointer" onClick={() => mudarCategorias("Encanamento")}>
                                <img className="w-16 h-16" src={imagemCategoriaEncanador} alt="imagem encanador" />
                                <p>Encanamento</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 ml-10 mb-5">
                        <button className="bg-white text-orange-400 border-[#A75C00] px-4 py-2 rounded hover:bg-orange-600 transition duration-300 w-56" >
                            Texto name
                        </button>
                        <button className="bg-white text-orange-400 border-[#A75C00] px-4 py-2 rounded hover:bg-orange-600 transition duration-300 w-56" >
                            Texto name
                        </button>
                        <button className="bg-white text-orange-400 border-[#A75C00] px-4 py-2 rounded hover:bg-orange-600 transition duration-300 w-56" >
                            Texto name
                        </button>
                        <button className="bg-white text-orange-400 border-[#A75C00] px-4 py-2 rounded hover:bg-orange-600 transition duration-300 w-56" >
                            Texto name
                        </button>
                    </div>

                </div>

                <div className="flex flex-wrap justify-start max-w-8xl mx-auto gap-4">

                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {listarFornecedores}

                </div>
            </div>

        </>
    );
}
