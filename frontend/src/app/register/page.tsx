"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { PageShell } from "@/components/page-shell"
import { FormMessage } from "@/components/form-message"
import { Button } from "@/components/ui/button"
import { FormCard, FormField, inputStyles } from "@/components/form-field"

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  username: z.string().min(3, "Use at least 3 characters"),
  password: z.string().min(8, "Use at least 8 characters"),
})

type RegisterForm = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: RegisterForm) {
    setMessage(null)
    try {
      await api.post("/users/register/", values)
      router.push("/login")
    } catch {
      setMessage("Registration failed. Try a different username or email.")
    }
  }

  return (
    <PageShell>
      <FormCard
        eyebrow="Start care coordination"
        title="Create your family account"
        description="Register first, then add a parent profile and request services from the public service menu."
        aside={<FormAside title="After registration" items={["Add parent profile", "Choose a service", "Submit booking request", "Track admin updates"]} />}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="First name" error={errors.first_name?.message} required>
              <input className={inputStyles()} autoComplete="given-name" {...register("first_name")} />
            </FormField>
            <FormField label="Last name" error={errors.last_name?.message} required>
              <input className={inputStyles()} autoComplete="family-name" {...register("last_name")} />
            </FormField>
          </div>

          <FormField label="Email" error={errors.email?.message} helper="Use the email where the family should receive updates." required>
            <input type="email" className={inputStyles()} autoComplete="email" {...register("email")} />
          </FormField>

          <FormField label="Username" error={errors.username?.message} helper="You will use this username to login." required>
            <input className={inputStyles()} autoComplete="username" {...register("username")} />
          </FormField>

          <FormField label="Password" error={errors.password?.message} helper="Use at least 8 characters." required>
            <input type="password" className={inputStyles()} autoComplete="new-password" {...register("password")} />
          </FormField>

          <FormMessage message={message} />

          <Button type="submit" className="h-10 w-full bg-emerald-700 text-white hover:bg-emerald-800" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <p className="rounded-lg bg-zinc-50 p-3 text-center text-sm text-zinc-600">
            Already registered? <Link href="/login" className="font-semibold text-emerald-700 underline">Login</Link>
          </p>
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
