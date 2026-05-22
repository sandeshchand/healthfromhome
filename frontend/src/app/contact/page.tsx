import Link from "next/link"
import { Clock3, Mail, MapPin, MessageSquare, PhoneCall, type LucideIcon } from "lucide-react"
import { PageShell } from "@/components/page-shell"

export default function ContactPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="decorative-grid rounded-lg border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-sky-50 p-6 shadow-sm shadow-emerald-900/10">
          <p className="text-sm font-semibold text-emerald-700">Support</p>
          <h1 className="mt-2 text-3xl font-semibold">Contact HealthFromHome</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Use this page for MVP support, booking questions, and admin follow-up. For emergencies, contact local emergency services directly.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <ContactCard icon={Mail} title="Email support" text="support@healthfromhome.local" />
          <ContactCard icon={PhoneCall} title="Phone support" text="Add pilot support number before launch" />
          <ContactCard icon={MapPin} title="Service region" text="Kathmandu Valley pilot coverage" />
          <ContactCard icon={Clock3} title="Response time" text="Manual admin response during configured support hours" />
        </section>

        <section className="soft-panel mt-8 rounded-lg p-6">
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <MessageSquare className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Before the pilot launch</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                Replace the placeholder email and phone number with the real support channel. Also define who checks incoming requests, how quickly they respond, and when a booking should be escalated to a phone call.
              </p>
              <Link
                href="/emergency-disclaimer"
                className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Read emergency disclaimer
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  )
}

function ContactCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <article className="color-card rounded-lg p-5">
      <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-700 text-white">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </article>
  )
}
