import Header from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import Services from "../components/Services";
import { HowItWorks } from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export const HomeScreen = () => {

    return(
        <>
            <Header/>
            <HeroSection />
            <Services />
            <HowItWorks />
            <Testimonials />
            <Footer />
        </>
    );
}