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
        </div>
      </div>
    </section>
  );
}

function ActivitiesSection() {
  return (
    <section id="aktivitaeten" className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-200/80">
            Übersicht
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Aktivitäten
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Hier erscheinen Protokolle, Beschlüsse und weitere veröffentlichte Aktivitäten des Bündnisses.
          </p>
        </div>

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
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ActivitiesSection />
    </main>
  );
}
