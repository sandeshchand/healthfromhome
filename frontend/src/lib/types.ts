export type UserSession = {
  token: string
  user_id: number
  email: string
  is_patient_family: boolean
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
  amount: string
  status: string
  transaction_id: string
  created_at: string
  updated_at: string
}

export type MedicalRecord = {
  id: number
  patient: number
  booking: number | null
  title: string
  description: string
  file: string
  file_url: string | null
  uploaded_at: string
}
