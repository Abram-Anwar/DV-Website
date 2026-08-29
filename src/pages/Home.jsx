import FAQ from "../components/FAQ/FAQ";
import FinalCTA from "../components/FinalCTA/FinalCTA";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Navbar from "../components/Navbar/Navbar";
import Pricing from "../components/Pricing/Pricing";

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
};

export default Home;
