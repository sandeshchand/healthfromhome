import { LockKeyhole, ShieldCheck } from "lucide-react"
import { PageShell } from "@/components/page-shell"

const sections = [
  {
    title: "Information collected",
    text: "Family account details, patient profile details, booking requests, payment status, reminders, and admin-uploaded medical records may be stored for care coordination.",
  },
  {
    title: "How information is used",
    text: "The MVP uses this information to coordinate non-emergency services, show booking progress, and let the family view records connected to their own patients.",
  },
  {
    title: "Access control",
    text: "Family users can only view patients, bookings, reminders, and records connected to their own account. Admin users manage operational data through Django Admin.",
  },
  {
    title: "Before production",
    text: "Use production object storage, strict admin access rules, HTTPS, audit-friendly logging, and a reviewed legal privacy policy before storing real patient data.",
  },
]

export default function PrivacyPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="decorative-grid rounded-lg border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-sky-50 p-6 shadow-sm shadow-emerald-900/10">
          <p className="text-sm font-semibold text-emerald-700">Privacy draft</p>
          <h1 className="mt-2 text-3xl font-semibold">Privacy policy</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            This MVP privacy page explains the intended data handling model. It should be reviewed before a real pilot.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="color-card rounded-lg p-5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-700 text-white">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{section.text}</p>
            </article>
          ))}
        </section>

        <section className="soft-panel mt-8 rounded-lg p-6">
          <div className="flex gap-3">
            <LockKeyhole className="mt-1 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <p className="text-sm leading-6 text-zinc-600">
              Development and demo environments should not contain real patient data. Replace this draft with a legally reviewed privacy policy before production launch.
            </p>
          </div>
        </section>
      </main>
    </PageShell>
  )
}
