export const bookingStatusSteps = [
  { value: "REQUESTED", label: "Requested" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "PAYMENT_PENDING", label: "Payment pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
]

export function formatStatus(status: string) {
  const match = bookingStatusSteps.find((step) => step.value === status)
  if (match) return match.label

  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}

export function statusTone(status: string) {
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-800"
  if (status === "CANCELLED") return "bg-red-100 text-red-800"
  if (status === "PAYMENT_PENDING") return "bg-amber-100 text-amber-800"
  if (status === "CONFIRMED" || status === "ASSIGNED" || status === "IN_PROGRESS") return "bg-blue-100 text-blue-800"
  return "bg-zinc-100 text-zinc-800"
}

export function statusGuidance(status: string) {
  switch (status) {
    case "REQUESTED":
      return {
        title: "Your request has been received",
        text: "Our admin team will review patient details, service area, schedule, and starting price.",
        next: "Wait for admin review or contact support if the request is urgent.",
      }
    case "UNDER_REVIEW":
      return {
        title: "Admin is reviewing this request",
        text: "We are checking provider availability, timing, and any special instructions.",
        next: "Admin will confirm the request or ask for more information.",
      }
    case "PAYMENT_PENDING":
      return {
        title: "Payment is pending",
        text: "The final amount has been reviewed and payment needs to be completed or marked manually by admin.",
        next: "Complete payment using the agreed manual process, then admin will update the status.",
      }
    case "CONFIRMED":
      return {
        title: "Booking is confirmed",
        text: "The request is approved and ready for provider assignment.",
        next: "Admin will assign a provider and update this page.",
      }
    case "ASSIGNED":
      return {
        title: "Provider has been assigned",
        text: "A care professional or coordinator has been assigned for this service request.",
        next: "Watch for the visit or appointment status to move into progress.",
      }
    case "IN_PROGRESS":
      return {
        title: "Service is in progress",
        text: "The care request is currently being handled.",
        next: "After completion, admin can upload reports or follow-up notes.",
      }
    case "COMPLETED":
      return {
        title: "Service completed",
        text: "The care request has been completed.",
        next: "Review uploaded reports and follow-up instructions if available.",
      }
    case "FOLLOW_UP_REQUIRED":
      return {
        title: "Follow-up required",
        text: "Admin has marked this request for follow-up care or additional coordination.",
        next: "Check reports or wait for the next instruction from the care team.",
      }
    case "CANCELLED":
      return {
        title: "Booking cancelled",
        text: "This request is no longer active.",
        next: "Create a new booking if the family still needs support.",
      }
    default:
      return {
        title: formatStatus(status),
        text: "This booking status has been updated by admin.",
        next: "Check this page for the latest updates.",
      }
  }
}
