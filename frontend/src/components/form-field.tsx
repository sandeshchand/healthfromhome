import { FormMessage } from "@/components/form-message"

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100"

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
  maxWidth = "max-w-2xl",
}: {
  eyebrow?: string
  title: string
  description: string
  children: React.ReactNode
  maxWidth?: string
}) {
  return (
    <main className={`mx-auto w-full ${maxWidth} px-4 py-10`}>
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="border-b border-zinc-200 pb-5">
          {eyebrow && <p className="text-sm font-semibold text-emerald-700">{eyebrow}</p>}
          <h1 className={eyebrow ? "mt-2 text-2xl font-semibold" : "text-2xl font-semibold"}>{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
        </div>
        {children}
      </div>
    </main>
  )
}
