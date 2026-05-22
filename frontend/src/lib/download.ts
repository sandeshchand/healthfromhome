import { api } from "@/lib/api"

export async function openAuthenticatedFile(url: string, fallbackName: string) {
  const response = await api.get<Blob>(url, { responseType: "blob" })
  const blobUrl = window.URL.createObjectURL(response.data)
  const link = document.createElement("a")
  link.href = blobUrl
  link.target = "_blank"
  link.rel = "noopener noreferrer"
  link.download = fallbackName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(blobUrl)
}
