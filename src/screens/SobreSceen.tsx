import trabalhadorImage from '../assets/trabalhador.png';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const SobreSceen = () =>{
    return(
        <>
        <Header/>
            <section className="about">
      <div className="about-header">
        <h1>HANDYMAN</h1>
        <br></br>
        <p>Bem-vindo à Handyman, a sua plataforma confiável 
        para serviços manuais! A sua plataforma confiável para serviços manuais!</p>
        <p>
          Somos especializados em conectar você a profissionais qualificados para realizar pequenos reparos, reformas, montagens, instalações e muito mais.
          Nosso objetivo é proporcionar praticidade, segurança e qualidade em cada serviço, garantindo que sua casa ou empresa esteja sempre em ótimas condições
        </p>
        <br></br>
        <br></br>
      <div className="about-content">
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className="about-how-it-works">
        <h2>Como o Handyman Funciona?</h2>
        <ul>
          <li>Profissionais qualificados - Todos os nossos prestadores são experientes e de confiança</li>
          <li>Agilidade no atendimento - Solicite um serviço de forma rápida e prática..</li>
          <li>Orçamentos justos - Preços acessíveis e transparência em cada etapa..</li>
          <li>Diversidade de serviços - Desde consertos elétricos até montagem de móveis..</li>
          <li>Na Handyman, acreditamos que um bom trabalho manual faz toda a diferença no dia a dia</li>
          <li>Conte conosco para facilitar sua vida e deixar tudo do jeito que você precisa!</li>
          <li>Entre em contato e solicite um serviço agora mesmo!</li>
        </ul>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className="about-essence-wrapper">
  <section className="about-essence">
    <div className="essence-container">
      <div className="essence-text">
        <h2>Nossa Essência</h2>
        <p>
          A Handyman nasceu com a missão de conectar você a profissionais qualificados para serviços manuais de forma simples e segura...
        </p>
      </div>
      <img src={trabalhadorImage} alt="trabalhador" className="trabalhador" />
    </div>
  </section>
</div>
</section>
        <Footer/>
        </>
    )
}