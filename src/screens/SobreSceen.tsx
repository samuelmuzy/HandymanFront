import trabalhadorImage from '../assets/trabalhador.png';
import Header from '../components/Header';
import Footer from '../components/Footer';
import imagemPrincipal from '../assets/mesa.png'

export const SobreSceen = () => {
  return (
    <>
      <Header />
      <section className="relative bg-cover bg-center text-white py-16 px-4" style={{ backgroundImage: `url(${imagemPrincipal})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for readability */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-orange-500">HANDYMAN</h1>
          <br></br>
          <p className="text-2xl mt-2">Bem-vindo à Handyman, a sua plataforma confiável
            para serviços manuais!</p>
          <p className="mt-4">
            Somos especializados em conectar você a profissionais qualificados para realizar pequenos reparos, reformas, montagens, instalações e muito mais.
            Nosso objetivo é proporcionar praticidade, segurança e qualidade em cada serviço, garantindo que sua casa ou empresa esteja sempre em ótimas condições
          </p>
          
        </div>
      </section>
      <section className='p-7 flex flex-col items-center justify-center'>
        <div className="relative z-10 max-w-4xl mx-auto mt-16 text-center text-gray-800">
          <h2 className="text-4xl font-bold text-orange-500">Como o Handyman Funciona?</h2>
          <div className="mt-8 text-center list-disc list-inside space-y-2 mb-10">
            <p>Profissionais qualificados - Todos os nossos prestadores são experientes e de confiança</p>
            <p>Agilidade no atendimento - Solicite um serviço de forma rápida e prática..</p>
            <p>Orçamentos justos - Preços acessíveis e transparência em cada etapa..</p>
            <p>Diversidade de serviços - Desde consertos elétricos até montagem de móveis..</p>
            <p>Na Handyman, acreditamos que um bom trabalho manual faz toda a diferença no dia a dia</p>
            <p>Conte conosco para facilitar sua vida e deixar tudo do jeito que você precisa!</p>
            <p>Entre em contato e solicite um serviço agora mesmo!</p>
          </div>
        </div>
      </section>

      <section className="bg-[#FBE6D2] py-16 px-4 text-gray-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 text-center md:text-left">
            <h2 className="text-4xl font-bold text-orange-500">Nossa Essência</h2>
            <p className="mt-4 text-lg">
              A Handyman nasceu com a missão de conectar você a profissionais qualificados para serviços manuais de forma simples e segura...
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img src={trabalhadorImage} alt="trabalhador" className="w-full h-auto object-cover rounded-lg shadow-md" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}