'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Trip } from '@/types'

export interface TripFilters {
  origin?: string
  destination?: string
  date?: string
}

export async function getTrips(filters: TripFilters = {}): Promise<Trip[]> {
  const supabase = await createClient()

  let query = supabase
    .from('trips')
    .select('*, traveler:profiles(*)')
    .eq('status', 'active')
    .order('departure_date', { ascending: true })

  if (filters.origin)      query = query.eq('origin_city', filters.origin)
  if (filters.destination) query = query.eq('destination_city', filters.destination)
  if (filters.date)        query = query.gte('departure_date', filters.date)

  const { data } = await query
  return (data ?? []) as Trip[]
}

export async function getTrip(id: string): Promise<Trip | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('trips')
    .select('*, traveler:profiles(*)')
    .eq('id', id)
    .single()

  return data as Trip | null
}

export async function getMyTrips(): Promise<Trip[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('trips')
    .select('*')
    .eq('traveler_id', user.id)
    .order('departure_date', { ascending: false })

  return (data ?? []) as Trip[]
}

export async function createTrip(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('verification_status')
    .eq('id', user.id)
    .single()

  if (profile?.verification_status !== 'verified') {
    return { error: 'Votre identité doit être vérifiée avant de publier un trajet.' }
  }

  const payload = {
    traveler_id:      user.id,
    origin_city:      formData.get('origin_city') as string,
    destination_city: formData.get('destination_city') as string,
    departure_date:   formData.get('departure_date') as string,
    arrival_date:     (formData.get('arrival_date') as string) || null,
    transport_mode:   formData.get('transport_mode') as string,
    max_weight_kg:    parseFloat(formData.get('max_weight_kg') as string),
    notes:            (formData.get('notes') as string) || null,
    whatsapp:         formData.get('whatsapp') as string,
  }

  if (!payload.origin_city || !payload.destination_city || !payload.departure_date || !payload.whatsapp) {
    return { error: 'Champs obligatoires manquants.' }
  }
  if (payload.origin_city === payload.destination_city) {
    return { error: "L'origine et la destination doivent être différentes." }
  }
  if (isNaN(payload.max_weight_kg) || payload.max_weight_kg <= 0) {
    return { error: 'Le poids maximum doit être supérieur à 0.' }
  }

  const { data, error } = await supabase.from('trips').insert(payload).select('id').single()
  if (error) return { error: error.message }

  revalidatePath('/trajets')
  redirect(`/trajets/${data.id}`)
}

export async function cancelTrip(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { error } = await supabase
    .from('trips')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('traveler_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/trajets')
  revalidatePath(`/trajets/${id}`)
  return { success: true }
}