"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FileText, FolderOpen, Search, ShieldCheck } from "lucide-react"
import { api } from "@/lib/api"
import { hasToken } from "@/lib/auth"
import type { MedicalRecord } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { inputStyles } from "@/components/form-field"
import { StatusBadge } from "@/components/status-badge"

export default function RecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [patient, setPatient] = useState("all")
  const [booking, setBooking] = useState("all")

  useEffect(() => {
    if (!hasToken()) {
      router.push("/login")
      return
    }

    api.get<MedicalRecord[]>("/records/")
      .then((response) => setRecords(response.data))
      .finally(() => setLoading(false))
  }, [router])

  const patientOptions = useMemo(() => {
    const names = records
      .map((record) => patientName(record))
      .filter(Boolean)
    return uniqueOptions(names)
  }, [records])

  const bookingOptions = useMemo(() => {
    const options = records
      .filter((record) => record.booking)
      .map((record) => ({
        value: String(record.booking),
        label: `Booking #${record.booking}`,
      }))

    return Array.from(new Map(options.map((option) => [option.value, option])).values())
      .sort((a, b) => Number(a.value) - Number(b.value))
  }, [records])

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase()

    return records.filter((record) => {
      const matchesSearch = !term || [
        record.title,
        record.description,
        patientName(record),
        record.booking_service_details?.service.name ?? "",
      ].some((value) => value.toLowerCase().includes(term))

      return (
        matchesSearch &&
        (patient === "all" || patientName(record) === patient) &&
        (booking === "all" || String(record.booking) === booking)
      )
    })
  }, [records, search, patient, booking])

  function clearFilters() {
    setSearch("")
    setPatient("all")
    setBooking("all")
  }

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="decorative-grid overflow-hidden rounded-lg border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-sky-50 p-6 shadow-sm shadow-emerald-900/10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-emerald-700">Private family records</p>
              <h1 className="mt-2 text-3xl font-semibold">Medical records</h1>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Reports uploaded by admin appear here for the authenticated family account.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white/85 p-4 text-sm text-emerald-900 backdrop-blur">
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>These reports are visible only to your family account.</p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <p className="mt-8 text-zinc-600">Loading records...</p>
        ) : records.length === 0 ? (
          <EmptyRecords />
        ) : (
          <>
            <section className="soft-panel mt-8 rounded-lg p-4">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-900">Search records</span>
                  <span className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-zinc-400" aria-hidden="true" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search report title, patient, service..."
                      className={inputStyles("pl-9")}
                    />
                  </span>
                </label>

                <FilterSelect label="Patient" value={patient} onChange={setPatient} options={patientOptions} />
                <BookingFilter value={booking} onChange={setBooking} options={bookingOptions} />

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="h-10 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-lg bg-emerald-50 px-3 py-2 font-medium text-emerald-800">
                  {filteredRecords.length} visible
                </span>
                <span className="rounded-lg bg-sky-50 px-3 py-2 font-medium text-sky-800">
                  {records.length} total uploaded
                </span>
              </div>
            </section>

            {filteredRecords.length === 0 ? (
              <div className="soft-panel mt-6 rounded-lg p-6 text-sm text-zinc-600">
                No records match these filters. Clear filters or try a broader search.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {filteredRecords.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </PageShell>
  )
}

function EmptyRecords() {
  return (
    <div className="soft-panel mt-8 rounded-lg p-6 text-sm text-zinc-600">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <FolderOpen className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-zinc-950">No medical records yet</h2>
          <p className="mt-1 leading-6">
            After a service is completed, admin can upload reports from Django Admin and they will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}

function RecordCard({ record }: { record: MedicalRecord }) {
  return (
    <article className="color-card rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">{record.title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{patientName(record) || "Patient record"}</p>
          </div>
        </div>
        {record.booking_status && <StatusBadge status={record.booking_status} />}
      </div>

      {record.description && <p className="mt-4 text-sm leading-6 text-zinc-600">{record.description}</p>}

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Detail label="Uploaded" value={record.uploaded_at.slice(0, 10)} />
        <Detail label="Booking" value={record.booking ? `#${record.booking}` : "Not linked"} />
        <Detail label="Service" value={record.booking_service_details?.service.name ?? "General record"} />
        <Detail label="Booking date" value={record.booking_requested_date ?? "Not linked"} />
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        {record.file_url && (
          <Link
            href={record.file_url}
            target="_blank"
            className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            View report
          </Link>
        )}
        {record.booking && (
          <Link
            href={`/bookings/${record.booking}`}
            className="inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
          >
            View booking
          </Link>
        )}
      </div>
    </article>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/80 p-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 font-medium text-zinc-950">{value}</dd>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-zinc-900">{label}</span>
      <select className={inputStyles()} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function BookingFilter({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-zinc-900">Booking</span>
      <select className={inputStyles()} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

function patientName(record: MedicalRecord) {
  if (!record.patient_details) return ""
  return `${record.patient_details.first_name} ${record.patient_details.last_name}`
}

function uniqueOptions(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}
