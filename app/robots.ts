import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.APP_URL || "http://localhost:3000";
  return {
    rules: [{ userAgent: "*", allow: ["/", "/c/"], disallow: ["/api/", "/admin", "/creator", "/member", "/checkout", "/login", "/signup", "/demo"] }],
    sitemap: `${base}/sitemap.xml`
  };
}
