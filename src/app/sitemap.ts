import type { MetadataRoute } from "next";
import { getAllModels } from "@/lib/data";
import { getAllListSlugs } from "@/lib/lists";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const models = getAllModels();
  const listSlugs = getAllListSlugs();

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/recommend`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Individual model pages
  for (const model of models) {
    entries.push({
      url: `${siteConfig.url}/models/${model.id}`,
      lastModified: new Date(model.lastUpdated),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Comparison pages (top model pairs)
  for (let i = 0; i < Math.min(models.length, 10); i++) {
    for (let j = i + 1; j < Math.min(models.length, 10); j++) {
      entries.push({
        url: `${siteConfig.url}/compare/${models[i].id}-vs-${models[j].id}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // List pages
  for (const slug of listSlugs) {
    entries.push({
      url: `${siteConfig.url}/lists/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return entries;
}
