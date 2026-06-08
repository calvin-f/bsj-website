"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import {
  requestActivitiesAccess,
  type ActivityAccessState
} from "@/app/actions/activity-access";

const initialState: ActivityAccessState = {
  error: null,
  success: false
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center border-2 border-zinc-950 bg-red-700 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-50 transition hover:bg-red-800 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      disabled={pending}
    >
      {pending ? "Prüfung läuft" : "Zugriff prüfen"}
    </button>
  );
}

export default function ActivityAccessForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(requestActivitiesAccess, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className="mt-10 border-2 border-zinc-950 bg-white p-7 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Interner Bereich</p>
        <label htmlFor="activities-answer" className="mt-3 block text-lg font-bold leading-8 text-zinc-950">
          Um Zugriff auf die internen Beschlüsse und Protokolle zu erhalten: Wie lautet der Vorname des Präsidenten des BSJ?
        </label>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
          <input
            id="activities-answer"
            name="answer"
            type="text"
            autoComplete="off"
            required
            className="min-h-12 flex-1 border-2 border-zinc-950 bg-stone-50 px-4 py-3 text-base text-zinc-950 outline-none transition focus:bg-white"
          />
          <SubmitButton />
        </div>
        {state.error ? (
          <p className="mt-4 text-sm font-medium text-red-700" aria-live="polite">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
