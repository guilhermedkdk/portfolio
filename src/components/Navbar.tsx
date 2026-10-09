"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

import { usePathname, useRouter } from "@/i18n/navigation";
import { navItems, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

// GitHub and LinkedIn are also in the footer; leaving them out on mobile keeps
// the fixed bar to a single row. Below 320px the language flag goes too, since
// it would otherwise wrap under the links.
const desktopOnly = "hidden sm:block";

// Invisible touch area around targets smaller than a fingertip, sized so
// neighbours meet without overlapping at the tightest gaps.
const hitArea = "relative after:absolute after:-inset-x-1.5 after:-inset-y-3";

export default function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "pt" ? "en" : "pt";

  const handleLanguageToggle = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  // The top offset climbs 8 px per breakpoint instead of one 16 -> 40 px jump,
  // which read as a sudden gap opening between the bar and the hero. The hero
  // title also resizes at these breakpoints, so a bigger step would stack on it.
  return (
    <nav
      aria-label={t("label")}
      className="border-dark-700 bg-dark-200/90 fixed inset-x-4 top-4 z-50 mx-auto flex max-w-fit flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-lg border px-4 py-3 backdrop-blur-sm max-[375px]:gap-x-4 sm:inset-x-0 sm:top-6 sm:gap-x-12 sm:px-8 sm:py-4 md:top-8 lg:top-10"
    >
      <ul className="flex items-center gap-4 max-[375px]:gap-3 sm:gap-8">
        {navItems.map((navItem) => (
          <li key={navItem.key}>
            <a
              href={navItem.link}
              className={cn(
                hitArea,
                "text-sm font-medium text-white transition-opacity duration-200 hover:opacity-70 focus-visible:outline-offset-4 sm:text-base",
              )}
            >
              {t(navItem.key)}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 max-[320px]:hidden sm:gap-4">
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("github")}
          className={cn(
            desktopOnly,
            hitArea,
            "transition-opacity duration-200 hover:opacity-70 focus-visible:outline-offset-4",
          )}
        >
          <IoLogoGithub size={22} aria-hidden />
        </a>
        <a
          href={siteConfig.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("linkedin")}
          className={cn(
            desktopOnly,
            hitArea,
            "transition-opacity duration-200 hover:opacity-70 focus-visible:outline-offset-4",
          )}
        >
          <IoLogoLinkedin size={22} aria-hidden />
        </a>
        <span
          className={cn(desktopOnly, "h-3 w-0.5 bg-neutral-600")}
          aria-hidden
        />
        <button
          type="button"
          onClick={handleLanguageToggle}
          aria-label={t("switchLanguage")}
          className={cn(
            hitArea,
            "flex cursor-pointer items-center transition-[filter] duration-200 hover:saturate-0 focus-visible:outline-offset-4",
          )}
        >
          <Image
            src={locale === "pt" ? "/flags/brazil.svg" : "/flags/usa.svg"}
            alt=""
            width={30}
            height={21}
            className="h-5 w-auto rounded-sm"
            aria-hidden
          />
        </button>
      </div>
    </nav>
  );
}
