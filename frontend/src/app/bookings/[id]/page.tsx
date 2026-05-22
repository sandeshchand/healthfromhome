"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { CheckCircle2, CreditCard, FileText, Info, ShieldCheck, Smartphone, UserRoundCheck, WalletCards } from "lucide-react"
import { api } from "@/lib/api"
import { hasToken } from "@/lib/auth"
import { formatNpr } from "@/lib/format"
import { statusGuidance } from "@/lib/status"
import type { Booking, MedicalRecord, Payment } from "@/lib/types"
import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { StatusTimeline } from "@/components/status-timeline"

type PaymentMethod = "CARD" | "KHALTI" | "ESEWA"

const paymentMethods: Array<{
  value: PaymentMethod
  label: string
  helper: string
}> = [
  { value: "CARD", label: "Visa / Mastercard", helper: "For family members abroad" },
  { value: "KHALTI", label: "Khalti", helper: "Mock Nepal wallet payment" },
  { value: "ESEWA", label: "eSewa", helper: "Mock Nepal wallet payment" },
]

export default function BookingDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasToken()) {
      router.push("/login")
      return
    }

    Promise.all([
      api.get<Booking>(`/bookings/${params.id}/`),
      api.get<MedicalRecord[]>("/records/"),
    ])
      .then(([bookingResponse, recordResponse]) => {
        setBooking(bookingResponse.data)
        setRecords(recordResponse.data)
      })
      .finally(() => setLoading(false))
  }, [params.id, router])

  const linkedRecords = useMemo(
    () => records.filter((record) => record.booking === booking?.id),
    [records, booking],
  )
  const guidance = booking ? statusGuidance(booking.status) : null

  function refreshBooking() {
    api.get<Booking>(`/bookings/${params.id}/`).then((response) => setBooking(response.data))
  }

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <p className="text-zinc-600">Loading booking...</p>
        ) : !booking ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            Booking not found.
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-lg border border-emerald-100 bg-[linear-gradient(135deg,#ffffff_0%,#ecfdf5_55%,#e0f2fe_100%)] p-6 shadow-lg shadow-emerald-900/10">
              <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link href="/bookings" className="text-sm font-medium text-emerald-700 hover:underline">
                  Back to bookings
                </Link>
                <h1 className="mt-3 text-3xl font-semibold">Booking #{booking.id}</h1>
                <p className="mt-2 text-zinc-600">
                  {booking.service_details.service.name} for {booking.patient_details.first_name} {booking.patient_details.last_name}
                </p>
              </div>
              <StatusBadge status={booking.status} />
              </div>
            </div>

            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Status timeline</h2>
                  <p className="mt-1 text-sm text-zinc-600">Follow the request from admin review to completion.</p>
                </div>
                <p className="text-sm font-medium text-zinc-500">Current: {guidance?.title}</p>
              </div>
              <div className="mt-4"><StatusTimeline status={booking.status} /></div>
            </section>

            {guidance && (
              <section className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm shadow-emerald-900/10">
                <div className="flex gap-3">
                  <Info className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <div>
                    <h2 className="font-semibold text-emerald-950">{guidance.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-emerald-900">{guidance.text}</p>
                    <p className="mt-3 text-sm font-semibold text-emerald-950">Next: {guidance.next}</p>
                  </div>
                </div>
              </section>
            )}

            <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-lg border border-emerald-100 bg-white/90 p-5 shadow-sm shadow-emerald-900/10">
                <h2 className="text-lg font-semibold">Booking details</h2>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <Detail label="Patient" value={`${booking.patient_details.first_name} ${booking.patient_details.last_name}`} />
                  <Detail label="Service" value={booking.service_details.service.name} />
                  <Detail label="Requested date" value={booking.requested_date} />
                  <Detail label="Requested time" value={booking.requested_time || "Flexible"} />
                  <Detail label="City" value={booking.service_details.city.name} />
                  <Detail label="Service area" value={booking.service_details.service_area.name} />
                  <Detail label="Starting price" value={formatNpr(booking.service_details.base_price)} />
                  <Detail label="Weekend charge" value={formatNpr(booking.service_details.weekend_charge)} />
                </dl>
                {booking.special_instructions && (
                  <div className="mt-5 rounded-lg border border-sky-100 bg-sky-50/70 p-4 text-sm text-zinc-700">
                    <p className="font-semibold text-zinc-950">Special instructions</p>
                    <p className="mt-2">{booking.special_instructions}</p>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <ProviderCard booking={booking} />
                <PaymentCard booking={booking} onPaymentUpdated={refreshBooking} />
              </div>
            </section>

            <section className="rounded-lg border border-emerald-100 bg-white/90 p-5 shadow-sm shadow-emerald-900/10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Reports linked to this booking</h2>
                  <p className="mt-1 text-sm text-zinc-600">Uploaded documents are private to this family account.</p>
                </div>
                <ShieldCheck className="size-6 text-emerald-700" aria-hidden="true" />
              </div>
              {linkedRecords.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 p-4 text-sm text-zinc-600">
                  No report has been uploaded for this booking yet.
                </p>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {linkedRecords.map((record) => (
                    <article key={record.id} className="rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-sky-50/80 p-4">
                      <div className="flex gap-3">
                        <FileText className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold">{record.title}</h3>
                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                            Uploaded {record.uploaded_at.slice(0, 10)}
                          </p>
                          {record.description && <p className="mt-2 text-sm text-zinc-600">{record.description}</p>}
                          {record.file_url && (
                            <Link
                              href={record.file_url}
                              target="_blank"
                              className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                              View report
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </PageShell>
  )
}

function ProviderCard({ booking }: { booking: Booking }) {
  const assignment = booking.assignment_details
  const providerName = assignment?.provider_name || assignment?.provider_username

  return (
    <div className="rounded-lg border border-emerald-100 bg-white/90 p-5 shadow-sm shadow-emerald-900/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Assigned provider</h2>
          <p className="mt-1 text-sm text-zinc-600">Provider assignment is managed by admin.</p>
        </div>
        <UserRoundCheck className="size-6 text-emerald-700" aria-hidden="true" />
      </div>

      {assignment ? (
        <div className="mt-5 rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-sky-50/80 p-4">
          <p className="text-xl font-semibold">{providerName}</p>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <Detail label="Specialization" value={assignment.provider_specialization || "Care provider"} />
            <Detail label="Phone" value={assignment.provider_phone_number || "Shared by admin if needed"} />
            <Detail label="Assigned date" value={assignment.assigned_at.slice(0, 10)} />
          </div>
          {assignment.provider_bio && <p className="mt-4 text-sm leading-6 text-zinc-600">{assignment.provider_bio}</p>}
          {assignment.notes && (
            <div className="mt-4 rounded-lg bg-white/80 p-3 text-sm leading-6 text-zinc-700">
              <p className="font-semibold text-zinc-950">Assignment notes</p>
              <p className="mt-1">{assignment.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 p-4 text-sm leading-6 text-zinc-600">
          Provider has not been assigned yet. After admin confirms availability, the assigned provider details will appear here.
        </div>
      )}
    </div>
  )
}

function PaymentCard({
  booking,
  onPaymentUpdated,
}: {
  booking: Booking
  onPaymentUpdated: () => void
}) {
  const [payment, setPayment] = useState<Payment | null>(booking.payment_details ?? null)
  const [cardholder, setCardholder] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [walletPhone, setWalletPhone] = useState("")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(booking.payment_details?.payment_method ?? "CARD")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const currentPayment = payment ?? booking.payment_details
  const completed = currentPayment?.status === "COMPLETED"
  const activeMethod = currentPayment?.payment_method ?? selectedMethod

  async function startPayment() {
    setSubmitting(true)
    setError("")

    try {
      const response = await api.post<Payment>("/payments/start/", {
        booking_id: booking.id,
        payment_method: selectedMethod,
      })
      setPayment(response.data)
      onPaymentUpdated()
    } catch {
      setError("Could not start payment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmMockPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError("")

    const digits = cardNumber.replace(/\D/g, "")
    if (digits.length < 12 || digits.length > 19) {
      setSubmitting(false)
      setError("Enter a valid mock card number. You can use 4242 4242 4242 4242.")
      return
    }

    if (!currentPayment) {
      setSubmitting(false)
      setError("Start the payment first.")
      return
    }

    try {
      const response = await api.post<Payment>("/payments/confirm-mock/", {
        payment_id: currentPayment.id,
        card_last4: digits.slice(-4),
      })
      setPayment(response.data)
      setCardholder("")
      setCardNumber("")
      setExpiry("")
      setCvc("")
      onPaymentUpdated()
    } catch {
      setError("Mock payment failed. Please check the test card details.")
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmMockWalletPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError("")

    if (!currentPayment) {
      setSubmitting(false)
      setError("Start the payment first.")
      return
    }

    const walletDigits = walletPhone.replace(/\D/g, "")
    if (walletDigits.length < 8) {
      setSubmitting(false)
      setError("Enter a valid mock wallet phone number.")
      return
    }

    try {
      const response = await api.post<Payment>("/payments/confirm-mock/", {
        payment_id: currentPayment.id,
        wallet_phone: walletPhone,
      })
      setPayment(response.data)
      setWalletPhone("")
      onPaymentUpdated()
    } catch {
      setError("Mock wallet payment failed. Please check the phone number.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-900/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Payment</h2>
          <p className="mt-1 text-sm text-zinc-600">Local mock payment for testing the customer flow.</p>
        </div>
        <CreditCard className="size-6 text-emerald-700" aria-hidden="true" />
      </div>
      {currentPayment ? (
        <div className="mt-5 rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50/80 to-emerald-50/80 p-4">
          <p className="text-3xl font-semibold">{formatNpr(currentPayment.amount)}</p>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <Detail label="Payment status" value={currentPayment.status} />
            <Detail label="Payment method" value={paymentMethodLabel(currentPayment.payment_method)} />
            <Detail label="Transaction ID" value={currentPayment.transaction_id || "Waiting for payment"} />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-sky-300 bg-sky-50/70 p-4 text-sm leading-6 text-zinc-600">
          Payment has not started yet. For this local MVP, the amount uses the selected service starting price.
        </div>
      )}

      {completed ? (
        <div className="mt-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Payment completed</p>
            <p className="mt-1">This booking is now marked as paid in the local mock flow.</p>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          {!currentPayment ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-zinc-950">Choose payment method</p>
                <div className="mt-3 grid gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setSelectedMethod(method.value)}
                      className={
                        selectedMethod === method.value
                          ? "rounded-lg border border-emerald-500 bg-emerald-50 p-3 text-left shadow-sm shadow-emerald-900/10"
                          : "rounded-lg border border-zinc-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50"
                      }
                    >
                      <span className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700">
                          {method.value === "CARD" ? <CreditCard className="size-4" aria-hidden="true" /> : <Smartphone className="size-4" aria-hidden="true" />}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-zinc-950">{method.label}</span>
                          <span className="mt-1 block text-xs text-zinc-500">{method.helper}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={startPayment}
                disabled={submitting}
                className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Starting..." : `Pay now with ${paymentMethodLabel(selectedMethod)}`}
              </button>
            </div>
          ) : activeMethod === "CARD" ? (
            <CardPaymentForm
              cardholder={cardholder}
              cardNumber={cardNumber}
              cvc={cvc}
              error={error}
              expiry={expiry}
              submitting={submitting}
              onCardholderChange={setCardholder}
              onCardNumberChange={setCardNumber}
              onCvcChange={setCvc}
              onExpiryChange={setExpiry}
              onSubmit={confirmMockPayment}
            />
          ) : (
            <WalletPaymentForm
              error={error}
              method={activeMethod}
              submitting={submitting}
              walletPhone={walletPhone}
              onSubmit={confirmMockWalletPayment}
              onWalletPhoneChange={setWalletPhone}
            />
          )}
          {error && !currentPayment && <p className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
      )}
    </div>
  )
}

function CardPaymentForm({
  cardholder,
  cardNumber,
  cvc,
  error,
  expiry,
  submitting,
  onCardholderChange,
  onCardNumberChange,
  onCvcChange,
  onExpiryChange,
  onSubmit,
}: {
  cardholder: string
  cardNumber: string
  cvc: string
  error: string
  expiry: string
  submitting: boolean
  onCardholderChange: (value: string) => void
  onCardNumberChange: (value: string) => void
  onCvcChange: (value: string) => void
  onExpiryChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white/80 p-4">
      <div>
        <p className="text-sm font-semibold text-zinc-950">Mock card payment</p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          Use test card 4242 4242 4242 4242. This does not charge real money.
        </p>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-zinc-900">Cardholder name</span>
        <input
          value={cardholder}
          onChange={(event) => onCardholderChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="Family Member"
          required
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-zinc-900">Card number</span>
        <input
          value={cardNumber}
          onChange={(event) => onCardNumberChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          required
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-zinc-900">Expiry</span>
          <input
            value={expiry}
            onChange={(event) => onExpiryChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="12/30"
            required
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-zinc-900">CVC</span>
          <input
            value={cvc}
            onChange={(event) => onCvcChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            inputMode="numeric"
            placeholder="123"
            required
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Processing..." : "Complete mock card payment"}
      </button>
    </form>
  )
}

function WalletPaymentForm({
  error,
  method,
  submitting,
  walletPhone,
  onSubmit,
  onWalletPhoneChange,
}: {
  error: string
  method: PaymentMethod
  submitting: boolean
  walletPhone: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onWalletPhoneChange: (value: string) => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white/80 p-4">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <WalletCards className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-950">Mock {paymentMethodLabel(method)} payment</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Enter a test wallet phone number. This does not connect to the real {paymentMethodLabel(method)} gateway yet.
          </p>
        </div>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-zinc-900">Wallet phone number</span>
        <input
          value={walletPhone}
          onChange={(event) => onWalletPhoneChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          inputMode="tel"
          placeholder="9800000000"
          required
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Processing..." : `Complete mock ${paymentMethodLabel(method)} payment`}
      </button>
    </form>
  )
}

function paymentMethodLabel(method: PaymentMethod) {
  if (method === "KHALTI") return "Khalti"
  if (method === "ESEWA") return "eSewa"
  return "Visa / Mastercard"
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 font-medium text-zinc-950">{value}</dd>
    </div>
  )
}
