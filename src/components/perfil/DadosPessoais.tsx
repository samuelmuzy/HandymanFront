import axios from "axios";
import { useRef, useState } from "react";
import imagemPerfilProvisoria from '../../assets/perfil.png';

interface DadosPessoaisProps {
    id_usuario: string | undefined;
    email: string | undefined;
    nome: string | undefined;
    telefone: string | undefined;
    picture: string | undefined;
}

export const DadosPessoais = ({ id_usuario, email, nome, telefone, picture }: DadosPessoaisProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const URLAPI = import.meta.env.VITE_URLAPI;
    const token = localStorage.getItem("token");
    const [imagemPerfil, setImagemPerfil] = useState<string | undefined>(picture);

    const handleImagemClick = () => {
        fileInputRef.current?.click();
    };

    const handleImagemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            alterarImagem(file);
            setImagemPerfil(url);
        }
    };

    const alterarImagem = async (imagemSelecionada: File) => {
        const formData = new FormData();
        formData.append("imagem", imagemSelecionada);

        try {
            const response = await axios.post(
                `${URLAPI}/usuarios/mudar-imagem-perfil/${id_usuario}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": token
                    },
                }
            );
            localStorage.setItem("imagemPerfil", response.data.imagem);
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
        }
    };

    return (
        <div className="max-w-md ml-6 mt-7 p-4 bg-white rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Informações Pessoais</h2>

            <div className="flex flex-col items-start gap-4">
                <img
                    src={imagemPerfil || imagemPerfilProvisoria}
                    alt="Foto de perfil"
                    onClick={handleImagemClick}
                    className="w-28 h-28 rounded-full object-cover cursor-pointer border-2 border-gray-300 hover:opacity-90 transition"
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImagemChange}
                    className="hidden"
                />

                <div className="w-full mt-4">
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">Nome:</p>
                        <p className="text-lg text-gray-800 font-medium">{nome || "-"}</p>
                    </div>

                    <hr />

                    <div className="my-4">
                        <p className="text-sm text-gray-500">Email:</p>
                        <p className="text-lg text-gray-800 font-medium">{email || "-"}</p>
                    </div>

                    <hr />

                    <div className="mt-4">
                        <p className="text-sm text-gray-500">Telefone:</p>
                        <p className="text-lg text-gray-800 font-medium">{telefone || "-"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
