import assert from "node:assert/strict";
import { test } from "node:test";

const base = process.env.SEO_TEST_BASE || "http://localhost:3000";

async function get(path) {
  const response = await fetch(new URL(path, base), {
    headers: { "user-agent": "Googlebot", "accept-language": "en" },
    redirect: "manual",
  });
  return { response, body: await response.text() };
}

test("homepage exposes canonical and social metadata to crawlers", async () => {
  const { response, body } = await get("/");
  assert.equal(response.status, 200);
  assert.match(body, /<link rel="canonical" href="[^"]+"/);
  assert.match(body, /<meta property="og:title" content="[^"]+"/);
  assert.match(body, /<meta property="og:description" content="[^"]+"/);
  assert.match(body, /<meta name="twitter:card" content="summary"/);
  const json = body.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  assert.ok(json, "website structured data is present");
  const website = JSON.parse(json[1]);
  assert.equal(website["@type"], "WebSite");
  assert.equal(website.name, "Purels");
  assert.equal(website.url, new URL("/", base).href);
});

test("Chinese homepage metadata matches the rendered language", async () => {
  const response = await fetch(new URL("/", base), { headers: { "user-agent": "Googlebot", "accept-language": "zh-CN" } });
  const body = await response.text();
  assert.match(body, /<html[^>]* lang="zh-CN"/);
  assert.match(body, /<meta property="og:locale" content="zh_CN"/);
  assert.match(body, /<meta property="og:title" content="Purels[^\"]*自托管/);
});

test("sitemap lists the public homepage", async () => {
  const { response, body } = await get("/sitemap.xml");
  assert.equal(response.status, 200);
  assert.ok(body.includes(`<loc>${new URL("/", base).href}</loc>`));
  for (const path of ["/i18n/en", "/i18n/zh-CN"]) {
    assert.ok(body.includes(`<loc>${new URL(path, base).href}</loc>`), path);
  }
});

test("localized homepages are stable despite conflicting cookies and language headers", async () => {
  for (const [path, locale, opposite, title] of [
    ["/i18n/en", "en", "zh-CN", "Self-Hosted URL Shortener"],
    ["/i18n/zh-CN", "zh-CN", "en", "自托管短链接"],
  ]) {
    const response = await fetch(new URL(path, base), {
      headers: { "user-agent": "Googlebot", "accept-language": opposite, cookie: `purels_locale=${opposite}` },
    });
    const body = await response.text();
    assert.equal(response.status, 200, path);
    assert.match(body, new RegExp(`<html[^>]* lang="${locale}"`));
    assert.ok(body.includes(title), path);
    assert.ok(body.includes(`<link rel="canonical" href="${new URL(path, base).href}"`));
    for (const [language, target] of [["en", "/i18n/en"], ["zh-CN", "/i18n/zh-CN"], ["x-default", "/"]]) {
      const url = target === "/" ? new URL(base).origin : new URL(target, base).href;
      assert.ok(body.toLowerCase().includes(`hreflang="${language}" href="${url}"`.toLowerCase()), `${path}: ${language}`);
    }
    assert.ok(body.includes('href="/i18n/en"') && body.includes('href="/i18n/zh-CN"'));
  }
});

test("account and console pages can be crawled and request no indexing", async () => {
  const { body: robots } = await get("/robots.txt");
  assert.doesNotMatch(robots, /Disallow: \/(?:home|login|register)(?:\s|$)/);
  assert.match(robots, /Disallow: \/api\//);
  for (const path of ["/login", "/register", "/home", "/home/settings"]) {
    const { response, body } = await get(path);
    assert.equal(response.status, 200, path);
    assert.match(body, /<meta name="robots" content="noindex(?:,|\")/, path);
  }
});
