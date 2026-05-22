"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { hasToken } from "@/lib/auth"
import { formatNpr } from "@/lib/format"
import type { PatientProfile, ServicePricing } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { FormMessage } from "@/components/form-message"
import { Button } from "@/components/ui/button"
import { FormCard, FormField, inputStyles } from "@/components/form-field"

const schema = z.object({
  patient: z.string().min(1, "Choose a patient"),
  service_pricing: z.string().min(1, "Choose a service"),
  requested_date: z.string().min(1, "Requested date is required"),
  requested_time: z.string().optional(),
  special_instructions: z.string().optional(),
})

type BookingForm = z.infer<typeof schema>

export default function BookPage() {
  return (
    <Suspense fallback={<BookingFallback />}>
      <BookForm />
    </Suspense>
  )
}

function BookForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedServicePricing = searchParams.get("servicePricing") ?? ""
  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [pricing, setPricing] = useState<ServicePricing[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<BookingForm>({
    resolver: zodResolver(schema),
    values: {
      patient: "",
      service_pricing: selectedServicePricing,
      requested_date: "",
      requested_time: "",
      special_instructions: "",
    },
  })
  const selectedPricingId = useWatch({ control, name: "service_pricing" })
  const selectedPricing = useMemo(
    () => pricing.find((item) => String(item.id) === selectedPricingId),
    [pricing, selectedPricingId],
  )

  useEffect(() => {
    if (!hasToken()) {
      router.push("/login")
      return
    }

    Promise.all([
      api.get<PatientProfile[]>("/patients/"),
      api.get<ServicePricing[]>("/services/pricing/"),
    ])
      .then(([patientResponse, pricingResponse]) => {
        setPatients(patientResponse.data)
        setPricing(pricingResponse.data)
      })
      .finally(() => setLoading(false))
  }, [router])

  async function onSubmit(values: BookingForm) {
    setMessage(null)
    try {
      await api.post("/bookings/", {
        ...values,
        patient: Number(values.patient),
        service_pricing: Number(values.service_pricing),
        requested_time: values.requested_time || null,
      })
      router.push("/bookings")
    } catch {
      setMessage("Could not create booking. Make sure the selected patient and service are valid.")
    }
  }

  return (
    <PageShell>
      <FormCard
        eyebrow="Booking request"
        title="Request a care service"
        description="Submit the patient, service, and preferred schedule. Admin will review provider availability and final pricing before confirmation."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
          {loading ? (
            <p className="rounded-lg bg-zinc-50 p-4 text-sm text-zinc-600">Loading booking options...</p>
          ) : (
            <>
              {patients.length === 0 && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  Add a patient profile before requesting a service. <Link href="/patients/new" className="font-semibold underline">Add patient</Link>
                </p>
              )}
              {pricing.length === 0 && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  No active service pricing exists yet. Add pricing in Django Admin.
                </p>
              )}

              <section className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Who and what</h2>
                <FormField label="Patient" error={errors.patient?.message} helper="Choose the parent or patient receiving this service." required>
                  <select className={inputStyles()} {...register("patient")}>
                    <option value="">Select patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Service" error={errors.service_pricing?.message} helper="Starting prices are shown before admin review." required>
                  <select className={inputStyles()} {...register("service_pricing")}>
                    <option value="">Select service</option>
                    {pricing.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.service.name} - {item.city.name} - {item.service_area.name} - {formatNpr(item.base_price)}
                      </option>
                    ))}
                  </select>
                </FormField>

                {selectedPricing && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
                    <p className="font-semibold">{selectedPricing.service.name}</p>
                    <p className="mt-1">
                      {selectedPricing.city.name}, {selectedPricing.service_area.name} - starts at {formatNpr(selectedPricing.base_price)}
                    </p>
                    <p className="mt-2 text-emerald-800">Final amount is confirmed by admin after review.</p>
                  </div>
                )}
              </section>

              <section className="space-y-4 border-t border-zinc-200 pt-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Preferred schedule</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Requested date" error={errors.requested_date?.message} required>
                    <input type="date" className={inputStyles()} {...register("requested_date")} />
                  </FormField>
                  <FormField label="Requested time" error={errors.requested_time?.message} helper="Optional. Leave blank if flexible.">
                    <input type="time" className={inputStyles()} {...register("requested_time")} />
                  </FormField>
                </div>
              </section>

              <section className="space-y-4 border-t border-zinc-200 pt-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Extra instructions</h2>
                <FormField label="Special instructions" error={errors.special_instructions?.message} helper="Add access notes, mobility needs, language preference, or appointment context.">
                  <textarea className={inputStyles("min-h-24 resize-y")} {...register("special_instructions")} />
                </FormField>
              </section>
            </>
          )}

          <FormMessage message={message} />

          <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-5">
            <Button type="submit" className="h-10 bg-emerald-700 text-white hover:bg-emerald-800" disabled={isSubmitting || loading || patients.length === 0 || pricing.length === 0}>
              {isSubmitting ? "Submitting..." : "Submit booking request"}
            </Button>
            <Button type="button" variant="outline" className="h-10" onClick={() => router.push("/services")}>
              Back to services
            </Button>
          </div>
        </form>
      </FormCard>
    </PageShell>
  )
}

function BookingFallback() {
  return (
    <PageShell>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
          Loading booking form...
        </div>
      </main>
    </PageShell>
  )
}
