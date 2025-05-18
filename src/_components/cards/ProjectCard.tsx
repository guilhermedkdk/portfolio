"use client";

import Image from "next/image";
import Link from "next/link";
import { IoLogoGithub, IoRocket } from "react-icons/io5";

import ProjectTechnologiesMini from "./ProjectTechCard";

interface ProjectProps {
  id: string;
  heading: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveDemoUrl: string;
  sourceCodeUrl: string;
}

export default function ProjectCard({ project }: { project: ProjectProps }) {
  const {
    heading,
    description,
    imageUrl,
    techStack,
    sourceCodeUrl,
    liveDemoUrl,
  } = project;

  return (
    <div className="bg-dark-200 flex h-full flex-col rounded-lg p-5">
      <Link
        href={liveDemoUrl}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-lg"
      >
        <Image
          src={imageUrl}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={heading}
          className="object-cover object-center transition-transform duration-700 hover:scale-110"
          priority
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="mt-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{heading}</h3>
          <div className="flex gap-2">
            <Link
              href={sourceCodeUrl}
              target="_blank"
              className="hover:bg-dark-400 border-dark-400 bg-dark-300 flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors duration-200"
            >
              <IoLogoGithub className="size-5 text-white/80" />
              <span className="text-sm font-medium text-white/80">Github</span>
            </Link>
            <Link
              href={liveDemoUrl}
              target="_blank"
              className="hover:bg-dark-400 border-dark-400 bg-dark-300 flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors duration-200"
            >
              <IoRocket className="size-5 text-white/80" />
              <span className="text-sm font-medium text-white/80">Deploy</span>
            </Link>
          </div>
        </div>
        <p className="mt-2 text-sm text-white/70">{description}</p>
        <div className="mt-3">
          <ProjectTechnologiesMini techStack={techStack} />
        </div>
      </div>
    </div>
  );
}
