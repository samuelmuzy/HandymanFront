import bonecoImage from '../../assets/Boneco1.png';

export const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 bg-white">
      
      {/* Texto e busca */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#8B4000] leading-snug mb-6">
          Não faça você mesmo, <br /> encontre um profissional
        </h2>

        {/* Campo de pesquisa */}
        <div className="flex items-center w-full max-w-md bg-white border border-[#8B4000] rounded-full overflow-hidden mb-8">
          <input
            type="text"
            placeholder="O que procura?"
            className="flex-grow px-4 py-2 outline-none"
          />
          <button className="bg-[#8B4000] text-white px-5 py-2 rounded-full">
            🔍
          </button>
        </div>

        {/* Ícones de serviços */}
        
      </div>

      {/* Imagem do personagem */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={bonecoImage}
          alt="Handyman personagem"
          className="max-w-sm w-full h-auto object-contain"
        />
      </div>
    </section>
  );
};
