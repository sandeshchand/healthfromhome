export function FormMessage({ message, tone = "error" }: { message: string | null; tone?: "error" | "success" }) {
  if (!message) return null

  return (
    <p className={tone === "error" ? "text-sm text-red-600" : "text-sm text-emerald-700"}>
      {message}
    </p>
  )
}
