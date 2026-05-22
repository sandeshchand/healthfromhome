"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { clearSession, hasToken } from "@/lib/auth"
import { useSyncExternalStore } from "react"
import { BrandLogo } from "@/components/brand-logo"

const linkClass = "shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-800"

export function SiteNav() {
  const router = useRouter()
  const signedIn = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerAuthSnapshot)

  function logout() {
    clearSession()
    window.dispatchEvent(new Event("healthfromhome-auth-change"))
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/85 shadow-sm shadow-emerald-900/5 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <BrandLogo />
        <nav className="flex w-full items-center gap-3 overflow-x-auto pb-1 sm:w-auto sm:flex-wrap sm:overflow-visible sm:pb-0">
          <Link href="/services" className={linkClass}>Services</Link>
          {signedIn ? (
            <>
              <Link href="/dashboard" className={linkClass}>Dashboard</Link>
              <Link href="/book" className={linkClass}>Book</Link>
              <Link href="/bookings" className={linkClass}>Bookings</Link>
              <Link href="/records" className={linkClass}>Records</Link>
              <Link href="/account" className={linkClass}>Account</Link>
              <button type="button" onClick={logout} className={linkClass}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>Login</Link>
              <Link
                href="/register"
                className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800"
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
