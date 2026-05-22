"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Bell, CalendarClock, FileText, HeartPulse, Plus, UserRound } from "lucide-react"
import { api } from "@/lib/api"
import { hasToken } from "@/lib/auth"
import { formatNpr } from "@/lib/format"
import type { Booking, MedicalRecord, PatientProfile, Reminder } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"

export default function DashboardPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasToken()) {
      router.push("/login")
      return
    }

    Promise.all([
      api.get<PatientProfile[]>("/patients/"),
      api.get<Booking[]>("/bookings/"),
      api.get<MedicalRecord[]>("/records/"),
      api.get<Reminder[]>("/reminders/"),
    ])
      .then(([patientResponse, bookingResponse, recordResponse, reminderResponse]) => {
        setPatients(patientResponse.data)
        setBookings(bookingResponse.data)
        setRecords(recordResponse.data)
        setReminders(reminderResponse.data)
      })
      .finally(() => setLoading(false))
  }, [router])

  const activeBookings = useMemo(
    () => bookings.filter((booking) => !["COMPLETED", "CANCELLED"].includes(booking.status)),
    [bookings],
  )
  const priorityBooking = activeBookings[0] ?? bookings[0]
  const pendingReminders = useMemo(
    () => reminders.filter((reminder) => reminder.status === "PENDING"),
    [reminders],
  )

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-lg border border-emerald-100 bg-[linear-gradient(135deg,#ffffff_0%,#ecfdf5_55%,#e0f2fe_100%)] p-6 shadow-lg shadow-emerald-900/10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-emerald-700">Family care dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Care coordination at a glance</h1>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Track patient profiles, service requests, admin updates, payments, and uploaded reports from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/patients/new" className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-100">
                <Plus className="size-4" aria-hidden="true" />
                Add patient
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                <HeartPulse className="size-4" aria-hidden="true" />
                Book care
              </Link>
            </div>
          </div>
        </section>

        {loading ? (
          <p className="mt-8 text-zinc-600">Loading dashboard...</p>
        ) : (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard label="Patients" value={patients.length} helper="Profiles under this family account" />
              <SummaryCard label="Active bookings" value={activeBookings.length} helper="Requests still in progress" />
              <SummaryCard label="Reports" value={records.length} helper="Uploaded medical documents" />
              <SummaryCard label="Reminders" value={pendingReminders.length} helper="Pending follow-up reminders" />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-lg border border-emerald-100 bg-white/90 p-5 shadow-sm shadow-emerald-900/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Priority booking</h2>
                    <p className="mt-1 text-sm text-zinc-600">Most recent active request for admin follow-up.</p>
                  </div>
                  <CalendarClock className="size-6 text-emerald-700" aria-hidden="true" />
                </div>

                {!priorityBooking ? (
                  <EmptyState
                    title="No booking yet"
                    text="Choose a service and create your first care request."
                    href="/services"
                    action="View services"
                  />
                ) : (
                  <div className="mt-5 rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50 to-sky-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold">{priorityBooking.service_details.service.name}</h3>
                        <p className="mt-2 text-sm text-zinc-600">
                          {priorityBooking.patient_details.first_name} {priorityBooking.patient_details.last_name} - Requested {priorityBooking.requested_date}
                        </p>
                      </div>
                      <StatusBadge status={priorityBooking.status} />
                    </div>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <Info label="Area" value={priorityBooking.service_details.service_area.name} />
                      <Info label="Starting price" value={formatNpr(priorityBooking.service_details.base_price)} />
                      <Info label="Payment" value={priorityBooking.payment_details?.status ?? "Not added"} />
                    </div>
                    <Link
                      href={`/bookings/${priorityBooking.id}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Open booking details
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-900/10">
                <h2 className="text-lg font-semibold">What to do next</h2>
                <div className="mt-4 space-y-3">
                  <NextStep done={patients.length > 0} text="Add at least one parent or patient profile" href="/patients/new" />
                  <NextStep done={bookings.length > 0} text="Request a service from the public service menu" href="/services" />
                  <NextStep done={records.length > 0} text="Review reports uploaded by admin" href="/records" />
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <Panel title="Patient profiles" href="/patients/new" action="Add patient">
                {patients.length === 0 ? (
                  <p className="text-sm text-zinc-600">Add your first parent or patient profile.</p>
                ) : patients.slice(0, 3).map((patient) => (
                  <div key={patient.id} className="rounded-lg border border-zinc-200 p-3">
                    <div className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <UserRound className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                        <p className="mt-1 text-sm text-zinc-600">{patient.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Panel>

              <Panel title="Recent bookings" href="/bookings" action="View all">
                {bookings.length === 0 ? (
                  <p className="text-sm text-zinc-600">No bookings yet.</p>
                ) : bookings.slice(0, 3).map((booking) => (
                  <Link key={booking.id} href={`/bookings/${booking.id}`} className="block rounded-lg border border-zinc-200 p-3 transition hover:bg-zinc-50">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{booking.service_details.service.name}</p>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      {booking.patient_details.first_name} {booking.patient_details.last_name}
                    </p>
                  </Link>
                ))}
              </Panel>

              <Panel title="Recent records" href="/records" action="View records">
                {records.length === 0 ? (
                  <p className="text-sm text-zinc-600">No reports uploaded yet.</p>
                ) : records.slice(0, 3).map((record) => (
                  <Link key={record.id} href="/records" className="block rounded-lg border border-zinc-200 p-3 transition hover:bg-zinc-50">
                    <div className="flex gap-3">
                      <FileText className="mt-0.5 size-5 text-emerald-700" aria-hidden="true" />
                      <div>
                        <p className="font-medium">{record.title}</p>
                        <p className="mt-1 text-sm text-zinc-600">
                          Uploaded {record.uploaded_at.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </Panel>

              <Panel title="Upcoming reminders" href="/dashboard" action="Dashboard">
                {pendingReminders.length === 0 ? (
                  <p className="text-sm text-zinc-600">No pending reminders yet.</p>
                ) : pendingReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="rounded-lg border border-zinc-200 p-3">
                    <div className="flex gap-3">
                      <Bell className="mt-0.5 size-5 text-emerald-700" aria-hidden="true" />
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <p className="mt-1 text-sm text-zinc-600">
                          {reminder.patient_details.first_name} {reminder.patient_details.last_name} - Due {reminder.due_date}
                          {reminder.due_time ? ` at ${reminder.due_time.slice(0, 5)}` : ""}
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                          {reminder.channel} reminder
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Panel>
            </section>
          </>
        )}
      </main>
    </PageShell>
  )
}

function SummaryCard({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-white/90 p-5 shadow-sm shadow-emerald-900/10">
      <p className="text-sm font-medium text-zinc-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{helper}</p>
    </div>
  )
}

function Panel({ title, href, action, children }: { title: string; href: string; action: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-emerald-100 bg-white/90 p-5 shadow-sm shadow-emerald-900/10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-emerald-700 hover:underline">
          {action}
        </Link>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/80 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-950">{value}</p>
    </div>
  )
}

function EmptyState({ title, text, href, action }: { title: string; text: string; href: string; action: string }) {
  return (
    <div className="mt-5 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 p-5">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm text-zinc-600">{text}</p>
      <Link href={href} className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
        {action}
      </Link>
    </div>
  )
}

function NextStep({ done, text, href }: { done: boolean; text: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 transition hover:bg-zinc-50">
      <span className={done ? "flex size-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800" : "flex size-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500"}>
        {done ? "OK" : "Next"}
      </span>
      <span className="text-sm font-medium text-zinc-700">{text}</span>
    </Link>
  )
}
