import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { resolveLocale, routing } from "@/i18n/routing";
import { siteConfig, skillItems } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.name;

// The hero's 56px grid at 12%, uniform: picked over the hero's own 17% and
// over a fade toward the edges.
const GRID_LINE = "rgba(255,255,255,0.12)";

// The site's own faces: the generator's default font has no bold and reads
// as a different brand.
const fontsDir = join(process.cwd(), "src/assets/fonts");
const bricolageBold = readFile(join(fontsDir, "BricolageGrotesque-Bold.ttf"));
const figtreeMedium = readFile(join(fontsDir, "Figtree-Medium.ttf"));

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Messages are read straight from the JSON: image generation runs outside the
// request scope that `getTranslations` needs.
async function getMessages(locale: string) {
  return (await import(`../../../messages/${resolveLocale(locale)}.json`))
    .default;
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  // Colours are the page's: stone-200 for the name, its 50% over the page
  // background for the muted half of the two-tone headline.
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 80px",
        background: "#0A0A0A",
        backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        fontFamily: "Figtree",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#A3A3A3",
          letterSpacing: 5,
        }}
      >
        {messages.Hero.location.toUpperCase()}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 20,
          fontFamily: "Bricolage Grotesque",
          fontSize: 92,
          lineHeight: 1.05,
          letterSpacing: -3,
        }}
      >
        <span style={{ color: "#E7E5E4" }}>{siteConfig.name}</span>
        <span style={{ color: "#797877" }}>{messages.Meta.role}</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 44,
          fontSize: 28,
          color: "#A3A3A3",
        }}
      >
        {skillItems.map(({ name }) => name).join("  /  ")}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: await bricolageBold,
          weight: 700,
        },
        { name: "Figtree", data: await figtreeMedium, weight: 500 },
      ],
    },
  );
}
