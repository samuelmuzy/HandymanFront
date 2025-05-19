import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../Loading';
import { Input } from '../Inputs/Input';

interface Fornecedor {
    nome: string;
    telefone: string;
    email: string;
    senha: string;
    categoria_servico: string[];
    endereco: enderecoFornecedor;
    descricao: string;
    valor: number;
    sub_descricao: string;
}

interface enderecoFornecedor {
    cep: string;
    pais: string;
    cidade: string;
    estado: string;
    rua: string;
}

export const CadastroFornecedor = () => {
    const [valorFormatado, setValorFormatado] = useState("");

    const formatarValor = (valor: string) => {
        // Remove tudo que não é número
        const apenasNumeros = valor.replace(/\D/g, '');
        
        // Converte para número e divide por 100 para ter os centavos
        const valorNumerico = Number(apenasNumeros) / 100;
        
        // Formata o valor com 2 casas decimais
        return valorNumerico.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorFormatado = formatarValor(e.target.value);
        setValorFormatado(valorFormatado);
    };

    const [form, setForm] = useState({
        nome: "",
        telefone: "",
        email: "",
        senha: "",
        cep: "",
        pais: "",
        cidade: "",
        estado: "",
        rua: "",
        descricao: "",
        subDescricao: "",
        categoria_servico: [] as string[],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const URLAPI = import.meta.env.VITE_URLAPI;

    const onNavigateCadastroUsuario = () =>{navigate('/cadastro')};
    const onNavigateloginUsuario = () => {navigate('/login')};

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const requisicao: Fornecedor = {
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        senha: form.senha,
        categoria_servico: form.categoria_servico,
        descricao: form.descricao,
        valor: Number(valorFormatado.replace(/\./g, '').replace(',', '.')),
        sub_descricao: form.subDescricao,
        endereco: {
            cep: form.cep,
            pais: form.pais,
            cidade: form.cidade,
            estado: form.estado,
            rua: form.rua,
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(valorFormatado)

        if (step === 3) {
            setIsLoading(true);
            axios.post(`${URLAPI}/fornecedor`, requisicao)
                .then((response) => {
                    navigate('/')
                    localStorage.setItem("token", response.data)
                })
                .catch((err) => {
                    setError(err.response?.data?.error || "Erro ao cadastrar");
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        } else if (step === 1) {
            setIsLoading(true);
            axios.get(`${URLAPI}/fornecedor/verificar-email/fornecedor?query=${form.email}`)
                .then(() => {
                    setError("");
                    setStep(2);
                })
                .catch((err) => {
                    setError(err.response?.data?.error || "Erro ao verificar email");
                })
                .finally(() => setIsLoading(false));
        } else {
            setStep(3);
        }
    };

    return (
        <div className="w-full max-w-[450px] mx-auto my-8 shadow-lg p-6 rounded-md">
            {isLoading && <Loading />}

            <div className="text-left mb-4 px-2">
                <h1 className="text-xl font-bold text-text-brown">HANDYMAN</h1>
                <h2 className="text-lg font-semibold text-text-brown mt-6">Trabalhe Conosco</h2>
                <p className="text-sm text-text-brown mt-2">
                    Faça parte da HANDYMAN e leve suas habilidades a mais pessoas!
                </p>
            </div>

            <div className="bg-[#EEB16C] rounded-lg p-3">
                <form onSubmit={handleSubmit} className="space-y-4">

                    {step === 1 && (
                        <>
                            <h3 className="text-white text-lg font-semibold mb-2">Informações do Usuário</h3>
                            <Input label="Nome Completo" id="nome" value={form.nome} onChange={onChange} />
                            <Input label="Telefone" id="telefone" value={form.telefone} onChange={onChange} />
                            <Input label="Email" id="email" value={form.email} onChange={onChange} type="email" />

                            {/* Senha */}
                            <div className="space-y-1">
                                <label htmlFor="senha" className="text-xs text-white">Senha</label>
                                <div className="relative">
                                    <input
                                        id="senha"
                                        type={showPassword ? "text" : "password"}
                                        name="senha"
                                        value={form.senha}
                                        onChange={onChange}
                                        className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-[#AD5700]/50 p-1 rounded-md"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Senha */}
                            <div className="space-y-1">
                                <label htmlFor="confirmarSenha" className="text-xs text-white">Confirmar Senha</label>
                                <div className="relative">
                                    <input
                                        id="confirmarSenha"
                                        type={showPassword ? "text" : "password"}
                                        name="senha"
                                        value={form.senha}
                                        onChange={onChange}
                                        className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-[#AD5700]/50 p-1 rounded-md"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 className="text-white text-lg font-semibold mb-2">Endereço</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="CEP" id="cep" value={form.cep} onChange={onChange} />
                                <Input label="País" id="pais" value={form.pais} onChange={onChange} />
                                <Input label="Estado" id="estado" value={form.estado} onChange={onChange} />
                                <Input label="Cidade" id="cidade" value={form.cidade} onChange={onChange} />
                                <div className="col-span-2">
                                    <Input label="Rua" id="rua" value={form.rua} onChange={onChange} />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h3 className="text-white text-lg font-semibold mb-2">Categoria de Serviço</h3>
                            <div className="flex flex-col gap-2 text-white">
                                {["Encanamento", "Jardinagem", "Limpeza", "Elétrica", "Carpintaria", "Mudança"].map((categoria) => (
                                    <label key={categoria} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={categoria}
                                            checked={form.categoria_servico.includes(categoria)}
                                            onChange={(e) => {
                                                const { checked, value } = e.target;
                                                setForm(prev => ({
                                                    ...prev,
                                                    categoria_servico: checked
                                                        ? [...prev.categoria_servico, value]
                                                        : prev.categoria_servico.filter(c => c !== value),
                                                }));
                                            }}
                                        />
                                        {categoria}
                                    </label>
                                ))}
                            </div>
                            <h3 className="text-white text-lg font-semibold mb-2">Descrição do serviço</h3>
                            <Input label="Descrição" id="descricao" value={form.descricao} onChange={onChange} />
                            <Input label='subDescrição' id='subDescricao' value={form.subDescricao} onChange={onChange} />
                            <div>
                                <label className="block text-sm text-white mb-1">Valor do Serviço (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">R$</span>
                                    <input
                                        type="text"
                                        value={valorFormatado}
                                        onChange={handleValorChange}
                                        className="w-full p-2 pl-8 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                                        placeholder="0,00"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full p-2 bg-[#AD5700] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                        {step !== 3 ? "Continuar" : "Cadastrar-se"}
                    </button>

                    {step > 1 && (
                        <p className="cursor-pointer text-white text-center" onClick={() => setStep(step - 1)}>Voltar</p>
                    )}

                    {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                </form>

                <p className="text-center text-xs text-white mt-4">
                    Tem uma conta? <a onClick={onNavigateloginUsuario} className="underline">Conecte-se</a>
                </p>
            </div>

            <p onClick={onNavigateCadastroUsuario}
                className="w-full p-2 cursor-pointer text-amber-600 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium text-center mt-4">
                Cadastre-se como usuário
            </p>
        </div>
    );
};
