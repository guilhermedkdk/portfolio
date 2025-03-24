"use client";

import Image from "next/image";
import Link from "next/link";
import { IoDocumentText, IoPaperPlane } from "react-icons/io5";

import ShinyButton from "./ui/ShinyButton";

export const Hero = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="mb-2 flex items-center gap-4">
        <div className="relative h-24 w-24">
          <Image
            src="/avatar.png"
            alt="Profile"
            fill
            // className="rounded-full border-2 border-neutral-700 object-cover"
            className="rounded-full border-2 border-neutral-700 transition-transform duration-500 hover:scale-[1.2] hover:-rotate-12"
          />
        </div>
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-semibold text-white">Guilherme Peres</h2>
          <div className="flex items-center gap-1">
            <Image
              src="/brazil.svg"
              alt="Bandeira do Brasil"
              width={24}
              height={24}
              className="rounded-sm"
            />
            <span className="text-sm text-neutral-400">São Paulo, SP</span>
          </div>
        </div>
      </div>

      <h1 className="mb-8 text-6xl font-bold tracking-tight text-white sm:text-7xl">
        DESENVOLVEDOR
        <br />
        FULLSTACK
      </h1>

      <div className="flex items-center gap-6">
        <a
          href="/avatar.png"
          download
          className="group flex items-center gap-2.5"
        >
          <IoDocumentText size={20} />
          <span className="font-medium text-white transition duration-200 group-hover:opacity-70">
            Download CV
          </span>
        </a>

        <Link href="mailto:guilhermeperes.dev@gmail.com">
          <ShinyButton icon={<IoPaperPlane />}>Entre em contato</ShinyButton>
        </Link>
      </div>
    </section>
  );
};
