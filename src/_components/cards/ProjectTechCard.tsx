export default function ProjectTechCard({
  techStack,
}: {
  techStack: string[];
}) {
  return (
    <div className="flex max-w-sm flex-wrap items-center gap-2.5">
      {techStack.map((tech) => (
        <p
          key={tech}
          className="bg-dark-300 hover:bg-dark-400 border-dark-400 w-fit rounded-md border px-4 py-2 text-xs font-medium text-white/60 transition-colors duration-200 hover:text-white"
        >
          {tech}
        </p>
      ))}
    </div>
  );
}
