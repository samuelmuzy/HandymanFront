import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../Loading';
import { useForm } from '../../hooks/useForm';
import { Input } from '../Inputs/Input';

interface Fornecedor {
    nome: string;
    telefone: string;
    email: string;
    senha: string;
    endereco: enderecoFornecedor;
}

interface enderecoFornecedor {
    cep: string;
    pais: string;
    cidade: string;
    estado: string;
    rua: string;
}

export const CadastroFornecedor = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // Etapa do formulário
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    
    const onNavigateCadastroUsuario = () => {
        navigate('/cadastro');
    };

    const [form, onChange] = useForm({
        nome: "",
        telefone: "",
        cep: "",
        pais: "",
        cidade: "",
        estado: "",
        rua: "",
        email: "",
        senha: "",
    });

    const requisicao: Fornecedor = {
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        senha: form.senha,
        endereco: {
            cep: form.cep,
            pais: form.pais,
            cidade: form.cidade,
            estado: form.estado,
            rua: form.rua,
        },
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Envia os dados apenas se estiver na segunda etapa
        if (step === 2) {
            setIsLoading(true);
            axios.post('http://localhost:3003/fornecedor', requisicao)
                .then((response) => {
                    console.log('Cadastro bem-sucedido:', response.data);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Erro ao cadastrar:', error.response?.data?.error || error.message);
                    setError(error.response?.data?.error || "Erro ao cadastrar");
                })
                .finally(() => setIsLoading(false));
        } else {
            // Avança para a próxima etapa
            setStep(2);
        }
    };

    return (
        <div className="w-full max-w-[450px] mx-auto my-8 shadow-lg p-6 rounded-md">
        {isLoading && <Loading />}
        
        {/* Cabeçalho */}
        <div className="text-left mb-4 px-2">
            <h1 className="text-xl font-bold text-text-brown">HANDYMAN</h1>
            <h2 className="text-lg font-semibold text-text-brown mt-6">Trabalhe Conosco</h2>
            <p className="text-sm text-text-brown mt-2">
                Faça parte da HANDYMAN e leve suas habilidades a mais pessoas! Procuramos profissionais qualificados.
            </p>
        </div>

        <div className="bg-[#EEB16C] rounded-lg p-3">
            <form onSubmit={handleSubmit} className="space-y-4">
            
            {step === 1 && (
                <>
                <h3 className="text-white text-lg font-semibold mb-2">Informações do Usuário</h3>
                {/* Nome */}
                <Input label="Nome Completo" id="nome" value={form.nome} onChange={onChange} />
                {/* Telefone */}
                <Input label="Telefone" id="telefone" value={form.telefone} onChange={onChange} />
                {/* Email */}
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
                <div className="space-y-1">
                    <label htmlFor="senha" className="text-xs text-white">Confirmar Senha</label>
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

            {/* Botão */}
            <button
                type="submit"
                className="w-full p-2 bg-[#AD5700] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            >
                {step === 1 ? "Continuar" : "Cadastrar-se"}
            </button>
            {step === 2 && (
                <p className='cursor-pointer text-white text-center ' onClick={() => setStep(1)}>Voltar</p>
            )}

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </form>

            <p className="text-center text-xs text-white mt-4">
            Tem uma conta? <a href="/login" className="underline">Conecte-se</a>
            </p>
        </div>
        <p onClick={onNavigateCadastroUsuario} className="w-full p-2 cursor-pointer text-amber-600 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium text-center mt-4"
        >Cadastre-se como usuário</p>
        </div>
    );
};