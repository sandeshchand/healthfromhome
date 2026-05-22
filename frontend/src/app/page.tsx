import Link from "next/link"
import { CheckCircle2, Clock3, FileText, MapPin, ShieldCheck, UserRoundCheck } from "lucide-react"
import { PageShell } from "@/components/page-shell"

const serviceHighlights = [
  "Nurse and clinician home visits",
  "Doctor appointment coordination",
  "Lab sample collection",
  "Non-emergency medical transport",
  "Medical records and family updates",
  "Manual payment and follow-up tracking",
]

const howItWorks = [
  "Create your family account",
  "Add your parent or patient profile",
  "Choose service, city, area, date, and time",
  "Admin reviews pricing and provider availability",
  "Track status and receive uploaded reports",
]

const trustItems = [
  { icon: ShieldCheck, title: "Admin-reviewed requests", text: "Every booking is reviewed before confirmation and provider assignment." },
  { icon: UserRoundCheck, title: "Family-first coordination", text: "Built for children abroad coordinating care for elderly parents in Nepal." },
  { icon: FileText, title: "Private records", text: "Reports are linked to the patient profile and shown only to the family account." },
]

export default function Home() {
  return (
    <PageShell>
      <main>
        <section className="bg-white">
          <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-7">
              <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                Kathmandu Valley care coordination
              </p>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                  Healthcare support for your parents, coordinated from anywhere.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                  HealthFromHome helps families abroad arrange non-emergency care, appointments,
                  home visits, lab collection, transport, reports, and status updates in Kathmandu Valley.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  View services and prices
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
                >
                  Create account
                </Link>
              </div>
              <p className="text-sm text-zinc-500">
                Prices shown are starting prices. Final confirmation happens after admin review.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
              <div className="rounded-lg bg-white p-5">
                <p className="text-sm font-semibold text-emerald-800">Today&apos;s care request</p>
                <h2 className="mt-2 text-2xl font-semibold">Nurse visit for parent in Kathmandu</h2>
                <div className="mt-5 space-y-4 text-sm text-zinc-700">
                  <InfoRow icon={MapPin} label="Coverage" value="Kathmandu, Lalitpur, Bhaktapur" />
                  <InfoRow icon={Clock3} label="Flow" value="Request, review, assign, update" />
                  <InfoRow icon={CheckCircle2} label="Status" value="Family can track progress online" />
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {serviceHighlights.slice(0, 4).map((service) => (
                  <div key={service} className="rounded-lg bg-white p-4 text-sm font-medium text-zinc-700">
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold">How it works</h2>
              <p className="mt-2 text-zinc-600">
                The product keeps the first MVP simple: families request care, admins coordinate safely.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {howItWorks.map((step, index) => (
                <div key={step} className="rounded-lg border border-zinc-200 bg-white p-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-sm font-medium text-zinc-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="grid gap-4 md:grid-cols-3">
              {trustItems.map((item) => (
                <article key={item.title} className="rounded-lg border border-zinc-200 p-5">
                  <item.icon className="size-6 text-emerald-700" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-lg bg-zinc-950 p-6 text-white">
              <h2 className="text-xl font-semibold">Ready to check available services?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                View starting prices first. When you book, we collect the patient details and admin confirms the request.
              </p>
              <Link
                href="/services"
                className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                Browse services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 text-emerald-700" aria-hidden="true" />
      <div>
        <p className="font-medium text-zinc-950">{label}</p>
        <p className="text-zinc-600">{value}</p>
      </div>
    </div>
  )
}
