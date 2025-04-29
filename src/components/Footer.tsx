import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';// Garante que o CSS global seja aplicado
import imagemLogo from '../assets/logoCasa1.png'; // Importe a imagem do logo

const Footer = () => {
  return (
    <footer className="bg-[#F9F6F2] mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                  <img className="h-10 w-auto" src={imagemLogo} alt="HANDYMAN" />
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
  );
};

export default Footer;
