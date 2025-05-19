import axios from "axios"
import { useGetToken } from "../../hooks/useGetToken"
import { useEffect, useState } from "react";
import { Loading } from "../Loading";
import { ModalEndereco } from "./ModalEndereco";
import { useForm } from "../../hooks/useForm";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import { Dispatch, SetStateAction } from "react";

interface PagamentoEnderecoProps {
    setStep:Dispatch<SetStateAction<number>>
}

interface Indereco {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
}


export const PagamentoEndereco = ({ setStep }: PagamentoEnderecoProps) => {

    const [endereco, setEndereco] = useState<Indereco | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);

    const [form, onChange, resetForm, setForm] = useForm({
        cep: "",
        cidade: "",
        estado: "",
        rua: "",
    });

    const [isOpen, setIsOpen] = useState(false);

    const URLAPI = import.meta.env.VITE_URLAPI;
    const token = useGetToken();

    const tokenVerify = localStorage.getItem("token")

    const atualizaEndereco = async () => {
        try {
            setIsLoading(true)
            const body = {
                endereco: {
                    rua: form.rua,
                    cidade: form.cidade,
                    estado: form.estado,
                    cep: form.cep
                }
            }
            const response = await axios.put(`${URLAPI}/usuarios/users/${token?.id}`, body, {
                headers: {
                    "Authorization": tokenVerify
                }
            });

            // Atualiza o estado do endereço com os novos dados
            setEndereco(response.data.endereco);
            setIsOpen(false);
        } catch (error) {
            console.log("Erro ao atualizar endereço:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const buscarEndereco = async () => {
        if (!token?.id || hasSearched) return;

        try {
            setIsLoading(true);
            const response = await axios.get(`${URLAPI}/usuarios/buscar-id/${token.id}`);
            console.log("Resposta completa da API:", response.data);

            // Verifica se a resposta contém os dados de endereço
            if (response.data && response.data.endereco) {
                setEndereco(response.data.endereco);
            } else {
                console.log("Dados de endereço não encontrados na resposta");
                setEndereco(null);
            }
        } catch (error) {
            console.log("Erro ao buscar endereço:", error);
            setEndereco(null);
        } finally {
            setIsLoading(false);
            setHasSearched(true);
        }
    };

    useEffect(() => {
        if (token?.id && !hasSearched) {
            buscarEndereco();
        }
    }, [token, hasSearched]);

    const handleOpenModal = () => {
        if (endereco) {
            setForm({
                cep: endereco.cep || "",
                cidade: endereco.cidade || "",
                estado: endereco.estado || "",
                rua: endereco.rua || "",
            });
        }
        setIsOpen(true);
    };

    const handleAddEndereco = () => {
        resetForm()
        setForm({
            cep: "",
            cidade: "",
            estado: "",
            rua: "",
        });
        setIsOpen(true);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="max-w-lg w-full mx-auto bg-white rounded-xl shadow-md p-6 mb-8 border border-orange-100 transition-transform hover:scale-102">
                <h2 className="text-lg font-bold text-orange-400 mb-4">Endereço para o serviço</h2>
                {endereco ? (
                    <>
                        <div className="mb-3 flex items-center gap-2">
                            <LocationOnIcon style={{ color: '#FDBA74', fontSize: 24 }} />
                            <span className="font-medium text-base text-gray-700">Rua: {endereco.rua}</span>
                        </div>
                        <div className="mb-1 text-gray-500 flex items-center gap-1">
                            <LocationCityIcon style={{ color: '#FDBA74', fontSize: 18 }} />
                            <span className="font-medium text-base text-gray-700">Cidade: {endereco.cidade}</span>
                        </div>
                        <div className="mb-1 text-gray-500 flex items-center gap-1">
                            <LocationCityIcon style={{ color: '#FDBA74', fontSize: 18 }} />
                            <span className="font-medium text-base text-gray-700">Estado: {endereco.estado}</span>
                        </div>
                        <div className="mb-3 text-gray-500 flex items-center gap-1">
                            <MarkunreadMailboxIcon style={{ color: '#FDBA74', fontSize: 18 }} />
                            <span className="font-medium text-base text-gray-700">CEP: {endereco.cep}</span>
                        </div>
                        <hr className="my-3 border-orange-100" />
                        <button
                            onClick={handleOpenModal}
                            className="w-full px-4 py-2 bg-orange-200 text-orange-900 rounded-lg font-medium hover:bg-orange-300 transition"
                        >
                            Alterar localização
                        </button>
                    </>
                ) : (
                    <div>
                        <p className="text-gray-400 mb-3">Nenhum endereço encontrado</p>
                        <button
                            onClick={handleAddEndereco}
                            className="w-full px-4 py-2 bg-orange-300 text-orange-900 rounded-lg font-medium hover:bg-orange-300 transition"
                        >
                            Adicionar endereço
                        </button>
                    </div>
                )}
                <button onClick={() => setStep(2)} className="w-full mt-6 py-3 bg-green-300 text-green-800 rounded-lg font-bold hover:bg-green-400 transition">
                    Continuar
                </button>
            </div>

            <ModalEndereco isOpen={isOpen} onClose={() => setIsOpen(false)} >
                {/* Endereço */}

                <h3 className="text-orange-400 text-lg font-semibold mb-2">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* CEP */}
                    <div className="space-y-1">
                        <label htmlFor="cep" className="text-xs text-orange-400">CEP</label>
                        <input
                            id="cep"
                            type="text"
                            name="cep"
                            value={form.cep}
                            onChange={onChange}
                            className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                            required
                        />
                    </div>

                    {/* Estado */}
                    <div className="space-y-1">
                        <label htmlFor="estado" className="text-xs text-orange-400">Estado</label>
                        <input
                            id="estado"
                            type="text"
                            name="estado"
                            value={form.estado}
                            onChange={onChange}
                            className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                            required
                        />
                    </div>

                    {/* Cidade */}
                    <div className="col-span-2 space-y-1">
                        <label htmlFor="cidade" className="text-xs text-orange-400">Cidade</label>
                        <input
                            id="cidade"
                            type="text"
                            name="cidade"
                            value={form.cidade}
                            onChange={onChange}
                            className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                            required
                        />
                    </div>

                    {/* Rua (pode ocupar as 2 colunas) */}
                    <div className="col-span-2 space-y-1">
                        <label htmlFor="rua" className="text-xs text-orange-400">Rua</label>
                        <input
                            id="rua"
                            type="text"
                            name="rua"
                            value={form.rua}
                            onChange={onChange}
                            className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                            required
                        />
                    </div>
                    <button onClick={() => setIsOpen(false)} className=" text-white bg-red-500">Sair</button>
                    <button onClick={atualizaEndereco} className=" text-white bg-green-500">Confirmar</button>
                </div>

            </ModalEndereco>

           
        </div>
    )
}