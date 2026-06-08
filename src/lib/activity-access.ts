import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export const ACTIVITIES_ACCESS_COOKIE_NAME = "bsj-activities-access";
export const ACTIVITIES_ACCESS_MAX_AGE = 60 * 60 * 12;

const ACCESS_MARKER_PAYLOAD = "bsj-activities-access:v1";

function getConfiguredPassword() {
  const password = process.env.BSJ_ACTIVITIES_PASSWORD;

  if (!password || password.trim().length === 0) {
    throw new Error("Missing BSJ_ACTIVITIES_PASSWORD environment variable.");
  }

  return password.trim();
}

function normalizeValue(value: string) {
  return value.trim().toLocaleLowerCase("de-CH");
}

function createAccessToken() {
  return createHmac("sha256", getConfiguredPassword()).update(ACCESS_MARKER_PAYLOAD).digest("hex");
}

function safeTokenMatch(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

export function isCorrectActivitiesPassword(answer: string) {
  return normalizeValue(answer) === normalizeValue(getConfiguredPassword());
}

export async function hasActivitiesAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACTIVITIES_ACCESS_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return safeTokenMatch(token, createAccessToken());
}

export async function grantActivitiesAccess() {
  const cookieStore = await cookies();

  cookieStore.set(ACTIVITIES_ACCESS_COOKIE_NAME, createAccessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACTIVITIES_ACCESS_MAX_AGE,
    path: "/"
  });
}
