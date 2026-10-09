/** Shimmering surface of the page's primary actions, lighter on hover. */
export const shinySurface =
  "animate-button border-dark-700 rounded-md border bg-[linear-gradient(110deg,#1A1A1A,45%,#262626,55%,#1A1A1A)] bg-[length:200%_100%] hover:bg-[linear-gradient(110deg,#262626,45%,#404040,55%,#262626)]";

/** Outlined surface of the secondary actions next to a shiny one. */
export const outlineSurface =
  "border-dark-400 bg-dark-100 hover:bg-dark-300 rounded-md border text-white/80 transition-colors duration-200 hover:text-white";

/** Hairline border crossed by the same light as the shiny surface, pausing between passes; lighter on hover. */
export const shinyBorder =
  "animate-border-shimmer bg-stone-200/16 bg-[linear-gradient(110deg,transparent_42%,rgb(255_255_255/0.75)_50%,transparent_58%)] bg-[length:250%_100%] bg-no-repeat p-px transition-colors duration-300 hover:bg-stone-200/40";
