import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import ActivityAccessForm from "@/src/components/ActivityAccessForm";
import { hasActivitiesAccess } from "@/src/lib/activity-access";
import { getAllActivities, type Activity } from "@/src/lib/activities";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function EmptyActivitiesState() {
  return (
    <div className="mt-10 border-2 border-zinc-950 bg-white p-7 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Archiv</p>
      <h3 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-zinc-950">
        Noch keine Aktivitäten veröffentlicht.
      </h3>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
        Veröffentlichte Sitzungen, Beschlüsse und Protokolle werden hier in chronologischer Form erscheinen.
      </p>
    </div>
  );
}

function ActivityCard({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  return (
    <article className="relative pl-8 sm:pl-10">
      <div className="absolute left-0 top-2 flex w-8 justify-center sm:w-10">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-zinc-950 bg-red-700" />
      </div>
      {!isLast ? (
        <div className="absolute left-[0.93rem] top-6 h-[calc(100%+2.5rem)] w-0.5 bg-zinc-950/15 sm:left-[1.15rem]" />
      ) : null}

      <div className="border-2 border-zinc-950 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-zinc-950/15 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-700">
              <time dateTime={`${activity.date}T${activity.time}`} className="font-semibold text-zinc-950">
                {formatDate(activity.date)}
              </time>
              <span>{activity.time} Uhr</span>
              <span className="border border-zinc-950 bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-950">
                {activity.type}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-bold tracking-[-0.04em] text-zinc-950">{activity.title}</h3>
            {activity.location ? <p className="mt-2 text-sm text-zinc-600">Ort: {activity.location}</p> : null}
          </div>
        </div>

        {activity.summary ? (
          <p className="mt-5 text-base leading-7 text-zinc-800">{activity.summary}</p>
        ) : null}

        {activity.image ? (
          <div className="mt-6 overflow-hidden border-2 border-zinc-950 bg-stone-100">
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

export default async function ActivitiesSection() {
  const accessGranted = await hasActivitiesAccess();

  let activities: Activity[] = [];

  if (accessGranted) {
    activities = await getAllActivities();
  }

  return (
    <section id="aktivitaeten" className="border-b-2 border-zinc-950 bg-stone-200 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div id="beschluesse" className="mx-auto w-full max-w-6xl scroll-mt-28">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-600">Aktuell</p>
          <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em] text-zinc-950 sm:text-5xl">
            Aktivitäten
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg">
            Hier veröffentlicht das Bündnis künftig Sitzungen, Beschlüsse und Protokolle.
          </p>
        </div>

        {accessGranted ? (
          activities.length > 0 ? (
            <ActivitiesTimeline activities={activities} />
          ) : (
            <EmptyActivitiesState />
          )
        ) : (
          <ActivityAccessForm />
        )}
      </div>
    </section>
  );
}
