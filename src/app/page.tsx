import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import Experience from "@/components/sections/Experience";
import Achievements from "@/components/sections/Achievements";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Works />
        <Experience />
        <Achievements />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
