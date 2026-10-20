import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AiWorkflow from "@/components/AiWorkflow";
import RoleFit from "@/components/RoleFit";
import CaseStudy from "@/components/CaseStudy";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AiWorkflow />
        <RoleFit />
        <CaseStudy />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
