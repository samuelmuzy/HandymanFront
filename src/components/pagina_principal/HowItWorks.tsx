export const HowItWorks = () => {
  return (
    <section className="bg-white py-12 px-6 md:px-20">
      <h3 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-10">
        Como o HandyMan Funciona?
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Lista */}
        <ul className="space-y-4 text-gray-700 text-lg md:text-xl w-full md:w-1/2">
          <li className="flex items-start gap-2">
            ✅ <span>Trabalho de qualidade - eficiente e confiável</span>
          </li>
          <li className="flex items-start gap-2">
            ✅ <span>Receba orçamentos gratuitos e de alta qualidade</span>
          </li>
          <li className="flex items-start gap-2">
            ✅ <span>Segurança em cada pedido</span>
          </li>
          <li className="flex items-start gap-2">
            ✅ <span>Trabalhe com especialistas que falam português</span>
          </li>
          <li className="flex items-start gap-2">
            ✅ <span>24 horas por dia - suporte ininterrupto</span>
          </li>
        </ul>

        {/* Vídeo do YouTube */}
        <div className="relative w-full md:w-1/2 aspect-video rounded-xl shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/IHDvrpUdSc0"
            title="Handyman Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
