import type { MetadataRoute } from "next";

const siteUrl = "https://vixen-production-package.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/admin/", "/api/", "/auth/", "/creator/studio/", "/member-preview/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
