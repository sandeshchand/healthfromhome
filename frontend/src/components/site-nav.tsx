"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { clearSession, hasToken } from "@/lib/auth"
import { useSyncExternalStore } from "react"
import { BrandLogo } from "@/components/brand-logo"

const linkClass = "text-sm font-medium text-zinc-700 transition hover:text-zinc-950"

export function SiteNav() {
  const router = useRouter()
  const signedIn = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerAuthSnapshot)

  function logout() {
    clearSession()
    window.dispatchEvent(new Event("healthfromhome-auth-change"))
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <BrandLogo />
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/services" className={linkClass}>Services</Link>
          {signedIn ? (
            <>
              <Link href="/dashboard" className={linkClass}>Dashboard</Link>
              <Link href="/book" className={linkClass}>Book</Link>
              <Link href="/bookings" className={linkClass}>Bookings</Link>
              <Link href="/records" className={linkClass}>Records</Link>
              <button type="button" onClick={logout} className={linkClass}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>Login</Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("healthfromhome-auth-change", callback)

  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("healthfromhome-auth-change", callback)
  }
}

function getAuthSnapshot() {
  return hasToken()
}

function getServerAuthSnapshot() {
  return false
}
