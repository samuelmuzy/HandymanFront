import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loading } from './Loading';
import { useForm } from '../hooks/useForm';

interface Usuario {
    nome: string;
    telefone: string;
    email: string;
    senha: string;
    endereco: enderecoUsuario;
}

interface enderecoUsuario {
    cep: string;
    pais: string;
    cidade: string;
    estado: string;
    rua: string;
}

export const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const onNavigateCadastroFornecedor = () => {
    navigate('/cadastro-fornecedor'); // Redireciona para a página de cadastro de fornecedor
  }

  const requisicao:Usuario = {
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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aciona o loading
    setIsLoading(true);
    
    axios.post('http://localhost:3003/usuarios', requisicao)
    .then((response) => {
      console.log('Login bem-sucedido:', response.data);
      navigate('/') // Redireciona para a página inicial após o login
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Erro ao fazer login:', error.response.data.error);
      setIsLoading(false);
      setError(error.response.data.error);
      
    })
  };

  return (
    
    <div className="w-full max-w-[430px] mx-auto my-8 shadow-lg p-6 rounded-md">
      
      {/* Loading Spinner */}
      {isLoading && (<Loading />)}
      
      {/* Seção Superior */}
      <div className="text-left mb-4 px-2">
        <h1 className="text-xl font-bold text-text-brown">HANDYMAN</h1>
        <h2 className="text-sm text-text-brown">Não faça você mesmo,</h2>
        <h2 className="text-sm text-text-brown">encontre um proficional!</h2>
        <p className="text-xs text-text-brown mt-0.5">A sua plataforma confiável para serviços manuais!</p>
      </div>

      {/* Seção do Formulário */}
      <div className="bg-[#EEB16C] rounded-lg p-3">
        
      <form onSubmit={handleSubmit} className="space-y-4">
  
  {/* Informações do Usuário */}
  <div>
    <h3 className="text-white text-lg font-semibold mb-2">Informações do Usuário</h3>
    <div className="space-y-2">
      {/* Nome */}
      <div className="space-y-1">
        <label htmlFor="nome" className="text-xs text-white">Nome Completo</label>
        <input
          id="nome"
          type="text"
          name="nome"
          value={form.nome}
          onChange={onChange}
          className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
          required
        />
      </div>

      {/* Telefone */}
      <div className="space-y-1">
        <label htmlFor="telefone" className="text-xs text-white">Telefone</label>
        <input
          id="telefone"
          type="text"
          name="telefone"
          value={form.telefone}
          onChange={onChange}
          className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-xs text-white">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
          required
        />
      </div>

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
           {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Endereço */}
  <div>
    <h3 className="text-white text-lg font-semibold mb-2">Endereço</h3>
    <div className="grid grid-cols-2 gap-2">
      {/* CEP */}
      <div className="space-y-1">
        <label htmlFor="cep" className="text-xs text-white">CEP</label>
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

      {/* País */}
      <div className="space-y-1">
        <label htmlFor="pais" className="text-xs text-white">País</label>
        <input
          id="pais"
          type="text"
          name="pais"
          value={form.pais}
          onChange={onChange}
          className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
          required
        />
      </div>

      {/* Estado */}
      <div className="space-y-1">
        <label htmlFor="estado" className="text-xs text-white">Estado</label>
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
      <div className="space-y-1">
        <label htmlFor="cidade" className="text-xs text-white">Cidade</label>
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
        <label htmlFor="rua" className="text-xs text-white">Rua</label>
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
    </div>
    <div className="text-center py-3">
            <p className="text-xs text-white">
            Tem uma conta?{' '}
              <a href="/login" className="text-white hover:underline">
              Conecte-se
              </a>
            </p>
    </div>
  </div>

  {/* Botão de envio */}
  <button
    type="submit"
    className="w-full p-2 bg-[#AD5700] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
  >
    Cadastrar-se
  </button>
  {/* Erro */}
  {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
</form>

      </div>
      <p onClick={onNavigateCadastroFornecedor} className="w-full p-2 cursor-pointer text-amber-600 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium text-center mt-4"
  >
  Seja nosso parceiro: Cadastre-se como profissional
  </p>
    </div>
  );
}; 