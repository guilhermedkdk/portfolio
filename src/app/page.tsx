import Footer from "@/_components/Footer";
import Hero from "@/_components/Hero";
import Navbar from "@/_components/Navbar";
import Projects from "@/_components/Projects";
import Skills from "@/_components/Skills";

const navItems = [
  { name: "Projetos", link: "#" },
  { name: "Sobre", link: "#" },
  { name: "Contato", link: "#" },
];

export default function Home() {
  return (
    <main className="relative flex flex-col px-10">
      <div className="mx-auto w-full max-w-7xl">
        <Navbar navItems={navItems} />
        <Hero />
        <Skills />
        <Projects />
        <Footer />
      </div>
    </main>
  );
}
