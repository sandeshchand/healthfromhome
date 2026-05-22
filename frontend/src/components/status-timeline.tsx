import { CheckCircle2, Circle } from "lucide-react"
import { bookingStatusSteps, formatStatus } from "@/lib/status"

export function StatusTimeline({ status }: { status: string }) {
  const currentIndex = bookingStatusSteps.findIndex((step) => step.value === status)

  if (status === "CANCELLED" || status === "FOLLOW_UP_REQUIRED") {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
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
          <li key={step.value} className={current ? "rounded-lg border border-emerald-300 bg-emerald-50 p-3" : "rounded-lg border border-zinc-200 bg-white p-3"}>
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
