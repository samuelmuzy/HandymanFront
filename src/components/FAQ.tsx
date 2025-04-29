import React, { useState } from 'react';
import { FaSearch, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';

interface FAQItem {
  question: string;
  answer: string;
}

const EXAMPLES: FAQItem[] = [
  {
    question: "Como posso solicitar um serviço?",
    answer: "Você pode solicitar um serviço através do nosso aplicativo, selecionando a categoria desejada e preenchendo os detalhes do serviço."
  },
  {
    question: "Quais são as formas de pagamento aceitas?",
    answer: "Aceitamos cartões de crédito, débito, Pix e transferência bancária."
  },
  {
    question: "Como funciona a garantia dos serviços?",
    answer: "Todos os nossos serviços possuem garantia de 90 dias, podendo ser estendida dependendo do tipo de serviço."
  },
  {
    question: "Como posso cancelar um serviço agendado?",
    answer: "Você pode cancelar um serviço agendado acessando a área 'Meus Serviços' e clicando em 'Cancelar'."
  },
  {
    question: "Onde encontro minha fatura?",
    answer: "As faturas ficam disponíveis na área do cliente, em 'Pagamentos'."
  },
  {
    question: "Qual a política de cancelamento?",
    answer: "Cancelamentos podem ser feitos até 24h antes do serviço sem cobrança de taxa."
  },
  {
    question: "Como alterar meus dados cadastrais?",
    answer: "Acesse o menu 'Perfil' e clique em 'Editar dados'."
  }
];

const popularTags = ["Fatura", "Pagamento", "Política de cancelamento"];

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    setTimeout(() => {
      const results = EXAMPLES.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setLoading(false);
    }, 700); // Simula delay de API
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src="/logo.png" alt="HANDYMAN" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/servicos" className="text-gray-700 hover:text-[#A75C00]">Serviços</a>
              <a href="/sobre-nos" className="text-gray-700 hover:text-[#A75C00]">Sobre nós</a>
              <a href="/ajuda" className="text-gray-700 hover:text-[#A75C00]">Ajuda</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-[#A75C00] text-[#A75C00] rounded-md hover:bg-[#A75C00] hover:text-white">
                Entrar
              </button>
              <button className="px-4 py-2 bg-[#A75C00] text-white rounded-md hover:bg-[#8B4D00]">
                Cadastrar-se
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#A75C00] mb-8">Como podemos te ajudar?</h1>
          <div className="max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Pesquisa"
                className="flex-1 p-4 border-none rounded-l-lg rounded-r-none bg-[#AD5700]/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#AD5700]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-[#AD5700] text-white rounded-r-lg rounded-l-none hover:opacity-90 font-semibold focus:outline-none"
              >
                Pesquisar
              </button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 items-center">
              <span className="text-[#AD5700] font-medium mr-2">Pesquisas populares:</span>
              {popularTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className="px-4 py-1 bg-[#AD5700] text-white rounded-lg hover:opacity-90 text-sm font-semibold"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center text-[#A75C00] text-lg font-medium mt-8">Buscando resultados...</div>
        )}
        {hasSearched && !loading && (
          <div className="max-w-3xl mx-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((item, index) => (
                  <div key={index} className="faq-item bg-white p-6 rounded-lg shadow-md border border-[#AD5700]">
                    <h3 className="faq-question text-[20px] font-bold text-[#AD5700] mb-2">{item.question}</h3>
                    <p className="faq-answer text-[16px] text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-12">
                <button className="mx-auto flex items-center justify-center bg-[#AD5700] rounded-lg w-[200px] h-[70px] mb-6 hover:opacity-90">
                  <FaEnvelope className="h-10 w-10 text-white" />
                </button>
                <p className="text-[#AD5700] text-xl font-bold mb-2 flex items-center justify-center gap-2">Não encontra o que precisa? <span className="text-2xl">→</span></p>
                <p className="text-[#AD5700] text-base">Contacte-nos e responderemos assim que possível.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#F9F6F2] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img className="h-10 w-auto" src="/logo.png" alt="HANDYMAN" />
              <span className="text-[#A75C00] font-bold text-lg">HANDYMAN</span>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-[#A75C00] hover:text-[#8B4D00]"><FaFacebook className="h-6 w-6" /></a>
              <a href="#" className="text-[#A75C00] hover:text-[#8B4D00]"><FaTwitter className="h-6 w-6" /></a>
              <a href="#" className="text-[#A75C00] hover:text-[#8B4D00]"><FaInstagram className="h-6 w-6" /></a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#A75C00]">Download our App</span>
              <button className="p-2 bg-black text-white rounded-md"><SiAppstore className="h-6 w-6" /></button>
              <button className="p-2 bg-black text-white rounded-md"><SiGoogleplay className="h-6 w-6" /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ; 