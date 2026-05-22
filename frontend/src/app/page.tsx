import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Home as HomeIcon,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  TestTube2,
  Truck,
  UserRoundCheck,
} from "lucide-react"
import { PageShell } from "@/components/page-shell"

const serviceHighlights = [
  { icon: HeartPulse, title: "Nurse home visit", text: "Request a nurse visit for elderly care support at home." },
  { icon: Stethoscope, title: "Doctor appointment", text: "Coordinate hospital or clinic appointments with admin support." },
  { icon: TestTube2, title: "Lab collection", text: "Arrange sample collection and later view uploaded reports." },
  { icon: Truck, title: "Medical transport", text: "Coordinate non-emergency pickup and hospital transport." },
]

const howItWorks = [
  "Create your family account",
  "Add your parent or patient profile",
  "Choose service, city, area, date, and time",
  "Admin reviews price and provider availability",
  "Track status, reminders, payments, and reports",
]

const trustItems = [
  { icon: ShieldCheck, title: "Admin-reviewed requests", text: "Every booking is reviewed before confirmation and provider assignment." },
  { icon: UserRoundCheck, title: "Family-first coordination", text: "Built for children abroad coordinating care for elderly parents in Nepal." },
  { icon: FileText, title: "Private records", text: "Reports are linked to the patient profile and shown only to the family account." },
]

const faqs = [
  {
    question: "Is this an emergency service?",
    answer: "No. HealthFromHome is for non-emergency care coordination. For emergencies, families should contact local emergency services or a hospital directly.",
  },
  {
    question: "Can I see prices before registering?",
    answer: "Yes. Starting prices are public on the Services page. Final pricing is confirmed after admin review.",
  },
  {
    question: "Who updates the booking status?",
    answer: "The internal admin team reviews requests, assigns providers, updates payment status, uploads reports, and marks follow-ups.",
  },
  {
    question: "Can family members abroad track care?",
    answer: "Yes. The family dashboard shows bookings, status, records, reminders, and account details.",
  },
]

export default function Home() {
  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#ecfdf5_0%,#f0fdfa_46%,#e0f2fe_100%)]">
          <div className="decorative-grid absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative space-y-7">
              <p className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-semibold text-emerald-800 shadow-sm">
                Kathmandu Valley care coordination
              </p>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                  Healthcare support for your parents, coordinated from anywhere.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                  HealthFromHome helps families abroad arrange non-emergency care, appointments,
                  home visits, lab collection, transport, reports, reminders, and status updates in Kathmandu Valley.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
                >
                  View services and prices
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg border border-emerald-200 bg-white/85 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-white"
                >
                  Create family account
                </Link>
              </div>
              <div className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
                <MiniTrust icon={ShieldCheck} text="Admin reviewed" />
                <MiniTrust icon={MapPin} text="Kathmandu Valley" />
                <MiniTrust icon={FileText} text="Private records" />
              </div>
            </div>

            <div className="relative rounded-lg border border-emerald-100 bg-white/75 p-6 shadow-xl shadow-emerald-900/10 backdrop-blur">
              <div className="rounded-lg border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-5">
                <p className="text-sm font-semibold text-emerald-800">Example care request</p>
                <h2 className="mt-2 text-2xl font-semibold">Nurse visit for parent in Kathmandu</h2>
                <div className="mt-5 space-y-4 text-sm text-zinc-700">
                  <InfoRow icon={MapPin} label="Coverage" value="Kathmandu, Lalitpur, Bhaktapur" />
                  <InfoRow icon={Clock3} label="Flow" value="Request, review, assign, update" />
                  <InfoRow icon={CheckCircle2} label="Family view" value="Status, reports, reminders, and payment" />
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-sm leading-6 text-amber-900">
                <div className="flex gap-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>This platform is for non-emergency coordination only. For emergencies, contact local emergency services or a hospital.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-100 bg-[linear-gradient(180deg,#f8fafc_0%,#ecfeff_100%)]">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold">Services families can request</h2>
                <p className="mt-2 text-zinc-600">
                  Start with public prices, then admin confirms availability and final details after the request.
                </p>
              </div>
              <Link href="/services" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                Browse all services
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {serviceHighlights.map((service) => (
                <article key={service.title} className="color-card rounded-lg p-5">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-emerald-700 text-white">
                    <service.icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(135deg,#ffffff_0%,#f0fdf4_100%)]">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-2xl font-semibold">How it works</h2>
                <p className="mt-2 text-zinc-600">
                  Families request care online. Admin handles coordination, providers, payments, reports, and reminders.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {howItWorks.map((step, index) => (
                  <div key={step} className="rounded-lg border border-emerald-100 bg-white/85 p-4 shadow-sm shadow-emerald-900/10">
                    <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                      {index + 1}
                    </span>
                    <p className="mt-4 text-sm font-medium text-zinc-800">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-sky-100 bg-[linear-gradient(135deg,#eff6ff_0%,#f0fdfa_100%)]">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-lg border border-sky-100 bg-white/85 p-6 shadow-sm shadow-sky-900/10">
                <HomeIcon className="size-7 text-emerald-700" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-semibold">Kathmandu Valley coverage</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  The MVP focuses on Kathmandu Valley first, including Kathmandu, Lalitpur, and Bhaktapur service areas.
                  More cities can be added later from admin without hardcoding prices.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-white/85 p-6 shadow-sm shadow-emerald-900/10">
                <PhoneCall className="size-7 text-emerald-700" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-semibold">Built for manual coordination</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  This MVP intentionally avoids AI diagnosis and emergency automation. Admin reviews requests, confirms
                  pricing, assigns providers, and uploads reports for family visibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="grid gap-4 md:grid-cols-3">
              {trustItems.map((item) => (
                <article key={item.title} className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-900/10">
                  <item.icon className="size-6 text-emerald-700" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#f0f9ff_100%)]">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-semibold">Common questions</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((faq) => (
                <article key={faq.question} className="rounded-lg border border-emerald-100 bg-white/90 p-5 shadow-sm shadow-emerald-900/10">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#ecfdf5_100%)]">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="rounded-lg bg-[linear-gradient(135deg,#064e3b_0%,#0f766e_55%,#0369a1_100%)] p-6 text-white shadow-xl shadow-emerald-900/20 sm:p-8">
              <h2 className="text-2xl font-semibold">Ready to check available services?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                View starting prices first. When you book, we collect patient details and admin confirms the request.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
                >
                  Browse services
                </Link>
                <Link
                  href="/register"
                  className="inline-flex rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Create account
                </Link>
              </div>
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

function MiniTrust({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 shadow-sm">
      <Icon className="size-4 text-emerald-700" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}
