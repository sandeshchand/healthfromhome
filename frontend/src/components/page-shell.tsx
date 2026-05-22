import { SiteNav } from "@/components/site-nav"

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <SiteNav />
      {children}
    </div>
  )
}
