import { useTranslations } from "next-intl";
import { IoBriefcaseOutline, IoSchoolOutline } from "react-icons/io5";

import { education, workExperience } from "@/lib/constants";

import ResumeItem from "./cards/ResumeItem";
import ResumeTabs from "./ResumeTabs";
import GradientHeading from "./ui/GradientHeading";
import Reveal from "./ui/Reveal";
import TwoToneHeading, { twoToneTags } from "./ui/TwoToneHeading";

export default function About() {
  const t = useTranslations("About");

  // Phones get a two-sentence summary; the full one runs to seven centred lines
  // there. Below sm the headline scales with the viewport to stay on three lines.
  return (
    <section id="experience" className="scroll-mt-20 py-16 sm:py-20">
      <Reveal from="above">
        <TwoToneHeading className="mx-auto max-w-2xl text-center text-[clamp(1.25rem,calc((100vw-3rem)*0.077),1.5rem)] sm:text-4xl">
          {t.rich("headline", twoToneTags)}
        </TwoToneHeading>
      </Reveal>
      <Reveal from="above" delay={0.15}>
        <p className="mx-auto mt-6 max-w-5xl text-center leading-relaxed text-stone-200/70 max-sm:hidden">
          {t("text")}
        </p>
        <p className="mt-6 text-center leading-relaxed text-stone-200/70 sm:hidden">
          {t("textShort")}
        </p>
      </Reveal>

      <ResumeTabs
        heading={
          <GradientHeading as="h3">{t("experience.title")}</GradientHeading>
        }
        label={t("experience.title")}
        tabs={[
          {
            id: "work",
            label: t("tabs.work"),
            icon: <IoBriefcaseOutline className="block size-4.5" />,
            content: (
              <ul>
                {workExperience.map((job) => {
                  // An entry shows a summary only once its copy is written.
                  const descriptionKey = `experience.${job.id}.description`;
                  return (
                    <ResumeItem
                      key={job.id}
                      title={t(`experience.${job.id}.role`)}
                      org={job.company}
                      period={t(`experience.${job.id}.period`)}
                      logoUrl={job.logoUrl}
                      description={
                        t.has(descriptionKey) ? t(descriptionKey) : undefined
                      }
                      techStack={job.techStack}
                    />
                  );
                })}
              </ul>
            ),
          },
          {
            id: "education",
            label: t("tabs.education"),
            icon: <IoSchoolOutline className="block size-4.5" />,
            content: (
              <ul>
                {education.map((item) => (
                  <ResumeItem
                    key={item.id}
                    title={t(`education.${item.id}.course`)}
                    org={item.institution}
                    period={t(`education.${item.id}.period`)}
                    logoUrl={item.logoUrl}
                  />
                ))}
              </ul>
            ),
          },
        ]}
      />
    </section>
  );
}
