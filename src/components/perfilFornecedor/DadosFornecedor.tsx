import { useState, useEffect } from "react";
import axios from "axios";
import { typeFornecedor } from "./PerfilFornecedor";

interface DadosFornecedorProps {
    idFornecedor: string | undefined;
    usuario: typeFornecedor | null;
    onUpdate: () => void;
}

export const DadosFornecedor = ({ idFornecedor, usuario, onUpdate }: DadosFornecedorProps) => {
    const URLAPI = import.meta.env.VITE_URLAPI;
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedIllustrativeImage, setSelectedIllustrativeImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewIllustrativeImage, setPreviewIllustrativeImage] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nome: usuario?.nome || "",
        email: usuario?.email || "",
        telefone: usuario?.telefone || "",
        descricao: usuario?.descricao || "",
        sub_descricao: usuario?.sub_descricao || "",
        valor: usuario?.valor || 0,
    });

    useEffect(() => {
        if (usuario) {
            setFormData({
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                descricao: usuario.descricao,
                sub_descricao: usuario.sub_descricao,
                valor: usuario.valor,
            });
        }
    }, [usuario]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'perfil' | 'ilustrativa') => {
        const file = event.target.files?.[0];
        if (file) {
            if (type === 'perfil') {
                setSelectedImage(file);
                setPreviewImage(URL.createObjectURL(file));
            } else {
                setSelectedIllustrativeImage(file);
                setPreviewIllustrativeImage(URL.createObjectURL(file));
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitDados = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!idFornecedor) return;

        try {
            await axios.put(`${URLAPI}/fornecedor/${idFornecedor}`, formData);
            onUpdate();
            setIsEditing(false);
            alert('Dados atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            alert('Erro ao atualizar dados. Tente novamente.');
        }
    };

    const handleSubmitImagemPerfil = async () => {
        if (!idFornecedor || !selectedImage) return;

        const formData = new FormData();
        formData.append('imagem', selectedImage);

        try {
            await axios.post(`${URLAPI}/fornecedor/salvar-imagem-perfil/${idFornecedor}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpdate();
            setSelectedImage(null);
            alert('Imagem de perfil atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar imagem de perfil:', error);
            alert('Erro ao atualizar imagem de perfil. Tente novamente.');
        }
    };

    const handleSubmitImagemIlustrativa = async () => {
        if (!idFornecedor || !selectedIllustrativeImage) return;

        const formData = new FormData();
        formData.append('imagem', selectedIllustrativeImage);

        try {
            await axios.post(`${URLAPI}/fornecedor/salvar-imagem-ilustrativa/${idFornecedor}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpdate();
            setSelectedIllustrativeImage(null);
            alert('Imagem ilustrativa atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar imagem ilustrativa:', error);
            alert('Erro ao atualizar imagem ilustrativa. Tente novamente.');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#A75C00]">Dados do Perfil</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-[#A75C00] border border-[#A75C00] rounded-md hover:bg-[#A75C00] hover:text-white transition-colors"
                >
                    {isEditing ? 'Cancelar Edição' : 'Editar Dados'}
                </button>
            </div>
            
            <form onSubmit={handleSubmitDados} className="space-y-8">
                {/* Seção de Imagens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg">
                    <div className="space-y-4">
                        <h3 className="font-medium text-[#A75C00]">Imagem de Perfil</h3>
                        <div className="relative">
                            <img
                                src={previewImage || usuario?.imagemPerfil || '/placeholder-profile.png'}
                                alt="Imagem de perfil"
                                className="w-48 h-48 object-cover rounded-full border-2 border-[#A75C00]"
                            />
                            {isEditing && (
                                <div className="absolute bottom-0 right-0 flex space-x-2">
                                    <label className="bg-[#A75C00] text-white p-2 rounded-full cursor-pointer hover:bg-[#8B4D00] transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'perfil')}
                                            className="hidden"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </label>
                                    {selectedImage && (
                                        <button
                                            type="button"
                                            onClick={handleSubmitImagemPerfil}
                                            className="bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-[#A75C00]">Imagem Ilustrativa</h3>
                        <div className="relative">
                            <img
                                src={previewIllustrativeImage || usuario?.imagemIlustrativa || '/placeholder-illustrative.png'}
                                alt="Imagem ilustrativa"
                                className="w-48 h-48 object-cover rounded-lg border-2 border-[#A75C00]"
                            />
                            {isEditing && (
                                <div className="absolute bottom-0 right-0 flex space-x-2">
                                    <label className="bg-[#A75C00] text-white p-2 rounded-full cursor-pointer hover:bg-[#8B4D00] transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'ilustrativa')}
                                            className="hidden"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </label>
                                    {selectedIllustrativeImage && (
                                        <button
                                            type="button"
                                            onClick={handleSubmitImagemIlustrativa}
                                            className="bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Seção de Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
                    <div className="space-y-4">
                        <h3 className="font-medium text-[#A75C00] mb-4">Dados Pessoais</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A75C00]"
                                    />
                                ) : (
                                    <p className="text-gray-600">{usuario?.nome}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A75C00]"
                                    />
                                ) : (
                                    <p className="text-gray-600">{usuario?.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A75C00]"
                                    />
                                ) : (
                                    <p className="text-gray-600">{usuario?.telefone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valor/Hora</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="valor"
                                        value={formData.valor}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A75C00]"
                                    />
                                ) : (
                                    <p className="text-gray-600">R$ {usuario?.valor.toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-[#A75C00] mb-4">Descrição</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Principal</label>
                                {isEditing ? (
                                    <textarea
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A75C00]"
                                    />
                                ) : (
                                    <p className="text-gray-600">{usuario?.descricao}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Secundária</label>
                                {isEditing ? (
                                    <textarea
                                        name="sub_descricao"
                                        value={formData.sub_descricao}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A75C00]"
                                    />
                                ) : (
                                    <p className="text-gray-600">{usuario?.sub_descricao}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 border border-[#A75C00] text-[#A75C00] rounded-md hover:bg-[#A75C00]/10 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#A75C00] text-white rounded-md hover:bg-[#8B4D00] transition-colors"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}; 