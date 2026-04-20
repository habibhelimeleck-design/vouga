export type UserType = 'individual' | 'company'
export type VerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected'
export type TransportMode = 'road' | 'air' | 'sea'
export type TripStatus = 'active' | 'full' | 'completed' | 'cancelled'
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'
export type ParcelRequestStatus = 'open' | 'matched' | 'closed'
export type ParcelStatus =
  | 'created'
  | 'accepted'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'dispute'

export interface Profile {
  id: string
  type: UserType
  full_name: string
  phone: string | null
  whatsapp: string
  avatar_url: string | null
  company_name: string | null
  company_reg: string | null
  verification_status: VerificationStatus
  verification_note: string | null
  is_admin: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface Trip {
  id: string
  traveler_id: string
  traveler?: Profile
  origin_city: string
  destination_city: string
  departure_date: string
  arrival_date: string | null
  transport_mode: TransportMode
  max_weight_kg: number
  notes: string | null
  whatsapp: string
  status: TripStatus
  created_at: string
}

export interface ParcelRequest {
  id: string
  sender_id: string
  sender?: Profile
  origin_city: string
  destination_city: string
  weight_kg: number
  description: string
  photo_urls: string[]
  special_instructions: string | null
  whatsapp: string
  status: ParcelRequestStatus
  created_at: string
}

export interface Booking {
  id: string
  trip_id: string
  trip?: Trip
  parcel_request_id: string | null
  parcel_request?: ParcelRequest
  sender_id: string
  sender?: Profile
  traveler_id: string
  traveler?: Profile
  weight_kg: number
  notes: string | null
  status: BookingStatus
  created_at: string
}

export interface Parcel {
  id: string
  booking_id: string
  booking?: Booking
  sender_id: string
  sender?: Profile
  traveler_id: string
  traveler?: Profile
  secret_code: string
  status: ParcelStatus
  pickup_proof_url: string | null
  delivery_proof_url: string | null
  pickup_confirmed_at: string | null
  delivery_confirmed_at: string | null
  created_at: string
  updated_at: string
  events?: ParcelEvent[]
}

export interface ParcelEvent {
  id: string
  parcel_id: string
  status: ParcelStatus
  note: string | null
  actor_id: string
  actor?: Profile
  photo_url: string | null
  created_at: string
}

export interface Review {
  id: string
  parcel_id: string
  reviewer_id: string
  reviewer?: Profile
  reviewed_id: string
  role: 'sender' | 'traveler'
  rating: number
  comment: string | null
  created_at: string
}

export interface Document {
  id: string
  profile_id: string
  type: 'id_card' | 'passport' | 'company_reg' | 'selfie'
  file_url: string
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  created_at: string
}

export const PARCEL_STATUS_LABELS: Record<ParcelStatus, string> = {
  created:    'Créé',
  accepted:   'Accepté',
  picked_up:  'Récupéré',
  in_transit: 'En route',
  delivered:  'Livré',
  dispute:    'Litige',
}

export const PARCEL_STATUS_ORDER: ParcelStatus[] = [
  'created',
  'accepted',
  'picked_up',
  'in_transit',
  'delivered',
]
