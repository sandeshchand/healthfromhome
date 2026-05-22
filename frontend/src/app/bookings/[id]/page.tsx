"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { CreditCard, FileText, Info, ShieldCheck, UserRoundCheck } from "lucide-react"
import { api } from "@/lib/api"
import { hasToken } from "@/lib/auth"
import { formatNpr } from "@/lib/format"
import { statusGuidance } from "@/lib/status"
import type { Booking, MedicalRecord } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { StatusTimeline } from "@/components/status-timeline"

export default function BookingDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasToken()) {
      router.push("/login")
      return
    }

    Promise.all([
      api.get<Booking>(`/bookings/${params.id}/`),
      api.get<MedicalRecord[]>("/records/"),
    ])
      .then(([bookingResponse, recordResponse]) => {
        setBooking(bookingResponse.data)
        setRecords(recordResponse.data)
      })
      .finally(() => setLoading(false))
  }, [params.id, router])

  const linkedRecords = useMemo(
    () => records.filter((record) => record.booking === booking?.id),
    [records, booking],
  )
  const guidance = booking ? statusGuidance(booking.status) : null

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <p className="text-zinc-600">Loading booking...</p>
        ) : !booking ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            Booking not found.
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link href="/bookings" className="text-sm font-medium text-emerald-700 hover:underline">
                  Back to bookings
                </Link>
                <h1 className="mt-3 text-3xl font-semibold">Booking #{booking.id}</h1>
                <p className="mt-2 text-zinc-600">
                  {booking.service_details.service.name} for {booking.patient_details.first_name} {booking.patient_details.last_name}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Status timeline</h2>
                  <p className="mt-1 text-sm text-zinc-600">Follow the request from admin review to completion.</p>
                </div>
                <p className="text-sm font-medium text-zinc-500">Current: {guidance?.title}</p>
              </div>
              <div className="mt-4"><StatusTimeline status={booking.status} /></div>
            </section>

            {guidance && (
              <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex gap-3">
                  <Info className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <div>
                    <h2 className="font-semibold text-emerald-950">{guidance.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-emerald-900">{guidance.text}</p>
                    <p className="mt-3 text-sm font-semibold text-emerald-950">Next: {guidance.next}</p>
                  </div>
                </div>
              </section>
            )}

            <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <h2 className="text-lg font-semibold">Booking details</h2>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <Detail label="Patient" value={`${booking.patient_details.first_name} ${booking.patient_details.last_name}`} />
                  <Detail label="Service" value={booking.service_details.service.name} />
                  <Detail label="Requested date" value={booking.requested_date} />
                  <Detail label="Requested time" value={booking.requested_time || "Flexible"} />
                  <Detail label="City" value={booking.service_details.city.name} />
                  <Detail label="Service area" value={booking.service_details.service_area.name} />
                  <Detail label="Starting price" value={formatNpr(booking.service_details.base_price)} />
                  <Detail label="Weekend charge" value={formatNpr(booking.service_details.weekend_charge)} />
                </dl>
                {booking.special_instructions && (
                  <div className="mt-5 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
                    <p className="font-semibold text-zinc-950">Special instructions</p>
                    <p className="mt-2">{booking.special_instructions}</p>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <ProviderCard booking={booking} />
                <PaymentCard booking={booking} />
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Reports linked to this booking</h2>
                  <p className="mt-1 text-sm text-zinc-600">Uploaded documents are private to this family account.</p>
                </div>
                <ShieldCheck className="size-6 text-emerald-700" aria-hidden="true" />
              </div>
              {linkedRecords.length === 0 ? (
                <p className="mt-4 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-600">
                  No report has been uploaded for this booking yet.
                </p>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {linkedRecords.map((record) => (
                    <article key={record.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex gap-3">
                        <FileText className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold">{record.title}</h3>
                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                            Uploaded {record.uploaded_at.slice(0, 10)}
                          </p>
                          {record.description && <p className="mt-2 text-sm text-zinc-600">{record.description}</p>}
                          {record.file_url && (
                            <Link
                              href={record.file_url}
                              target="_blank"
                              className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                              View report
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </PageShell>
  )
}

function ProviderCard({ booking }: { booking: Booking }) {
  const assignment = booking.assignment_details
  const providerName = assignment?.provider_name || assignment?.provider_username

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Assigned provider</h2>
          <p className="mt-1 text-sm text-zinc-600">Provider assignment is managed by admin.</p>
        </div>
        <UserRoundCheck className="size-6 text-emerald-700" aria-hidden="true" />
      </div>

      {assignment ? (
        <div className="mt-5 rounded-lg bg-zinc-50 p-4">
          <p className="text-xl font-semibold">{providerName}</p>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <Detail label="Specialization" value={assignment.provider_specialization || "Care provider"} />
            <Detail label="Phone" value={assignment.provider_phone_number || "Shared by admin if needed"} />
            <Detail label="Assigned date" value={assignment.assigned_at.slice(0, 10)} />
          </div>
          {assignment.provider_bio && <p className="mt-4 text-sm leading-6 text-zinc-600">{assignment.provider_bio}</p>}
          {assignment.notes && (
            <div className="mt-4 rounded-lg bg-white p-3 text-sm leading-6 text-zinc-700">
              <p className="font-semibold text-zinc-950">Assignment notes</p>
              <p className="mt-1">{assignment.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-lg bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
          Provider has not been assigned yet. After admin confirms availability, the assigned provider details will appear here.
        </div>
      )}
    </div>
  )
}

function PaymentCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Payment</h2>
          <p className="mt-1 text-sm text-zinc-600">Manual payment status is updated by admin.</p>
        </div>
        <CreditCard className="size-6 text-emerald-700" aria-hidden="true" />
      </div>
      {booking.payment_details ? (
        <div className="mt-5 rounded-lg bg-zinc-50 p-4">
          <p className="text-3xl font-semibold">{formatNpr(booking.payment_details.amount)}</p>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <Detail label="Payment status" value={booking.payment_details.status} />
            <Detail label="Transaction ID" value={booking.payment_details.transaction_id || "Manual payment"} />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
          Payment has not been added by admin yet. Final amount is confirmed after review.
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 font-medium text-zinc-950">{value}</dd>
    </div>
  )
}
