import type { MetadataRoute } from "next";
import { requestOrigin } from "@/lib/request-origin";

/** See the note in robots.ts: this depends on the request host. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // No lastModified. This route is dynamic, so a timestamp read now would claim
  // the page changed on every request, which is worse than saying nothing.
  const origin = await requestOrigin();
  const languages = { en: `${origin}/i18n/en`, "zh-CN": `${origin}/i18n/zh-CN`, "x-default": `${origin}/` };
  return ["/", "/i18n/en", "/i18n/zh-CN"].map((path) => ({
    url: `${origin}${path}`,
    alternates: { languages },
  }));
}
