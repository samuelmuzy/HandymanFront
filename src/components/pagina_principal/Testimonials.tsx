export const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-12 px-6 md:px-20">
      <h3 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-10">
        O que estão dizendo sobre nós?
      </h3>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-[#8B4000]">
          <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
          <h4 className="text-lg font-bold text-gray-800 mb-1">Jana T.</h4>
          <p className="text-gray-600">
            Contratei o serviço para instalar algumas prateleiras e o profissional chegou no horário, super educado e eficiente. Em menos de 40 minutos, tudo estava instalado. Super indico, vou com certeza usar novamente.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-[#8B4000]">
          <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
          <h4 className="text-lg font-bold text-gray-800 mb-1">Elizabeth P.</h4>
          <p className="text-gray-600">
            Precisei de ajuda para montar móveis e o profissional foi super rápido e cuidadoso. Ele montou uma cômoda e ainda ajustou umas outras peças. Indico demais! Serviço sem enrolação e recomendo demais.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
