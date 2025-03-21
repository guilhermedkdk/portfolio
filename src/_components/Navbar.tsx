"use client";

import Image from "next/image";
import Link from "next/link";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

export const Navbar = ({
  navItems,
}: {
  navItems: Array<{ name: string; link: string }>;
}) => {
  return (
    <nav className="border-dark-700 bg-dark-200 fixed inset-x-0 top-10 z-[5] mx-auto flex max-w-fit items-center justify-between gap-18 rounded-lg border px-8 py-4">
      <div className="flex space-x-8">
        {navItems.map((navItem, index) => (
          <Link
            key={`link-${index}`}
            href={navItem.link}
            className="text-white transition-opacity duration-200 hover:opacity-70"
          >
            <span className="font-medium sm:block">{navItem.name}</span>
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="https://github.com/guilhermedkdk"
          target="_blank"
          className="transition-opacity duration-200 hover:opacity-70"
        >
          <IoLogoGithub size={24} />
        </Link>
        <Link
          href="https://linkedin.com/in/guilhermeperesdev"
          target="_blank"
          className="transition-opacity duration-200 hover:opacity-70"
        >
          <IoLogoLinkedin size={24} />
        </Link>
        <div className="h-3 w-0.5 bg-neutral-600" />
        <button className="cursor-pointer transition-opacity duration-200 hover:opacity-40">
          <Image
            src="/brazil.svg"
            alt="Bandeira do Brasil"
            width={26}
            height={26}
            className="rounded-sm"
          />
        </button>
      </div>
    </nav>
  );
};
