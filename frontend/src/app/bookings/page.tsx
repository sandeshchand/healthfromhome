"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowRight, CalendarClock, CreditCard, MapPin } from "lucide-react"
import { api } from "@/lib/api"
import { hasToken } from "@/lib/auth"
import { formatNpr } from "@/lib/format"
import type { Booking } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasToken()) {
      router.push("/login")
      return
    }

    api.get<Booking[]>("/bookings/")
      .then((response) => setBookings(response.data))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-lg border border-emerald-100 bg-[linear-gradient(135deg,#ffffff_0%,#ecfdf5_55%,#e0f2fe_100%)] p-6 shadow-lg shadow-emerald-900/10">
          <p className="text-sm font-semibold text-emerald-700">Care requests</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">My bookings</h1>
              <p className="mt-2 max-w-2xl text-zinc-600">Open a booking to view status, provider, payment, reminders, and uploaded reports.</p>
            </div>
            <Link href="/services" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
              Request new service
            </Link>
          </div>
        </section>

        {loading ? (
          <p className="mt-8 text-zinc-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 p-6 text-sm text-zinc-700">
            You have not requested any services yet. Start from the Services page to create your first care request.
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {bookings.map((booking) => (
              <article key={booking.id} className="overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm shadow-emerald-900/10">
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold">{booking.service_details.service.name}</h2>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="mt-2 text-sm text-zinc-600">
                        {booking.patient_details.first_name} {booking.patient_details.last_name} - Booking #{booking.id}
                      </p>
                    </div>
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      View details
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <Info icon={CalendarClock} label="Requested" value={booking.requested_date} />
                    <Info icon={MapPin} label="Area" value={booking.service_details.service_area.name} />
                    <Info icon={CreditCard} label="Payment" value={booking.payment_details?.status ?? "Not added"} />
                    <Info icon={ArrowRight} label="Starting price" value={formatNpr(booking.service_details.base_price)} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  )
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarClock; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
      <Icon className="size-4 text-emerald-700" aria-hidden="true" />
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-950">{value}</p>
    </div>
  )
}
