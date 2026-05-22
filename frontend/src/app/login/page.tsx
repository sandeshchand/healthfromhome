"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { saveSession } from "@/lib/auth"
import type { UserSession } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { FormMessage } from "@/components/form-message"
import { Button } from "@/components/ui/button"
import { FormCard, FormField, inputStyles } from "@/components/form-field"

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginForm = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: LoginForm) {
    setMessage(null)
    try {
      const response = await api.post<UserSession>("/users/login/", values)
      saveSession(response.data)
      router.push("/dashboard")
    } catch {
      setMessage("Login failed. Check your username and password.")
    }
  }

  return (
    <PageShell>
      <FormCard
        eyebrow="Family account"
        title="Login to your care dashboard"
        description="Use the account you created to track bookings, reports, payments, and patient profiles."
        maxWidth="max-w-4xl"
        aside={<FormAside title="What you can manage" items={["Booking status", "Medical reports", "Payment updates", "Reminders"]} />}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          <FormField label="Username" error={errors.username?.message} required>
            <input className={inputStyles()} autoComplete="username" {...register("username")} />
          </FormField>

          <FormField label="Password" error={errors.password?.message} required>
            <input type="password" className={inputStyles()} autoComplete="current-password" {...register("password")} />
          </FormField>

          <FormMessage message={message} />

          <Button type="submit" className="h-10 w-full bg-emerald-700 text-white hover:bg-emerald-800" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="rounded-lg bg-zinc-50 p-3 text-center text-sm text-zinc-600">
            New to HealthFromHome? <Link href="/register" className="font-semibold text-emerald-700 underline">Create a family account</Link>
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
