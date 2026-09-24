import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Static export for the Cloudflare Workers assets deploy (`wrangler.jsonc`
  // publishes ./out). A static export has no Next image optimizer, so
  // `next/image` runs unoptimized and every source points at a pre-generated
  // WebP derivative produced by
  // `scripts/build/generate-image-derivatives.mjs` (ImageMagick, no runtime
  // image service and no new dependency).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
