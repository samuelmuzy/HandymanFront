export const PaginaErro = () => {
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600">Erro 404</h1>
            <p className="mt-4 text-lg text-gray-700">Página não encontrada</p>
            <a href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Voltar para a página inicial
            </a>
        </div>
    );
}