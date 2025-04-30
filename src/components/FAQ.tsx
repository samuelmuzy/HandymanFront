import React, { useEffect, useState } from 'react';
import { FaEnvelope} from 'react-icons/fa';
import Footer from './Footer';
import Header from './Header';
import axios from 'axios';

interface FAQItem {
  pergunta: string;
  resposta: string;
  palavrasChave: string[];
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [verify, setVerify] = useState(false);
  
  const popularTags = ["Fatura", "Pagamento", "Política de cancelamento"];
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    axios.get(`http://localhost:3003/faq?query=${searchTerm}`)
    .then((response) => {
      const results = response.data;
      setSearchResults(results);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Erro ao buscar FAQ:", error);
      setLoading(false);
      setSearchResults([]);
    }); 
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    setVerify(!verify);
    handleSearch();
  };

  useEffect(() => {
    handleSearch();
  },[verify])

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Header */}
      <Header />

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
              {searchResults.length === 0 ? (
                  popularTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="px-4 py-1 bg-[#AD5700] text-white rounded-lg hover:opacity-90 text-sm font-semibold"
                    >
                      {tag}
                    </button>
                  ))
                ) : (
                  searchResults.flatMap((item) =>
                    item.palavrasChave.map((tag, index) => (
                      <button
                        key={`${item.pergunta}-${index}`}
                        onClick={() => handleTagClick(tag)}
                        className="px-4 py-1 bg-[#AD5700] text-white rounded-lg hover:opacity-90 text-sm font-semibold"
                      >
                        {tag}
                      </button>
                    ))
                  )
                )}
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
                    <h3 className="faq-question text-[20px] font-bold text-[#AD5700] mb-2">{item.pergunta}</h3>
                    <p className="faq-answer text-[16px] text-gray-700">{item.resposta}</p>
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
      <Footer />
    </div>
  );
};

export default FAQ; 