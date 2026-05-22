import { ClipboardCheck } from "lucide-react"
import { PageShell } from "@/components/page-shell"

const terms = [
  "HealthFromHome coordinates non-emergency home care requests and admin follow-up.",
  "The platform does not provide emergency response, medical diagnosis, pharmacy fulfillment, or hospital treatment.",
  "Booking requests are reviewed by an admin before provider assignment or confirmation.",
  "Payments are tracked manually by admin during the MVP stage.",
  "Families should verify service details, pricing, and provider availability before relying on a booking.",
  "These draft terms must be reviewed and replaced before production launch.",
]

export default function TermsPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="decorative-grid rounded-lg border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-6 shadow-sm shadow-emerald-900/10">
          <p className="text-sm font-semibold text-emerald-700">Terms draft</p>
          <h1 className="mt-2 text-3xl font-semibold">Terms of service</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            These terms describe the MVP operating model and should be reviewed before a public pilot.
          </p>
        </section>

        <section className="soft-panel mt-8 rounded-lg p-6">
          <div className="space-y-4">
            {terms.map((term) => (
              <div key={term} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <ClipboardCheck className="size-4" aria-hidden="true" />
                </span>
                <p className="text-sm leading-6 text-zinc-700">{term}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
