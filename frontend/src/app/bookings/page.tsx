"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
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
        <div>
          <p className="text-sm font-semibold text-emerald-700">Care requests</p>
          <h1 className="mt-2 text-3xl font-semibold">My bookings</h1>
          <p className="mt-2 text-zinc-600">Open a booking to view status, payment, and uploaded reports.</p>
        </div>

        {loading ? (
          <p className="mt-8 text-zinc-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            You have not requested any services yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">{booking.service_details.service.name}</h2>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      {booking.patient_details.first_name} {booking.patient_details.last_name} · Requested {booking.requested_date}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Starting price {formatNpr(booking.service_details.base_price)}
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
              </article>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  )
}
