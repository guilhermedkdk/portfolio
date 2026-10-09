import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoGlobe, IoLogoGithub } from "react-icons/io5";

import { cn } from "@/lib/utils";

import ButtonLink from "../ui/ButtonLink";
import Reveal from "../ui/Reveal";
import { shinyBorder } from "../ui/surfaces";
import TechStack from "../ui/TechStack";

type Project = {
  id: string;
  heading: string;
  imageUrl: string;
  techStack: readonly string[];
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
};

/** One featured row of the projects section; `reversed` puts the image on the right. */
export default function ProjectItem({
  project,
  reversed = false,
}: {
  project: Project;
  reversed?: boolean;
}) {
  const t = useTranslations("Projects");
  const { id, heading, imageUrl, techStack, liveDemoUrl, sourceCodeUrl } =
    project;
  const imageHref = liveDemoUrl ?? sourceCodeUrl;

  // The image link repeats the first button, so it stays out of the tab order.
  // Alternating rows start their border light half a cycle apart, so two
  // cards never shine at once.
  // Phones get a one-sentence blurb, so the stacked text stays short under the image.
  // There the frame turns square and crops the 16:9 collage from its right edge,
  // where both collages keep their phone screens; sizes covers the ~1.78x zoom.
  return (
    <li className="py-12 first:pt-0 last:pb-0 sm:py-16">
      <Reveal
        from="above"
        className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
      >
        <div
          className={cn(
            shinyBorder,
            "rounded-[13px]",
            reversed && "[animation-delay:2s] lg:order-last",
          )}
        >
          <div className="bg-dark-100 relative aspect-video overflow-hidden rounded-xl max-sm:aspect-square">
            <Image
              src={imageUrl}
              fill
              sizes="(min-width: 1360px) 606px, (min-width: 1024px) 45vw, (min-width: 640px) 100vw, 178vw"
              alt={t("screenshotAlt", { project: heading })}
              className="object-cover max-sm:object-right"
            />

            {imageHref && (
              <a
                href={imageHref}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                aria-hidden
                className="absolute inset-0"
              />
            )}
          </div>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-balance text-stone-200 sm:text-2xl lg:text-3xl">
            {heading}
          </h3>
          <p className="mt-3 max-w-prose leading-relaxed text-stone-200/70 max-sm:hidden">
            {t(id)}
          </p>
          <p className="mt-3 leading-relaxed text-stone-200/70 sm:hidden">
            {t(`short.${id}`)}
          </p>

          <TechStack items={techStack} className="mt-5" />

          <div className="mt-6 flex flex-wrap gap-3">
            {liveDemoUrl && (
              <ButtonLink
                href={liveDemoUrl}
                Icon={IoGlobe}
                variant="shiny"
                ariaLabel={t("liveDemoAria", { project: heading })}
              >
                {t("liveDemo")}
              </ButtonLink>
            )}
            {sourceCodeUrl && (
              <ButtonLink
                href={sourceCodeUrl}
                Icon={IoLogoGithub}
                ariaLabel={t("sourceCodeAria", { project: heading })}
              >
                {t("sourceCode")}
              </ButtonLink>
            )}
          </div>
        </div>
      </Reveal>
    </li>
  );
}
