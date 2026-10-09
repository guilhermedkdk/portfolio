import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoLogoGithub, IoLogoLinkedin, IoMail } from "react-icons/io5";

import avatarSmall from "@/assets/avatar-small.png";
import CopyButton from "@/components/ui/CopyButton";
import Reveal from "@/components/ui/Reveal";
import StarrySky from "@/components/ui/StarrySky";
import { outlineSurface, shinySurface } from "@/components/ui/surfaces";
import TwoToneHeading, { twoToneTags } from "@/components/ui/TwoToneHeading";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Footer() {
  const t = useTranslations("Footer");
  const tMeta = useTranslations("Meta");

  const profiles = [
    {
      name: "GitHub",
      handle: `@${siteConfig.githubUser}`,
      href: siteConfig.github,
      Icon: IoLogoGithub,
    },
    {
      name: "LinkedIn",
      handle: `in/${siteConfig.linkedinUser}`,
      href: siteConfig.linkedin,
      Icon: IoLogoLinkedin,
    },
  ];

  // The sky spans the viewport and fades in over 5rem, so the page darkens
  // into it just above the heading instead of meeting a box edge.
  // The contacts never wrap: below lg the profiles drop to icons, on phones
  // the address truncates (the copy button still has it whole), below 320px it
  // turns sr-only, and below 300px every square steps down to 40px.
  return (
    <footer
      id="contact"
      className="relative mx-auto w-full max-w-7xl scroll-mt-20 pt-16 sm:pt-20"
    >
      <StarrySky className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 mask-[linear-gradient(to_bottom,transparent,black_5rem)]" />

      <Reveal>
        <TwoToneHeading className="max-w-3xl text-[clamp(1.375rem,calc((100vw-3rem)*0.084),1.875rem)] leading-[1.1] sm:text-5xl">
          {t.rich("headline", twoToneTags)}
        </TwoToneHeading>
      </Reveal>

      <Reveal
        delay={0.15}
        className="mt-8 flex gap-2 max-[300px]:gap-1 sm:gap-3 lg:gap-4"
      >
        <div
          className={cn(
            shinySurface,
            "flex h-12 min-w-0 flex-1 items-stretch max-[320px]:flex-none max-[300px]:h-10 sm:flex-none",
          )}
        >
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-l-md pr-3 pl-4 font-medium text-white max-[320px]:w-12 max-[320px]:flex-none max-[320px]:justify-center max-[320px]:px-0 max-[300px]:w-10 sm:pr-4 sm:pl-5"
          >
            <IoMail className="size-5 shrink-0" aria-hidden />
            <span className="truncate text-sm max-[320px]:sr-only sm:text-base">
              {siteConfig.email}
            </span>
          </a>
          <span aria-hidden className="bg-dark-700 my-3 w-px" />
          <CopyButton
            value={siteConfig.email}
            label={t("copyEmail")}
            copiedLabel={t("emailCopied")}
            failedLabel={t("copyFailed")}
            className="w-12 shrink-0 rounded-r-md max-[300px]:w-10"
          />
        </div>

        {profiles.map(({ name, handle, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              outlineSurface,
              "flex h-12 w-12 shrink-0 items-center justify-center gap-2.5 font-medium max-[300px]:size-10 lg:w-auto lg:justify-start lg:px-5",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className="text-sm max-lg:sr-only sm:text-base">
              <span className="sr-only">{name} </span>
              {handle}
            </span>
          </a>
        ))}
      </Reveal>

      <div className="mt-6">
        <div
          aria-hidden
          className="h-px bg-linear-to-r from-transparent via-stone-200/15 to-transparent"
        />
        <div className="flex items-center justify-between gap-4 py-6 text-sm">
          <div className="flex items-center gap-3">
            <Image
              src={avatarSmall}
              alt=""
              width={40}
              height={40}
              quality={90}
              // A tighter, silhouette-centred crop of the hero photo; the fill
              // keeps its dark hair off the page. Imported, not under public/,
              // so a new crop gets a new URL past the optimizer's cache.
              className="from-dark-700 to-dark-300 size-10 shrink-0 rounded-full bg-linear-to-b object-cover"
            />
            <div className="leading-snug">
              <p className="font-medium text-stone-200">{siteConfig.name}</p>
              <p className="text-stone-200/60">{tMeta("role")}</p>
            </div>
          </div>
          <p className="text-stone-200/60">
            {t("rights", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
