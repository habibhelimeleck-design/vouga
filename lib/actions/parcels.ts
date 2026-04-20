'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Booking, Parcel, ParcelEvent } from '@/types'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ── Bookings ──────────────────────────────────────────────

export async function createBooking(parcelRequestId: string, notes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data: req } = await supabase
    .from('parcel_requests')
    .select('sender_id, status')
    .eq('id', parcelRequestId)
    .single()

  if (!req) return { error: 'Demande introuvable.' }
  if (req.status !== 'open') return { error: 'Cette demande n\'est plus ouverte.' }
  if (req.sender_id === user.id) return { error: 'Vous ne pouvez pas proposer sur votre propre demande.' }

  const { error } = await supabase.from('bookings').insert({
    parcel_request_id: parcelRequestId,
    traveler_id: user.id,
    sender_id: req.sender_id,
    notes: notes ?? null,
  })

  if (error) {
    if (error.code === '23505') return { error: 'Vous avez déjà proposé sur cette demande.' }
    return { error: error.message }
  }

  revalidatePath(`/demandes/${parcelRequestId}`)
  return { success: true }
}

export async function acceptBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('sender_id', user.id)
    .eq('status', 'pending')
    .single()

  if (!booking) return { error: 'Proposition introuvable.' }

  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'accepted' })
    .eq('id', bookingId)

  if (bookingError) return { error: bookingError.message }

  const secretCode = generateOTP()
  const { data: parcel, error: parcelError } = await supabase
    .from('parcels')
    .insert({
      booking_id: bookingId,
      parcel_request_id: booking.parcel_request_id,
      sender_id: booking.sender_id,
      traveler_id: booking.traveler_id,
      secret_code: secretCode,
    })
    .select('id')
    .single()

  if (parcelError) return { error: parcelError.message }

  await supabase.from('parcel_events').insert({
    parcel_id: parcel.id,
    status: 'created',
    actor_id: user.id,
    note: 'Colis enregistré sur la plateforme.',
  })

  await supabase
    .from('parcel_requests')
    .update({ status: 'matched' })
    .eq('id', booking.parcel_request_id)

  revalidatePath(`/demandes/${booking.parcel_request_id}`)
  revalidatePath('/colis')
  return { success: true, parcelId: parcel.id }
}

export async function rejectBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'rejected' })
    .eq('id', bookingId)
    .eq('sender_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/demandes')
  return { success: true }
}

export async function getBookingsForRequest(parcelRequestId: string): Promise<Booking[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('bookings')
    .select('*, traveler:profiles!bookings_traveler_id_fkey(*)')
    .eq('parcel_request_id', parcelRequestId)
    .order('created_at', { ascending: false })

  return (data ?? []) as Booking[]
}

// ── Parcels ───────────────────────────────────────────────

export interface ParcelWithDetails extends Parcel {
  events?: ParcelEvent[]
}

export async function getMyParcels(): Promise<{ asSender: Parcel[]; asTraveler: Parcel[] }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { asSender: [], asTraveler: [] }

  const [senderRes, travelerRes] = await Promise.all([
    supabase
      .from('parcels')
      .select('*, traveler:profiles!parcels_traveler_id_fkey(*)')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('parcels')
      .select('*, sender:profiles!parcels_sender_id_fkey(*)')
      .eq('traveler_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return {
    asSender: (senderRes.data ?? []) as Parcel[],
    asTraveler: (travelerRes.data ?? []) as Parcel[],
  }
}

export async function getParcel(id: string): Promise<ParcelWithDetails | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('parcels')
    .select(`
      *,
      sender:profiles!parcels_sender_id_fkey(*),
      traveler:profiles!parcels_traveler_id_fkey(*),
      events:parcel_events(*, actor:profiles(*))
    `)
    .eq('id', id)
    .order('created_at', { referencedTable: 'parcel_events', ascending: true })
    .single()

  return data as ParcelWithDetails | null
}

// ── OTP Confirmations ─────────────────────────────────────

export async function confirmPickup(formData: FormData) {
  const parcelId = formData.get('parcel_id') as string
  const code     = formData.get('code') as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data: parcel } = await supabase
    .from('parcels')
    .select('traveler_id, secret_code, status')
    .eq('id', parcelId)
    .single()

  if (!parcel) return { error: 'Colis introuvable.' }
  if (parcel.traveler_id !== user.id) return { error: 'Seul le voyageur peut confirmer la récupération.' }
  if (!['created', 'accepted'].includes(parcel.status)) return { error: 'Confirmation impossible à ce stade.' }
  if (parcel.secret_code !== code.trim()) return { error: 'Code incorrect. Demandez le code à l\'expéditeur.' }

  const { error } = await supabase
    .from('parcels')
    .update({ status: 'picked_up', pickup_confirmed_at: new Date().toISOString() })
    .eq('id', parcelId)

  if (error) return { error: error.message }

  await supabase.from('parcel_events').insert({
    parcel_id: parcelId,
    status: 'picked_up',
    actor_id: user.id,
    note: 'Colis récupéré par le voyageur.',
  })

  revalidatePath(`/colis/${parcelId}`)
  return { success: true }
}

export async function confirmDelivery(formData: FormData) {
  const parcelId = formData.get('parcel_id') as string
  const code     = formData.get('code') as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data: parcel } = await supabase
    .from('parcels')
    .select('sender_id, secret_code, status, parcel_request_id')
    .eq('id', parcelId)
    .single()

  if (!parcel) return { error: 'Colis introuvable.' }
  if (parcel.sender_id !== user.id) return { error: 'Seul l\'expéditeur peut confirmer la livraison.' }
  if (!['picked_up', 'in_transit'].includes(parcel.status)) return { error: 'Confirmation impossible à ce stade.' }
  if (parcel.secret_code !== code.trim()) return { error: 'Code incorrect. Demandez le code au voyageur.' }

  const { error } = await supabase
    .from('parcels')
    .update({ status: 'delivered', delivery_confirmed_at: new Date().toISOString() })
    .eq('id', parcelId)

  if (error) return { error: error.message }

  await supabase.from('parcel_events').insert({
    parcel_id: parcelId,
    status: 'delivered',
    actor_id: user.id,
    note: 'Colis livré et confirmé par l\'expéditeur.',
  })

  await supabase
    .from('parcel_requests')
    .update({ status: 'closed' })
    .eq('id', parcel.parcel_request_id)

  revalidatePath(`/colis/${parcelId}`)
  revalidatePath('/colis')
  return { success: true }
}

// ── Proof photos ──────────────────────────────────────────

export async function saveProofPhoto(
  parcelId: string,
  type: 'pickup' | 'delivery',
  photoUrl: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const field = type === 'pickup' ? 'pickup_proof_url' : 'delivery_proof_url'
  const { error } = await supabase
    .from('parcels')
    .update({ [field]: photoUrl })
    .eq('id', parcelId)

  if (error) return { error: error.message }

  await supabase.from('parcel_events').insert({
    parcel_id: parcelId,
    status: type === 'pickup' ? 'picked_up' : 'delivered',
    actor_id: user.id,
    photo_url: photoUrl,
    note: `Photo de ${type === 'pickup' ? 'récupération' : 'livraison'} ajoutée.`,
  })

  revalidatePath(`/colis/${parcelId}`)
  return { success: true }
}
