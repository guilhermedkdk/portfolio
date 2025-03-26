import React from "react";

export default function ShinyButton({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button className="animate-button border-dark-700 relative inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 self-start rounded-md border bg-[linear-gradient(110deg,#1A1A1A,45%,#262626,55%,#1A1A1A)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors hover:bg-[linear-gradient(110deg,#262626,45%,#404040,55%,#262626)]">
      {children}
      {icon}
    </button>
  );
}
