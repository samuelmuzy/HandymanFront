import axios from "axios";
import { useRef, useState } from "react";
import imagemPerfilProvisoria from '../../assets/perfil.png';

interface DadosPessoaisProps {
    id_usuario:string | undefined;
    email:string | undefined;
    nome:string | undefined;
    telefone:string | undefined;
    picture:string | undefined
}

export const DadosPessoais = ({id_usuario,email,nome,telefone,picture}:DadosPessoaisProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const URLAPI = import.meta.env.VITE_URLAPI;

    const token = localStorage.getItem("token");
    
    const [imagemPerfil, setImagemPerfil] = useState<string | undefined>(picture); // imagem padrão

    const handleImagemClick = () => {
        fileInputRef.current?.click(); // abre seletor de arquivos
    };

    const handleImagemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            
            alterarImagem(file);
            setImagemPerfil(url); // atualiza imagem com o arquivo selecionado
        }
    };

    const alterarImagem = async (imagemSelecionada: File) => {
        const formData = new FormData();
        formData.append("imagem", imagemSelecionada); // "imagem" deve ser o mesmo nome esperado no backend
      
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
          localStorage.setItem("imagemPerfil",response.data.imagem);
          console.log(response.data.imagem)
        } catch (error:unknown) {
            if(error){
                console.error("Erro ao enviar imagem:", error);      
            }
        }
      };

    return (
        <div>
            <h2>Informações pessoais</h2>

            <img
                src={imagemPerfil || imagemPerfilProvisoria }
                alt="Foto de perfil"
                onClick={handleImagemClick}
                className="w-24 h-24 rounded-full cursor-pointer border border-gray-300"
            />

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImagemChange}
                className="hidden"
            />

            <div>
                <p></p>
                <p></p>
            </div>
            <div>
                <p></p>
                <p></p>
            </div>
            <div>
                <p></p>
                <p></p>
            </div>
        </div>
    );
};
