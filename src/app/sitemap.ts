import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://nailpro.leonardocamargo.dev.br/",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
