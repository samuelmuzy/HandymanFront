import { useNavigate } from "react-router-dom";
import { typeUsuario } from "./PerfilUsuario"
import imagemPerfilProvisoria from '../../assets/perfil.png';

interface Pagina_inicialProps {
    usuario:typeUsuario | null
}
export const Pagina_inicial = ({usuario}:Pagina_inicialProps) => {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/');
    }

    return (
        <div>
            {/* Conteúdo principal */}
            < div className="flex-1 px-10 py-8" >
                <div className="flex items-center space-x-6 mb-6">
                    <img
                        src={usuario?.picture || imagemPerfilProvisoria}
                        alt="Foto de perfil"
                        className="w-16 h-16 rounded-full border border-gray-300"
                    />
                    <div>
                        <h1 className="text-xl font-semibold">{usuario?.nome}</h1>
                        <p className="text-gray-600">{usuario?.email}</p>
                    </div>
                </div>

                {/* Botões de navegação */}
                <div className="flex space-x-4 mb-8">
                    <button className="bg-gray-100 w-32 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                        Dados pessoais
                    </button>
                    <button className="bg-gray-100 w-32 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                        Segurança
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-100 w-32 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                    >
                        Sair
                    </button>
                </div>

                {/* Informações adicionais */}
                <div className="text-gray-700 space-y-2">
                    <p><strong>Telefone:</strong> {usuario?.telefone}</p>
                    <div>
                        <h3 className="text-md font-semibold mb-2">Histórico de serviços:</h3>
                        {usuario?.historico_servicos.map((his, i) => (
                            <p key={i} className="text-sm pl-2 border-l-2 border-orange-500 ml-2">{his}</p>
                        ))}
                    </div>
                </div>
            </div >
        </div>
    )
}