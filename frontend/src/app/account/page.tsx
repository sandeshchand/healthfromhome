"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bell, FileText, LogOut, ShieldCheck, UserRound, type LucideIcon } from "lucide-react"
import { api } from "@/lib/api"
import { clearSession, hasToken } from "@/lib/auth"
import type { CurrentUser } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasToken()) {
      router.push("/login")
      return
    }

    api.get<CurrentUser>("/users/me/")
      .then((response) => setUser(response.data))
      .finally(() => setLoading(false))
  }, [router])

  function logout() {
    clearSession()
    router.push("/login")
  }

  return (
    <PageShell>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="decorative-grid rounded-lg border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-6 shadow-sm shadow-emerald-900/10">
          <p className="text-sm font-semibold text-emerald-700">Family account</p>
          <h1 className="mt-2 text-3xl font-semibold">Account profile</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            View the account used for patient profiles, bookings, reports, and reminders.
          </p>
        </section>

        {loading ? (
          <p className="mt-8 text-zinc-600">Loading account...</p>
        ) : !user ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            Account details could not be loaded.
          </div>
        ) : (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
            <div className="color-card rounded-lg p-6">
              <div className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
                  <UserRound className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">{displayName(user)}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{user.email || "No email added"}</p>
                </div>
              </div>

              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <Detail label="Username" value={user.username} />
                <Detail label="First name" value={user.first_name || "Not added"} />
                <Detail label="Last name" value={user.last_name || "Not added"} />
                <Detail label="Joined" value={user.date_joined.slice(0, 10)} />
                <Detail label="Family account" value={user.is_patient_family ? "Yes" : "No"} />
                <Detail label="Provider account" value={user.is_provider ? "Yes" : "No"} />
              </dl>
            </div>

            <div className="space-y-4">
              <div className="soft-panel rounded-lg p-6">
                <h2 className="text-lg font-semibold">Account actions</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  For MVP, account edits are handled by admin. You can safely log out from this device here.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 h-10 gap-2 text-red-700 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Logout
                </Button>
              </div>

              <div className="soft-panel rounded-lg p-6">
                <h2 className="text-lg font-semibold">What this account can access</h2>
                <div className="mt-4 space-y-3 text-sm text-zinc-600">
                  <AccessItem icon={ShieldCheck} text="Patient profiles connected to this family account." />
                  <AccessItem icon={FileText} text="Bookings, payment status, and medical records for your patients." />
                  <AccessItem icon={Bell} text="Manual reminders created by the admin care team." />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </PageShell>
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

function AccessItem({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="leading-6">{text}</p>
    </div>
  )
}

function displayName(user: CurrentUser) {
  const name = `${user.first_name} ${user.last_name}`.trim()
  return name || user.username
}
