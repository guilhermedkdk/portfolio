import type { IconType } from "react-icons";
import { FaAws, FaJava } from "react-icons/fa";
import { SiDocker, SiNodedotjs, SiPython, SiReact } from "react-icons/si";

import type { Locale } from "@/i18n/routing";

// Fixed on purpose: OG, canonical and sitemap URLs are baked in at build time,
// and the Vercel env var resolved to a deployment URL that later stopped
// existing, which broke every link preview.
const siteUrl = "https://guilhermeperes.dev";

const githubUser = "guilhermedkdk";
const linkedinUser = "guilhermeperesdev";

export const siteConfig = {
  name: "Guilherme Peres",
  email: "guilhermeperes.dev@gmail.com",
  githubUser,
  github: `https://github.com/${githubUser}`,
  linkedinUser,
  linkedin: `https://linkedin.com/in/${linkedinUser}`,
  url: siteUrl,
};

// Built from cv/cv-<locale>.tex.
export const cvByLocale: Record<Locale, string> = {
  pt: "/cv/guilherme-peres-cv-pt.pdf",
  en: "/cv/guilherme-peres-cv-en.pdf",
};

// Same order as the sections on the page.
export const navItems = [
  { key: "projects", link: "#work" },
  { key: "experience", link: "#experience" },
  { key: "contact", link: "#contact" },
] as const;

type SkillItem = {
  name: string;
  Icon: IconType;
  iconColor: string;
};

export const skillItems: SkillItem[] = [
  { name: "React", Icon: SiReact, iconColor: "text-[#61DAFB]" },
  { name: "Node.js", Icon: SiNodedotjs, iconColor: "text-[#339933]" },
  { name: "Java", Icon: FaJava, iconColor: "text-[#E76F00]" },
  { name: "AWS", Icon: FaAws, iconColor: "text-[#FF9900]" },
  { name: "Python", Icon: SiPython, iconColor: "text-[#FFD43B]" },
  { name: "Docker", Icon: SiDocker, iconColor: "text-[#2496ED]" },
];

type WorkItem = {
  id: string;
  company: string;
  logoUrl: string;
  techStack?: readonly string[];
};

export const workExperience: WorkItem[] = [
  {
    id: "anka-tech",
    company: "Anka Tech",
    logoUrl: "/images/anka.svg",
    techStack: [
      "React",
      "TypeScript",
      "Python",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "AWS",
    ],
  },
  {
    id: "audax-electronics",
    company: "Audax Electronics",
    logoUrl: "/images/audax.svg",
    techStack: ["React", "Node.js", "TypeScript", "Java", "MongoDB"],
  },
  {
    id: "soc",
    company: "SOC",
    logoUrl: "/images/soc.svg",
  },
];

export const education = [
  {
    id: "rocketseat",
    institution: "Rocketseat",
    logoUrl: "/images/rocketseat.svg",
  },
  {
    id: "unisantos",
    institution: "Unisantos",
    logoUrl: "/images/unisantos.svg",
  },
] as const;

export const portfolioProjects = [
  {
    id: "rpgforge-ai",
    heading: "RPGForge AI",
    imageUrl: "/projects/rpgforge-ai.webp",
    techStack: [
      "TypeScript",
      "Next.js",
      "NestJS",
      "RAG",
      "pgvector",
      "Structured Outputs",
    ],
    liveDemoUrl: "https://rpgforge-ai.vercel.app",
    sourceCodeUrl: "https://github.com/guilhermedkdk/rpgforge-ai",
  },
  {
    id: "manga-stars",
    heading: "Manga Stars",
    imageUrl: "/projects/manga-stars.webp",
    techStack: ["TypeScript", "React", "Next.js", "Prisma", "PostgreSQL"],
    liveDemoUrl: "https://manga-stars.vercel.app",
    sourceCodeUrl: "https://github.com/guilhermedkdk/manga-stars",
  },
] as const;
