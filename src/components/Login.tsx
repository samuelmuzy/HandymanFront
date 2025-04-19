import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de login
  };

  return (
    <div className="w-full max-w-[320px] mx-auto my-8">
      {/* Seção Superior */}
      <div className="text-left mb-4 px-2">
        <h1 className="text-xl font-bold text-text-brown">HANDYMAN</h1>
        <h2 className="text-sm text-text-brown">Não faça você mesmo,</h2>
        <h2 className="text-sm text-text-brown">encontre um proficional!</h2>
        <p className="text-xs text-text-brown mt-0.5">A sua plataforma confiável para serviços manuais!</p>
      </div>

      {/* Seção do Formulário */}
      <div className="bg-[#EEB16C] rounded-lg p-3">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="space-y-1">
            <div className="text-left w-full">
              <label htmlFor="email" className="inline-block text-xs text-white">
                Email
              </label>
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="text-left w-full">
              <label htmlFor="password" className="inline-block text-xs text-white">
                Senha
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="text-right">
            <a href="#" className="text-xs text-white hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-[#AD5700] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Login
          </button>

          <div className="text-center">
            <p className="text-xs text-white">
              Não tem uma conta?{' '}
              <a href="#" className="text-white hover:underline">
                Cadastre-se
              </a>
            </p>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-[#EEB16C] text-white text-xs">
                Tente outro método
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className="w-full p-1.5 bg-button-google text-white rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <FcGoogle className="text-sm" />
              <span className="text-xs">Entrar com o Google</span>
            </button>

            <button
              type="button"
              className="w-full p-1.5 bg-button-facebook text-white rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <FaFacebook className="text-sm" />
              <span className="text-xs">Entrar com o Facebook</span>
            </button>

            <button
              type="button"
              className="w-full p-1.5 bg-button-apple text-white rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <FaApple className="text-sm" />
              <span className="text-xs">Entrar com Apple</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 