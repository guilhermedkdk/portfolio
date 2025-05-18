import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

import { portfolioProjects } from "../_libs/constants";
import ProjectCard from "./cards/ProjectCard";
import ShinyButton from "./ui/ShinyButton";

export default function Projects() {
  return (
    <div className="py-18" id="work">
      <div className="flex flex-row justify-between gap-4">
        <h2 className="text-5xl font-bold text-stone-200">Projetos</h2>

        <Link href="https://github.com/guilhermedkdk" target="_blank">
          <ShinyButton icon={<IoChevronForward />}>Mais projetos</ShinyButton>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
        {portfolioProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
