import { FormMessage } from "@/components/form-message"

const inputClass =
  "w-full rounded-lg border border-emerald-100 bg-white/90 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100"

export function FormField({
  label,
  error,
  helper,
  required = false,
  children,
}: {
  label: string
  error?: string
  helper?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-1 text-sm font-medium text-zinc-900">
        {label}
        {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {helper && !error && <p className="text-xs leading-5 text-zinc-500">{helper}</p>}
      <FormMessage message={error ?? null} />
    </label>
  )
}

export function inputStyles(extra = "") {
  return `${inputClass} ${extra}`.trim()
}

export function FormCard({
  eyebrow,
  title,
  description,
  children,
  maxWidth = "max-w-5xl",
  aside,
}: {
  eyebrow?: string
  title: string
  description: string
  children: React.ReactNode
  maxWidth?: string
  aside?: React.ReactNode
}) {
  return (
    <main className={`mx-auto w-full ${maxWidth} px-4 py-10`}>
      <div className={aside ? "grid gap-6 lg:grid-cols-[1fr_0.55fr]" : ""}>
        <div className="overflow-hidden rounded-lg border border-emerald-100 bg-white/90 shadow-lg shadow-emerald-900/10 backdrop-blur">
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
          <div className="p-5 sm:p-6">
            <div className="border-b border-emerald-100 pb-5">
              {eyebrow && <p className="text-sm font-semibold text-emerald-700">{eyebrow}</p>}
              <h1 className={eyebrow ? "mt-2 text-2xl font-semibold" : "text-2xl font-semibold"}>{title}</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
            </div>
            {children}
          </div>
        </div>
        {aside && (
          <aside className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 to-emerald-50 p-5 shadow-sm shadow-sky-900/10">
            {aside}
          </aside>
        )}
      </div>
    </main>
  )
}
