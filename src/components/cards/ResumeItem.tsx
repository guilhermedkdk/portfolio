import Image from "next/image";

import TechStack from "../ui/TechStack";

/** One entry of the about section's work and education timelines. */
export default function ResumeItem({
  title,
  org,
  period,
  logoUrl,
  description,
  techStack,
}: {
  title: string;
  org: string;
  period: string;
  logoUrl: string;
  description?: string;
  techStack?: readonly string[];
}) {
  // Logos carry their own brand background, so they fill the tile edge to edge.
  // Empty alt: the org name is already in the heading next to it.
  // The rail under each logo runs down to the next entry's, so the last has none.
  // Below sm the logo moves beside the heading and the org joins the period
  // line, so the text gets the full width instead of a column beside the rail.
  // There the header scales with the viewport, logo and text in one proportion,
  // so the longest role stays on one line down to 320px.
  return (
    <li className="group flex gap-4 sm:gap-5">
      <div className="flex shrink-0 flex-col items-center max-sm:hidden">
        <Image
          src={logoUrl}
          alt=""
          width={44}
          height={44}
          className="size-11 rounded"
        />
        <span
          aria-hidden
          className="my-1.5 w-px grow bg-stone-200/15 group-last:hidden"
        />
      </div>

      <div className="min-w-0 flex-1 pb-9 group-last:pb-0">
        <div className="flex items-center gap-3 max-sm:mb-2.5 max-sm:text-[clamp(0.9375rem,calc((100vw-3.75rem)/17),1.125rem)]">
          <Image
            src={logoUrl}
            alt=""
            width={40}
            height={40}
            className="size-[2.22em] shrink-0 rounded sm:hidden"
          />
          <div className="min-w-0">
            <h4 className="text-lg font-medium text-stone-200 max-sm:text-[1em]">
              {title}
              <span className="max-sm:hidden"> - {org}</span>
            </h4>
            <p className="text-sm text-stone-200/50 max-sm:text-[0.78em]">
              <span className="sm:hidden">{org} · </span>
              {period}
            </p>
          </div>
        </div>

        {description && (
          <p className="mt-2.5 max-w-prose leading-relaxed text-stone-200/70">
            {description}
          </p>
        )}
        {techStack && <TechStack items={techStack} className="mt-2.5" />}
      </div>
    </li>
  );
}
