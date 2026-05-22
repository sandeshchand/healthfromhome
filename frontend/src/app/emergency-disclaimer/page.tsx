import { AlertTriangle, PhoneCall, ShieldAlert } from "lucide-react"
import { PageShell } from "@/components/page-shell"

export default function EmergencyDisclaimerPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="decorative-grid rounded-lg border border-red-100 bg-gradient-to-br from-white via-red-50 to-orange-50 p-6 shadow-sm shadow-red-900/10">
          <p className="text-sm font-semibold text-red-700">Important safety notice</p>
          <h1 className="mt-2 text-3xl font-semibold">Not for emergencies</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            HealthFromHome is for planned, non-emergency care coordination only. It is not an ambulance, emergency room, or urgent medical response service.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="color-card rounded-lg p-5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-red-700 text-white">
              <PhoneCall className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">In an emergency</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Call local emergency services, contact the nearest hospital, or reach a local caregiver immediately. Do not wait for an app response.
            </p>
          </article>

          <article className="color-card rounded-lg p-5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-orange-600 text-white">
              <ShieldAlert className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Platform limits</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              The MVP cannot guarantee immediate provider availability, emergency transport, diagnosis, or continuous monitoring.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3 text-red-900">
            <AlertTriangle className="mt-1 size-5 shrink-0" aria-hidden="true" />
            <p className="text-sm leading-6">
              Before launch, add country-specific emergency contacts and make this warning visible anywhere a family requests service.
            </p>
          </div>
        </section>
      </main>
    </PageShell>
  )
}
