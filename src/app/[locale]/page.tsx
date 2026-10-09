import { getTranslations, setRequestLocale } from "next-intl/server";

import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import { resolveLocale } from "@/i18n/routing";

// The page is prerendered; a daily regeneration rolls the footer's year over
// without a deploy.
export const revalidate = 86400;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(resolveLocale(locale));
  const t = await getTranslations("Nav");

  // Horizontal overflow is clipped here rather than on <body>: mobile browsers
  // ignore body overflow when sizing the page, so anything poking past the edge
  // (the 100vw hero grid, reveals sliding in from the side) would widen it.
  return (
    <div className="relative flex flex-col overflow-x-clip px-6 sm:px-10">
      <a
        href="#main"
        className="bg-dark-200 sr-only rounded-lg px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-60"
      >
        {t("skipToContent")}
      </a>
      <Navbar />
      <main id="main" className="mx-auto w-full max-w-7xl">
        <Hero />
        <Projects />
        <About />
      </main>
      <Footer />
    </div>
  );
}
