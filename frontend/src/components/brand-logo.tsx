import Link from "next/link"
import { HeartPulse, Home } from "lucide-react"

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="relative flex size-10 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-sm">
        <Home className="size-5" aria-hidden="true" />
        <HeartPulse className="absolute -right-1 -top-1 size-4 rounded-full bg-white text-emerald-700" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-semibold text-zinc-950">HealthFromHome</span>
        <span className="block text-xs font-medium text-zinc-500">Care coordination</span>
      </span>
    </Link>
  )
}
