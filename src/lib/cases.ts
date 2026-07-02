import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/types";

export type CaseMeta = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  tags: string[];
  href?: string;
};

const casesDirectory = path.join(process.cwd(), "content/cases");

function resolveCaseFilePath(slug: string, locale: Locale): string | null {
  const localizedPath = path.join(casesDirectory, `${slug}.${locale}.mdx`);
  if (locale !== "en" && fs.existsSync(localizedPath)) {
    return localizedPath;
  }

  const defaultPath = path.join(casesDirectory, `${slug}.mdx`);
  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }

  return null;
}

function parseCaseMeta(slug: string, filePath: string): CaseMeta {
  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);

  return {
    slug,
    title: data.title as string,
    subtitle: data.subtitle as string,
    year: data.year as string,
    tags: (data.tags as string[]) ?? [],
    href: data.href as string | undefined,
  };
}

export function getCaseSlugs(): string[] {
  if (!fs.existsSync(casesDirectory)) return [];
  return fs
    .readdirSync(casesDirectory)
    .filter((file) => file.endsWith(".mdx") && !file.match(/\.(en|ru)\.mdx$/))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getCaseMeta(slug: string, locale: Locale = "en"): CaseMeta {
  const filePath = resolveCaseFilePath(slug, locale);
  if (!filePath) {
    throw new Error(`Case not found: ${slug}`);
  }

  return parseCaseMeta(slug, filePath);
}

export function getAllCases(locale: Locale = "en"): CaseMeta[] {
  return getCaseSlugs().map((slug) => getCaseMeta(slug, locale));
}

export function getCaseContent(
  slug: string,
  locale: Locale = "en",
): {
  meta: CaseMeta;
  content: string;
} {
  const filePath = resolveCaseFilePath(slug, locale);
  if (!filePath) {
    throw new Error(`Case not found: ${slug}`);
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  return {
    meta: {
      slug,
      title: data.title as string,
      subtitle: data.subtitle as string,
      year: data.year as string,
      tags: (data.tags as string[]) ?? [],
      href: data.href as string | undefined,
    },
    content,
  };
}
