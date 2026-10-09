import "@/styles/globals.css";

import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { resolveLocale, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";

// Display carries the voice in headings; Figtree holds the reading copy.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

// Reveal is server-rendered hidden and waits for hydration to fade in; without
// JS it would stay hidden for good.
const noscriptRevealFallback =
  "[data-reveal]{opacity:1!important;transform:none!important}";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "Meta" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s - ${siteConfig.name}`,
    },
    description,
    keywords: [
      "desenvolvedor fullstack",
      "fullstack developer",
      "TypeScript",
      "Node.js",
      "React",
      "Next.js",
      "Java",
      "Spring Boot",
      "AWS",
      "São Paulo",
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    alternates: {
      canonical: `/${locale}`,
      languages: { pt: "/pt", en: "/en" },
    },
    openGraph: {
      type: "website",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${bricolage.variable} ${figtree.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <noscript>
          <style>{noscriptRevealFallback}</style>
        </noscript>
      </body>
    </html>
  );
}
