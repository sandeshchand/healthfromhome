"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FileText } from "lucide-react"
import { api } from "@/lib/api"
import { hasToken } from "@/lib/auth"
import type { MedicalRecord } from "@/lib/types"
import { PageShell } from "@/components/page-shell"

export default function RecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasToken()) {
      router.push("/login")
      return
    }

    api.get<MedicalRecord[]>("/records/")
      .then((response) => setRecords(response.data))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Private family records</p>
          <h1 className="mt-2 text-3xl font-semibold">Medical records</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Reports uploaded by admin appear here for the authenticated family account.
          </p>
        </div>

        {loading ? (
          <p className="mt-8 text-zinc-600">Loading records...</p>
        ) : records.length === 0 ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            No records have been uploaded yet. After a service is completed, admin can upload reports from Django Admin.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {records.map((record) => (
              <article key={record.id} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <FileText className="size-6 text-emerald-700" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold">{record.title}</h2>
                {record.description && <p className="mt-2 text-sm text-zinc-600">{record.description}</p>}
                <p className="mt-3 text-sm text-zinc-500">
                  Uploaded {record.uploaded_at.slice(0, 10)}
                </p>
                {record.file_url && (
                  <Link
                    href={record.file_url}
                    target="_blank"
                    className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    View report
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  )
}
