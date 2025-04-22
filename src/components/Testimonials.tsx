import React from 'react';

export const Testimonials = () => {
  return (
    <section className="testimonials">
      <h3>O que estão dizendo sobre nós?</h3>
      <div className="testimonial-cards">
        <div className="card">
          <p>★★★★★</p>
          <strong>Jana T.</strong>
          <p>
            Contratei o serviço para instalar algumas prateleiras e o profissional chegou no horário, super educado e eficiente. Em menos de 40 minutos, tudo estava instalado. Super indico, vou com certeza usar novamente.
          </p>
        </div>
        <div className="card">
          <p>★★★★★</p>
          <strong>Elizabeth P.</strong>
          <p>
            Precisei de ajuda para montar móveis e o profissional foi super rápido e cuidadoso. Ele montou uma cômoda e ainda ajustou umas outras peças. Indico demais! Serviço sem enrolação e recomendo demais.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
