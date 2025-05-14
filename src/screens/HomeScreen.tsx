import Header from "../components/Header";
import { HeroSection } from "../components/pagina_principal/HeroSection";
import { HowItWorks } from "../components/pagina_principal/HowItWorks";
import Testimonials from "../components/pagina_principal/Testimonials";
import Footer from "../components/Footer";

export const HomeScreen = () => {

    return(
        <>
            <Header/>
            <HeroSection />
            <HowItWorks />
            <Testimonials />
            <Footer />
        </>
    );
}