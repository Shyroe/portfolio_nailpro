import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = "https://nailpro.leonardocamargo.dev.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
