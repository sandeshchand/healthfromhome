export type UserSession = {
  token: string
  user_id: number
  email: string
  is_patient_family: boolean
}

export type CurrentUser = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_patient_family: boolean
  is_provider: boolean
  date_joined: string
}

export type PatientProfile = {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  gender: "M" | "F" | "O"
  address: string
  medical_history: string
  emergency_contact_name: string
  emergency_contact_phone: string
}

export type City = {
  id: number
  name: string
  is_active: boolean
}

export type ServiceArea = {
  id: number
  name: string
  description: string
  is_active: boolean
}

export type Service = {
  id: number
  name: string
  description: string
  is_active: boolean
}

export type ServicePricing = {
  id: number
  service: Service
  city: City
  service_area: ServiceArea
  base_price: string
  price_per_km: string
  night_charge: string
  weekend_charge: string
  is_active: boolean
}

export type Booking = {
  id: number
  patient: number
  service_pricing: number
  patient_details: PatientProfile
  service_details: ServicePricing
  payment_details?: Payment | null
  assignment_details?: BookingAssignment | null
  status: string
  requested_date: string
  requested_time: string | null
  special_instructions: string
  created_at: string
  updated_at: string
}

export type BookingAssignment = {
  id: number
  provider_name: string
  provider_username: string
  provider_specialization: string
  provider_phone_number: string
  provider_bio: string
  assigned_at: string
  notes: string
}

export type Payment = {
  id: number
  booking: number
  amount: string
  currency: string
  payment_method: "CARD" | "KHALTI" | "ESEWA"
  gateway: "MOCK" | "STRIPE" | "KHALTI" | "ESEWA"
  status: string
  transaction_id: string
  gateway_payment_id: string
  gateway_reference: string
  paid_at: string | null
  failure_reason: string
  created_at: string
  updated_at: string
}

export type MedicalRecord = {
  id: number
  patient: number
  booking: number | null
  patient_details?: PatientProfile
  booking_service_details?: ServicePricing | null
  booking_status?: string | null
  booking_requested_date?: string | null
  title: string
  description: string
  file: string
  file_url: string | null
  uploaded_at: string
}

export type Reminder = {
  id: number
  patient: number
  booking: number | null
  patient_details: PatientProfile
  booking_service_details?: ServicePricing | null
  title: string
  notes: string
  due_date: string
  due_time: string | null
  channel: "PHONE" | "EMAIL" | "MANUAL"
  status: "PENDING" | "COMPLETED" | "CANCELLED"
  created_at: string
  updated_at: string
}
