import Link from "next/link";
import { IoLogoGithub, IoLogoLinkedin, IoMail } from "react-icons/io5";

import { BackgroundBeams } from "@/_components/ui/BackgroundBeams";

export default function Footer() {
  return (
    <div
      className="border-dark-300 relative mt-20 mb-5 flex flex-col justify-center overflow-hidden rounded-xl border antialiased"
      id="contact"
    >
      <BackgroundBeams className="z-0" />
      <div className="relative z-10">
        <div className="space-y-8 p-10">
          <h1 className="relative z-10 max-w-3xl text-5xl leading-[110%] font-bold">
            <span className="text-blue-600/80">Interessado</span> no meu
            trabalho?
            <br />
            Vamos <span className="text-blue-600/80">conversar</span>!
          </h1>

          <div className="relative z-10 flex gap-4">
            <Link
              href="mailto:guilhermeperes.dev@gmail.com"
              className="bg-dark-200 hover:bg-dark-400/50 flex items-center gap-2 rounded-lg p-3 transition-all duration-200 hover:text-white"
            >
              <IoMail size={24} />
              <span>Email</span>
            </Link>

            <Link
              href="https://github.com/guilhermedkdk"
              target="_blank"
              className="bg-dark-200 hover:bg-dark-400/50 flex items-center gap-2 rounded-lg p-3 transition-all duration-200 hover:text-white"
            >
              <IoLogoGithub size={24} />
              <span>GitHub</span>
            </Link>

            <Link
              href="https://linkedin.com/in/guilhermeperesdev"
              target="_blank"
              className="bg-dark-200 hover:bg-dark-400/50 flex items-center gap-2 rounded-lg p-3 transition-all duration-200 hover:text-white"
            >
              <IoLogoLinkedin size={24} />
              <span>Linkedin</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-stone-800">
          <div className="space-y-2.5 p-10">
            <h3 className="relative z-10 text-xl font-bold">Guilherme Peres</h3>
            <p className="relative z-10 text-stone-200/70">
              &copy; 2025 | Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
