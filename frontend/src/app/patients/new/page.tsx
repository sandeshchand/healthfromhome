"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { hasToken } from "@/lib/auth"
import { PageShell } from "@/components/page-shell"
import { FormMessage } from "@/components/form-message"
import { Button } from "@/components/ui/button"
import { FormCard, FormField, inputStyles } from "@/components/form-field"

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["M", "F", "O"]),
  address: z.string().min(1, "Address is required"),
  medical_history: z.string().optional(),
  emergency_contact_name: z.string().min(1, "Emergency contact is required"),
  emergency_contact_phone: z.string().min(1, "Emergency phone is required"),
})

type PatientForm = z.infer<typeof schema>

export default function NewPatientPage() {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PatientForm>({
    resolver: zodResolver(schema),
    defaultValues: { gender: "F", medical_history: "" },
  })

  useEffect(() => {
    if (!hasToken()) router.push("/login")
  }, [router])

  async function onSubmit(values: PatientForm) {
    setMessage(null)
    try {
      await api.post("/patients/", values)
      router.push("/dashboard")
    } catch {
      setMessage("Could not save patient profile. Please check the details.")
    }
  }

  return (
    <PageShell>
      <FormCard
        eyebrow="Patient profile"
        title="Add parent or patient details"
        description="This profile is used for booking requests and private medical records. Do not enter unnecessary sensitive information."
        aside={<FormAside title="Privacy reminder" items={["Use demo data locally", "Add only coordination details", "Reports stay family-private", "Admin can help update details"]} />}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
          <section className="space-y-4 rounded-lg bg-emerald-50/50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Basic information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="First name" error={errors.first_name?.message} required>
                <input className={inputStyles()} {...register("first_name")} />
              </FormField>
              <FormField label="Last name" error={errors.last_name?.message} required>
                <input className={inputStyles()} {...register("last_name")} />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Date of birth" error={errors.date_of_birth?.message} required>
                <input type="date" className={inputStyles()} {...register("date_of_birth")} />
              </FormField>
              <FormField label="Gender" error={errors.gender?.message} required>
                <select className={inputStyles()} {...register("gender")}>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="O">Other</option>
                </select>
              </FormField>
            </div>
          </section>

          <section className="space-y-4 rounded-lg bg-sky-50/60 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Care location and notes</h2>
            <FormField label="Address" error={errors.address?.message} helper="Include city, area, landmark, and access notes if useful." required>
              <textarea className={inputStyles("min-h-24 resize-y")} {...register("address")} />
            </FormField>

            <FormField label="Medical history" error={errors.medical_history?.message} helper="Optional. Add only details needed for coordination, such as mobility concerns or known conditions.">
              <textarea className={inputStyles("min-h-24 resize-y")} {...register("medical_history")} />
            </FormField>
          </section>

          <section className="space-y-4 rounded-lg bg-emerald-50/50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Emergency contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Contact name" error={errors.emergency_contact_name?.message} required>
                <input className={inputStyles()} {...register("emergency_contact_name")} />
              </FormField>
              <FormField label="Contact phone" error={errors.emergency_contact_phone?.message} helper="Use a reachable local or family phone number." required>
                <input className={inputStyles()} inputMode="tel" {...register("emergency_contact_phone")} />
              </FormField>
            </div>
          </section>

          <FormMessage message={message} />

          <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-5">
            <Button type="submit" className="h-10 bg-emerald-700 text-white hover:bg-emerald-800" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save patient"}
            </Button>
            <Button type="button" variant="outline" className="h-10" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
          </div>
        </form>
      </FormCard>
    </PageShell>
  )
}

function FormAside({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-semibold text-zinc-950">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-zinc-700">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-white/70 p-3">{item}</li>
        ))}
      </ul>
    </div>
  )
}
