import bonecoImage from '../../assets/Boneco1.png';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-evenly px-6 md:px-20 py-10 bg-white border-b-2">
      
      {/* Texto e busca */}
      <div className="w-full md:w-1/3 mb-10 md:mb-0">
        <h2 className="text-3xl md:text-3xl font-semibold text-[#8B4000] leading-snug mb-6">
          Não faça você mesmo, <br /> encontre um profissional
        </h2>
        <Link 
          to="/servicos" 
          className="inline-block bg-[#8B4000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6B3000] duration-300 hover:text-white"
        >
          Encontrar Serviços
        </Link>
      </div>

      {/* Imagem do personagem */}
      <div className="w-full md:w-1/3 flex justify-center">
        <img
          src={bonecoImage}
          alt="Handyman personagem"
          className="max-w-xl w-full h-auto object-contain"
        />
      </div>
    </section>
  );
};
