import Link from "next/link"
import { SiteNav } from "@/components/site-nav"

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#ecfdf5_0%,#f0f9ff_42%,#f8fafc_100%)] text-zinc-950">
      <SiteNav />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-emerald-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-7 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>HealthFromHome MVP - non-emergency care coordination for families.</p>
          <nav className="flex flex-wrap gap-3">
            <Link href="/contact" className="font-medium text-zinc-700 hover:text-emerald-800">Contact</Link>
            <Link href="/privacy" className="font-medium text-zinc-700 hover:text-emerald-800">Privacy</Link>
            <Link href="/terms" className="font-medium text-zinc-700 hover:text-emerald-800">Terms</Link>
            <Link href="/emergency-disclaimer" className="font-medium text-zinc-700 hover:text-emerald-800">Emergency disclaimer</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
