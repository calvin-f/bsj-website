import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getAllActivities, type Activity } from "@/src/lib/activities";

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">
            BSJ
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            Bündnis Sybille Jeker
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Ein öffentliches Bündnis für Austausch, Beschlüsse und gemeinsame Aktivitäten.
          </p>
        </div>
        <div className="max-w-sm rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Auftakt</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Die Startseite schafft die Grundlage für künftige Protokolle, Beschlüsse und öffentliche Termine.
          </p>
        </div>
      </div>
    </section>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function EmptyActivitiesState() {
  return (
    <div className="mt-10 rounded-[2rem] border border-dashed border-white/15 bg-slate-950/40 p-8 shadow-[0_30px_80px_rgba(3,7,18,0.35)] sm:p-10">
      <div className="flex flex-col gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-200">
          BSJ
        </span>
        <h3 className="text-xl font-medium text-white">Noch keine Aktivitäten veröffentlicht.</h3>
        <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Sobald erste Inhalte vorliegen, werden sie hier in klarer chronologischer Form eingebunden.
        </p>
      </div>
    </div>
  );
}

function ActivityCard({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  return (
    <article className="relative pl-8 sm:pl-10">
      <div className="absolute left-0 top-1.5 flex w-8 justify-center sm:w-10">
        <span className="h-3.5 w-3.5 rounded-full border border-emerald-300/60 bg-emerald-300 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
      </div>
      {!isLast ? <div className="absolute left-[0.93rem] top-6 h-[calc(100%+2.5rem)] w-px bg-white/10 sm:left-[1.2rem]" /> : null}

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-[0_30px_80px_rgba(3,7,18,0.35)] backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <time dateTime={`${activity.date}T${activity.time}`}>{formatDate(activity.date)}</time>
              <span aria-hidden="true" className="hidden text-slate-600 sm:inline">
                •
              </span>
              <span>{activity.time} Uhr</span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                {activity.type}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">{activity.title}</h3>
            {activity.location ? <p className="mt-2 text-sm text-slate-400">Ort: {activity.location}</p> : null}
          </div>
        </div>

        {activity.summary ? (
          <p className="mt-5 text-base leading-7 text-slate-300">{activity.summary}</p>
        ) : null}

        {activity.image ? (
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/60">
            <Image
              src={activity.image}
              alt={activity.title}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        {activity.body ? (
          <div className="activity-markdown mt-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activity.body}</ReactMarkdown>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ActivitiesTimeline({ activities }: { activities: Activity[] }) {
  return (
    <div className="mt-10 flex flex-col gap-10">
      {activities.map((activity, index) => (
        <ActivityCard
          key={activity.slug}
          activity={activity}
          isLast={index === activities.length - 1}
        />
      ))}
    </div>
  );
}

function ActivitiesSection({ activities }: { activities: Activity[] }) {
  return (
    <section id="aktivitaeten" className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-200/80">Übersicht</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Aktivitäten
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Hier erscheinen künftig Protokolle, Beschlüsse, Treffen und weitere veröffentlichte Aktivitäten des Bündnisses.
          </p>
        </div>

        {activities.length > 0 ? <ActivitiesTimeline activities={activities} /> : <EmptyActivitiesState />}
      </div>
    </section>
  );
}

export default async function Home() {
  const activities = await getAllActivities();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ActivitiesSection activities={activities} />
    </main>
  );
}
