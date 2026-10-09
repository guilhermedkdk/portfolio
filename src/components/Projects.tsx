import { useTranslations } from "next-intl";

import { portfolioProjects } from "@/lib/constants";

import ProjectItem from "./cards/ProjectItem";
import GradientHeading from "./ui/GradientHeading";
import Reveal from "./ui/Reveal";

export default function Projects() {
  const t = useTranslations("Projects");

  // Rows alternate sides so the list reads the same with any project count.
  return (
    <section id="work" className="scroll-mt-20 py-16 sm:py-20">
      <Reveal from="above">
        <GradientHeading>{t("title")}</GradientHeading>
      </Reveal>

      <ul className="mt-10 divide-y divide-stone-200/10">
        {portfolioProjects.map((project, index) => (
          <ProjectItem
            key={project.id}
            project={project}
            reversed={index % 2 === 1}
          />
        ))}
      </ul>
    </section>
  );
}
