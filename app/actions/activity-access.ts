"use server";

import { revalidatePath } from "next/cache";

import { grantActivitiesAccess, isCorrectActivitiesPassword } from "@/src/lib/activity-access";

export type ActivityAccessState = {
  error: string | null;
  success: boolean;
};

export async function requestActivitiesAccess(
  _previousState: ActivityAccessState,
  formData: FormData
): Promise<ActivityAccessState> {
  const answer = formData.get("answer");

  if (typeof answer !== "string" || !isCorrectActivitiesPassword(answer)) {
    return {
      error: "Der eingegebene Name ist nicht korrekt.",
      success: false
    };
  }

  await grantActivitiesAccess();
  revalidatePath("/");

  return {
    error: null,
    success: true
  };
}
