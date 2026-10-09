import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 90 is for the footer avatar: at 40 px, 75 visibly smears a face.
  images: { qualities: [75, 90] },
};

export default withNextIntl(nextConfig);
