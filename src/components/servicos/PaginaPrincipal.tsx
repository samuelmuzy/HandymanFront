import { CardFornecedor } from "./CardFornecedor";
import imagem from '../../assets/trabalhador.png'
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Loading } from "../Loading";
import imagemCategoriaMudanca from '../../assets/moving-truck_6832074 1 (1).png';
import imagemCategoriaCarpintaria from '../../assets/carpentry_939584 1.png';
import imagemCategoriaEletrica from '../../assets/operator_17972847 1.png';
import imagemCategoriaLimpeza from '../../assets/cleaning_995053 1.png';
import imagemCategoriaEncanador from '../../assets/pipe_4003199 1.png';
import imagemCategoriaJardinagem from '../../assets/trimming_10144805 1.png';
import { URLAPI } from "../../constants/ApiUrl";

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
        categoria: string;
    }

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState<Fornecedor[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 8;

    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>("Controle");

    const mudarCategorias = (categoria: string) => {
        setCategoriaSelecionada(categoria);
        setPaginaAtual(1); // Resetar página ao mudar categoria
    };

    const buscarFornecedores = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${URLAPI}/fornecedor/categorias/${categoriaSelecionada}`);

            setFornecedoresFiltrados(response.data);
            setError(null);
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
            setError('Erro ao buscar fornecedores');

            setFornecedoresFiltrados([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePesquisa = async () => {
        if (!termoPesquisa.trim()) {
            await buscarFornecedores();
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${URLAPI}/fornecedor/categorias/${categoriaSelecionada}/busca`, {
                params: { termo: termoPesquisa }
            });
            setFornecedoresFiltrados(response.data);
            setError('');
            setPaginaAtual(1); // Resetar página ao fazer nova pesquisa
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
            setError('Erro ao buscar fornecedores');
            setFornecedoresFiltrados([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarFornecedores();
    }, [categoriaSelecionada]);

    // Lógica de paginação
    const totalPaginas = Math.ceil(fornecedoresFiltrados.length / itensPorPagina);
    const fornecedoresPaginados = useMemo(() => {
        return fornecedoresFiltrados.slice(
            (paginaAtual - 1) * itensPorPagina,
            paginaAtual * itensPorPagina
        );
    }, [fornecedoresFiltrados, paginaAtual]);

    const listarFornecedores = fornecedoresPaginados.map((fornecedor) => (
        <CardFornecedor
            id={fornecedor.id_fornecedor}
            key={fornecedor.id_fornecedor}
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
                            value={termoPesquisa}
                            onChange={(e) => setTermoPesquisa(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handlePesquisa();
                                }
                            }}
                        />
                        <button
                            className="bg-[#AD5700] p-3 rounded-full hover:bg-orange-800 transition"
                            onClick={handlePesquisa}
                        >
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
                            {/* Mudança */}
                            <div
                                className={`flex items-center flex-col cursor-pointer transition-all duration-300 ${categoriaSelecionada === "Mudança" ? "-translate-y-2 scale-105 text-orange-700" : ""
                                    }`}
                                onClick={() => mudarCategorias("Mudança")}
                            >
                                <img className="w-16 h-16" src={imagemCategoriaMudanca} alt="imagem caminhão" />
                                <p
                                    className={`mt-2 ${categoriaSelecionada === "Mudança" ? "border-b-2 border-orange-700 font-semibold" : ""
                                        }`}
                                >
                                    Mudança Residencial
                                </p>
                            </div>

                            {/* Carpintaria */}
                            <div
                                className={`flex items-center flex-col cursor-pointer transition-all duration-300 ${categoriaSelecionada === "Carpintaria" ? "-translate-y-2 scale-105 text-orange-700" : ""
                                    }`}
                                onClick={() => mudarCategorias("Carpintaria")}
                            >
                                <img className="w-16 h-16" src={imagemCategoriaCarpintaria} alt="imagem carpintaria" />
                                <p
                                    className={`mt-2 ${categoriaSelecionada === "Carpintaria" ? "border-b-2 border-orange-700 font-semibold" : ""
                                        }`}
                                >
                                    Serviços de Carpintaria
                                </p>
                            </div>

                            {/* Elétrica */}
                            <div
                                className={`flex items-center flex-col cursor-pointer transition-all duration-300 ${categoriaSelecionada === "Elétricista" ? "-translate-y-2 scale-105 text-orange-700" : ""
                                    }`}
                                onClick={() => mudarCategorias("Elétricista")}
                            >
                                <img className="w-16 h-16" src={imagemCategoriaEletrica} alt="imagem eletricista" />
                                <p
                                    className={`mt-2 ${categoriaSelecionada === "Elétricista" ? "border-b-2 border-orange-700 font-semibold" : ""
                                        }`}
                                >
                                    Instalações Elétricas
                                </p>
                            </div>
                        </div>

                        {/* Linha de baixo */}
                        <div className="flex justify-center pr-6 gap-8">
                            {/* Limpeza */}
                            <div
                                className={`flex items-center flex-col cursor-pointer transition-all duration-300 ${categoriaSelecionada === "Limpeza" ? "-translate-y-2 scale-105 text-orange-700" : ""
                                    }`}
                                onClick={() => mudarCategorias("Limpeza")}
                            >
                                <img className="w-16 h-16" src={imagemCategoriaLimpeza} alt="imagem limpeza" />
                                <p
                                    className={`mt-2 ${categoriaSelecionada === "Limpeza" ? "border-b-2 border-orange-700 font-semibold" : ""
                                        }`}
                                >
                                    Limpeza Residencial
                                </p>
                            </div>

                            {/* Jardinagem */}
                            <div
                                className={`flex items-center flex-col cursor-pointer transition-all duration-300 ${categoriaSelecionada === "Jardinagem" ? "-translate-y-2 scale-105 text-orange-700" : ""
                                    }`}
                                onClick={() => mudarCategorias("Jardinagem")}
                            >
                                <img className="w-16 h-16" src={imagemCategoriaJardinagem} alt="imagem jardinagem" />
                                <p
                                    className={`mt-2 ${categoriaSelecionada === "Jardinagem" ? "border-b-2 border-orange-700 font-semibold" : ""
                                        }`}
                                >
                                    Serviços de Jardinagem
                                </p>
                            </div>

                            {/* Encanamento */}
                            <div
                                className={`flex items-center flex-col cursor-pointer transition-all duration-300 ${categoriaSelecionada === "Encanamento" ? "-translate-y-2 scale-105 text-orange-700" : ""
                                    }`}
                                onClick={() => mudarCategorias("Encanamento")}
                            >
                                <img className="w-16 h-16" src={imagemCategoriaEncanador} alt="imagem encanador" />
                                <p
                                    className={`mt-2 ${categoriaSelecionada === "Encanamento" ? "border-b-2 border-orange-700 font-semibold" : ""
                                        }`}
                                >
                                    Serviços de Encanamento
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 ml-10 mb-5">
                        <button className="bg-white text-[#AD5700] border-[#A75C00] px-4 py-2 rounded hover:bg-[#AD5700] hover:text-white transition duration-300 w-56 " >
                            Serviços de Montagem
                        </button>
                        <button className="bg-white text-[#AD5700] border-[#A75C00] px-4 py-2 rounded hover:bg-[#AD5700] hover:text-white transition duration-300 w-56" >
                            Pintura Residencial
                        </button>
                        <button className="bg-white text-[#AD5700] border-[#A75C00] px-4 py-2 rounded hover:bg-[#AD5700] hover:text-white transition duration-300 w-56" >
                            Manutenção Geral
                        </button>
                        <button className="bg-white text-[#AD5700] border-[#A75C00] px-4 py-2 rounded hover:bg-[#AD5700] hover:text-white transition duration-300 w-56" >
                            Reformas e Reparos
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap justify-start max-w-8xl mx-auto gap-4">
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {listarFornecedores}
                </div>

                {/* Controles de Paginação */}
                {totalPaginas > 1 && (
                    <div className="mt-8 flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                            disabled={paginaAtual === 1}
                            className={`px-4 py-2 rounded-md ${paginaAtual === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#AC5906] text-white hover:bg-[#8B4705]'
                                }`}
                        >
                            Anterior
                        </button>

                        <div className="flex items-center justify-center text-center space-x-2">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                                <button
                                    key={pagina}
                                    onClick={() => setPaginaAtual(pagina)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md ${paginaAtual === pagina
                                        ? 'bg-[#AC5906] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {pagina}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                            disabled={paginaAtual === totalPaginas}
                            className={`px-4 py-2 rounded-md ${paginaAtual === totalPaginas
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#AC5906] text-white hover:bg-[#8B4705]'
                                }`}
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}