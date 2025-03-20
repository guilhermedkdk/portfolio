"use client";

import Link from "next/link";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

export const Navbar = ({
  navItems,
}: {
  navItems: Array<{ name: string; link: string }>;
}) => {
  return (
    <nav className="border-dark-700 bg-dark-200 fixed inset-x-0 top-10 z-[5] mx-auto flex max-w-fit items-center justify-between gap-8 rounded-lg border px-8 py-4">
      <div className="flex space-x-4">
        {navItems.map((navItem, index) => (
          <Link
            key={`link-${index}`}
            href={navItem.link}
            className="relative flex space-x-1 text-neutral-50 hover:text-neutral-300"
          >
            <span className="hidden font-medium sm:block">{navItem.name}</span>
          </Link>
        ))}
      </div>
      <div className="flex space-x-2">
        <Link href="https://github.com/guilhermedkdk" target="_blank">
          <IoLogoGithub size={24} />
        </Link>
        <Link href="https://linkedin.com/in/guilhermeperesdev" target="_blank">
          <IoLogoLinkedin size={24} />
        </Link>
      </div>
    </nav>
  );
};
