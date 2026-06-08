import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const ACTIVITIES_DIRECTORY = path.join(process.cwd(), "content", "activities");

export type ActivityType = "Sitzung" | "Beschluss" | "Protokoll" | "Mitteilung" | string;

export type Activity = {
  slug: string;
  title: string;
  date: string;
  time: string;
  type: ActivityType;
  location?: string;
  image?: string;
  summary?: string;
  body: string;
};

type ActivityFrontmatter = {
  title?: unknown;
  date?: unknown;
  time?: unknown;
  type?: unknown;
  location?: unknown;
  image?: unknown;
  summary?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function parseActivityFile(fileName: string, fileContents: string): Activity {
  const { data, content } = matter(fileContents);
  const frontmatter = data as ActivityFrontmatter;

  if (!isNonEmptyString(frontmatter.title)) {
    throw new Error(`Activity file ${fileName} is missing a valid title.`);
  }

  if (!isNonEmptyString(frontmatter.date)) {
    throw new Error(`Activity file ${fileName} is missing a valid date.`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date.trim())) {
    throw new Error(`Activity file ${fileName} must use an ISO date like 2026-06-06.`);
  }

  if (!isNonEmptyString(frontmatter.time)) {
    throw new Error(`Activity file ${fileName} is missing a valid time.`);
  }

  if (!/^\d{2}:\d{2}$/.test(frontmatter.time.trim())) {
    throw new Error(`Activity file ${fileName} must use a time like 23:45.`);
  }

  if (!isNonEmptyString(frontmatter.type)) {
    throw new Error(`Activity file ${fileName} is missing a valid type.`);
  }

  return {
    slug: fileName.replace(/\.md$/u, ""),
    title: frontmatter.title.trim(),
    date: frontmatter.date.trim(),
    time: frontmatter.time.trim(),
    type: frontmatter.type.trim(),
    location: normalizeOptionalString(frontmatter.location),
    image: normalizeOptionalString(frontmatter.image),
    summary: normalizeOptionalString(frontmatter.summary),
    body: content.trim()
  };
}

function compareActivitiesDescending(a: Activity, b: Activity): number {
  return `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`);
}

export async function getAllActivities(): Promise<Activity[]> {
  try {
    const directoryEntries = await fs.readdir(ACTIVITIES_DIRECTORY, { withFileTypes: true });

    const markdownFiles = directoryEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name);

    const activities = await Promise.all(
      markdownFiles.map(async (fileName) => {
        const filePath = path.join(ACTIVITIES_DIRECTORY, fileName);
        const fileContents = await fs.readFile(filePath, "utf8");

        return parseActivityFile(fileName, fileContents);
      })
    );

    return activities.sort(compareActivitiesDescending);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}
