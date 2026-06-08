import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getAllActivities, type Activity } from "@/src/lib/activities";

function Header() {
  return (
    <header className="border-b-2 border-zinc-950 bg-stone-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <a href="#top" className="inline-flex w-fit flex-col text-zinc-950">
          <span className="text-2xl font-black uppercase tracking-[-0.08em]">BSJ</span>
        </a>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-8">
          <nav aria-label="Hauptnavigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-700">
              <li>
                <a className="transition hover:text-zinc-950" href="#aktivitaeten">
                  Aktivitäten
                </a>
              </li>
              <li>
                <a className="transition hover:text-zinc-950" href="#beschluesse">
                  Beschlüsse
                </a>
              </li>
            </ul>
          </nav>
          <a
            href="#mitmachen"
            className="inline-flex w-fit items-center justify-center border-2 border-zinc-950 bg-red-700 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-stone-50 transition hover:bg-red-800"
          >
            Mitmachen
          </a>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="border-b-4 border-zinc-950 bg-red-700 text-stone-50">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-12 lg:py-20">
        <div>
          <h1 className="mt-5 text-7xl font-black uppercase leading-none tracking-[-0.1em] sm:text-8xl lg:text-[9rem]">
            BSJ
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-red-50 sm:text-xl">
            Ein öffentliches Bündnis für Austausch, Beschlüsse und gemeinsame Aktivitäten.
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

function ActivitiesSection({ activities }: { activities: Activity[] }) {
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

        {activities.length > 0 ? <ActivitiesTimeline activities={activities} /> : <EmptyActivitiesState />}
      </div>
    </section>
  );
}

function JoinSection() {
  return (
    <section id="mitmachen" className="border-b-2 border-zinc-950 bg-zinc-950 px-5 py-14 text-stone-50 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">Mitmachen</p>
          <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl">Mitmachen</h2>
          <p className="mt-4 text-base leading-7 text-zinc-300 sm:text-lg">
            Wer sich für die Arbeit des Bündnisses interessiert, kann Kontakt aufnehmen.
          </p>
        </div>
        <a
          href="#kontakt"
          className="inline-flex w-fit items-center justify-center border-2 border-stone-50 bg-stone-50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-950 transition hover:bg-transparent hover:text-stone-50"
        >
          Kontakt aufnehmen
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="kontakt" className="bg-stone-100 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 border-t-4 border-zinc-950 pt-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-3xl font-black uppercase tracking-[-0.08em] text-zinc-950">BSJ</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
            Öffentliche Informationen, Kontaktmöglichkeiten und rechtliche Angaben werden laufend ergänzt.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 sm:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Navigation</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-800">
              <li>
                <a className="hover:underline" href="#aktivitaeten">
                  Aktivitäten
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#kontakt">
                  Kontakt
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#impressum">
                  Impressum
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Kontakt</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">Kontaktangaben folgen.</p>
          </div>
          <div id="impressum">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Impressum</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">Angaben folgen.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default async function Home() {
  const activities = await getAllActivities();

  return (
    <main id="top" className="min-h-screen bg-stone-100 text-zinc-950">
      <Header />
      <HeroSection />
      <ActivitiesSection activities={activities} />
      <JoinSection />
      <Footer />
    </main>
  );
}
