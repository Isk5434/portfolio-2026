import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import Skills from "@/components/sections/Skills";
import Log from "@/components/sections/Log";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Works />
        <Skills />
        <Log />
        <Contact />
      </main>
    </>
  );
}
