import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { IoDocumentText, IoPaperPlane } from "react-icons/io5";

import { cvByLocale, siteConfig } from "@/lib/constants";

import Avatar from "./Avatar";
import SkillSpotlight from "./SkillSpotlight";
import RippleGrid from "./ui/RippleGrid";
import ShinyLink from "./ui/ShinyLink";

export default function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  // Padding stays equal top and bottom so the content sits at the viewport's
  // centre at every width; uneven padding shifted it where the values changed.
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center py-30 text-center sm:py-32">
      <RippleGrid className="animate-fade-in absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2" />

      <div className="animate-enter mb-2 flex items-center gap-4">
        <Avatar
          alt={t("photoAlt")}
          label={t("greetLabel")}
          lines={[
            t("greetings.cv"),
            t("greetings.hello"),
            t("greetings.project"),
          ]}
        />
        <div className="flex flex-col items-start">
          <p className="text-lg font-semibold text-white sm:text-xl">
            {siteConfig.name}
          </p>
          <span className="flex items-center gap-1">
            <Image
              src="/flags/brazil.svg"
              alt=""
              width={24}
              height={17}
              className="rounded-sm"
              aria-hidden
            />
            <span className="text-sm text-neutral-400">{t("location")}</span>
          </span>
        </div>
      </div>

      <h1
        style={{ animationDelay: "100ms" }}
        className="animate-enter font-display mb-8 text-4xl font-bold tracking-[-0.04em] text-balance text-white sm:text-5xl md:text-6xl lg:text-7xl xl:[@media(min-height:50rem)]:text-8xl"
      >
        {t("titleLine1")}
        <br />
        {t("titleLine2")}
      </h1>

      <div
        style={{ animationDelay: "200ms" }}
        className="animate-enter flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
      >
        <a
          href={cvByLocale[locale]}
          download
          className="group flex items-center gap-2.5 focus-visible:outline-offset-4"
        >
          <IoDocumentText size={20} aria-hidden />
          <span className="font-medium text-white transition duration-200 group-hover:opacity-70">
            {t("downloadCv")}
          </span>
        </a>

        <ShinyLink href={`mailto:${siteConfig.email}`} icon={<IoPaperPlane />}>
          {t("contact")}
        </ShinyLink>
      </div>

      <div className="mt-20 flex flex-col items-center gap-7">
        <SkillSpotlight label={t("experienceWith")} />
      </div>
    </section>
  );
}
