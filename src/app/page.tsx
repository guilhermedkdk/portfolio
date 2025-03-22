import { Hero } from "@/_components/Hero";
import { Navbar } from "@/_components/Navbar";

const navItems = [
  { name: "Projetos", link: "#" },
  { name: "Sobre", link: "#" },
  { name: "Contato", link: "#" },
];

export default function Home() {
  return (
    <main className="relative flex flex-col px-5 sm:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <Navbar navItems={navItems} />
        <Hero />
      </div>
    </main>
  );
}
