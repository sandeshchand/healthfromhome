"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, CheckCircle2, MapPin, Search } from "lucide-react"
import { api } from "@/lib/api"
import { formatNpr } from "@/lib/format"
import type { ServicePricing } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { inputStyles } from "@/components/form-field"

export default function ServicesPage() {
  const [pricing, setPricing] = useState<ServicePricing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [city, setCity] = useState("all")
  const [area, setArea] = useState("all")
  const [service, setService] = useState("all")

  useEffect(() => {
    api.get<ServicePricing[]>("/services/pricing/")
      .then((response) => setPricing(response.data))
      .finally(() => setLoading(false))
  }, [])

  const serviceCount = useMemo(() => new Set(pricing.map((item) => item.service.id)).size, [pricing])
  const cities = useMemo(() => uniqueOptions(pricing.map((item) => item.city.name)), [pricing])
  const areas = useMemo(() => uniqueOptions(pricing.map((item) => item.service_area.name)), [pricing])
  const services = useMemo(() => uniqueOptions(pricing.map((item) => item.service.name)), [pricing])
  const filteredPricing = useMemo(() => {
    const term = search.trim().toLowerCase()

    return pricing.filter((item) => {
      const matchesSearch = !term || [
        item.service.name,
        item.service.description,
        item.city.name,
        item.service_area.name,
      ].some((value) => value.toLowerCase().includes(term))

      return (
        matchesSearch &&
        (city === "all" || item.city.name === city) &&
        (area === "all" || item.service_area.name === area) &&
        (service === "all" || item.service.name === service)
      )
    })
  }, [pricing, search, city, area, service])

  function clearFilters() {
    setSearch("")
    setCity("all")
    setArea("all")
    setService("all")
  }

  return (
    <PageShell>
      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
              Public service menu
            </p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Services and starting prices</h1>
                <p className="mt-3 max-w-2xl text-zinc-600">
                  Families can check availability and starting prices before registration. Final price and provider
                  assignment are confirmed by admin after the request is submitted.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                <span className="font-semibold text-zinc-950">{serviceCount}</span> active service types
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            {loading ? (
              <p className="text-zinc-600">Loading services...</p>
            ) : pricing.length === 0 ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                No active pricing has been added yet. Add City, Service Area, Service, and Service Pricing in Django Admin.
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-zinc-900">Search</span>
                      <span className="relative block">
                        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-zinc-400" aria-hidden="true" />
                        <input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Search nurse, lab, transport..."
                          className={inputStyles("pl-9")}
                        />
                      </span>
                    </label>

                    <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
                    <FilterSelect label="Service area" value={area} onChange={setArea} options={areas} />
                    <FilterSelect label="Service type" value={service} onChange={setService} options={services} />

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
                  <p className="mt-4 text-sm text-zinc-600">
                    Showing {filteredPricing.length} of {pricing.length} active price options.
                  </p>
                </div>

                {filteredPricing.length === 0 ? (
                  <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                    No services match these filters. Clear filters or try a broader search.
                  </div>
                ) : (
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {filteredPricing.map((item) => (
                      <ServiceCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </PageShell>
  )
}

function ServiceCard({ item }: { item: ServicePricing }) {
  return (
    <article className="flex flex-col rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{item.service.name}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{item.service.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Starts at</p>
          <p className="mt-1 text-lg font-semibold text-emerald-700">{formatNpr(item.base_price)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Detail label="City" value={item.city.name} />
        <Detail label="Service area" value={item.service_area.name} />
        <Detail label="Per km" value={formatNpr(item.price_per_km)} />
        <Detail label="Night charge" value={formatNpr(item.night_charge)} />
      </div>

      <div className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
        <div className="flex gap-2">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>Admin confirms final pricing, schedule, and provider availability after request.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-zinc-600">
          <MapPin className="size-4" aria-hidden="true" />
          Available in {item.city.name}
        </p>
        <Link
          href={`/book?servicePricing=${item.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Book this service
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-medium text-zinc-950">{value}</p>
    </div>
  )
}

function uniqueOptions(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}
