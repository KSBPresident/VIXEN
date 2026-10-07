import type { MetadataRoute } from "next";

const siteUrl = "https://vixen-production-package.vercel.app";
const publicRoutes = ["/", "/about", "/launch", "/creators", "/events", "/pricing", "/store"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicRoutes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
