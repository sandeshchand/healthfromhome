import { CheckCircle2, Circle } from "lucide-react"
import { bookingStatusSteps, formatStatus } from "@/lib/status"

export function StatusTimeline({ status }: { status: string }) {
  const currentIndex = bookingStatusSteps.findIndex((step) => step.value === status)

  if (status === "CANCELLED" || status === "FOLLOW_UP_REQUIRED") {
    return (
      <div className="rounded-lg border border-emerald-100 bg-white/90 p-4 shadow-sm shadow-emerald-900/10">
        <p className="text-sm font-semibold">Current status</p>
        <p className="mt-2 text-lg font-semibold text-zinc-950">{formatStatus(status)}</p>
      </div>
    )
  }

  return (
    <ol className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
      {bookingStatusSteps.map((step, index) => {
        const complete = currentIndex >= index
        const current = currentIndex === index
        const Icon = complete ? CheckCircle2 : Circle

        return (
          <li key={step.value} className={current ? "rounded-lg border border-emerald-300 bg-gradient-to-br from-emerald-50 to-sky-50 p-3 shadow-sm shadow-emerald-900/10" : "rounded-lg border border-emerald-100 bg-white/85 p-3 shadow-sm shadow-emerald-900/5"}>
            <Icon className={complete ? "size-5 text-emerald-700" : "size-5 text-zinc-300"} aria-hidden="true" />
            <p className={complete ? "mt-3 text-sm font-semibold text-zinc-950" : "mt-3 text-sm font-medium text-zinc-500"}>
              {step.label}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
