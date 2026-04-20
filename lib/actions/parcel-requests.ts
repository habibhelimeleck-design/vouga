'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ParcelRequest } from '@/types'

export interface ParcelRequestFilters {
  origin?: string
  destination?: string
}

export async function getParcelRequests(
  filters: ParcelRequestFilters = {}
): Promise<ParcelRequest[]> {
  const supabase = await createClient()

  let query = supabase
    .from('parcel_requests')
    .select('*, sender:profiles(*)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (filters.origin)      query = query.eq('origin_city', filters.origin)
  if (filters.destination) query = query.eq('destination_city', filters.destination)

  const { data } = await query
  return (data ?? []) as ParcelRequest[]
}

export async function getParcelRequest(id: string): Promise<ParcelRequest | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('parcel_requests')
    .select('*, sender:profiles(*)')
    .eq('id', id)
    .single()

  return data as ParcelRequest | null
}

export async function getMyParcelRequests(): Promise<ParcelRequest[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('parcel_requests')
    .select('*')
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false })

  return (data ?? []) as ParcelRequest[]
}

export async function createParcelRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('verification_status')
    .eq('id', user.id)
    .single()

  if (profile?.verification_status !== 'verified') {
    return { error: 'Votre identité doit être vérifiée avant de publier une demande.' }
  }

  const rawPhotos = formData.get('photo_urls') as string
  const photoUrls = rawPhotos
    ? rawPhotos.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const payload = {
    sender_id:            user.id,
    origin_city:          formData.get('origin_city') as string,
    destination_city:     formData.get('destination_city') as string,
    weight_kg:            parseFloat(formData.get('weight_kg') as string),
    description:          formData.get('description') as string,
    special_instructions: (formData.get('special_instructions') as string) || null,
    whatsapp:             formData.get('whatsapp') as string,
    photo_urls:           photoUrls,
  }

  if (!payload.origin_city || !payload.destination_city || !payload.description || !payload.whatsapp) {
    return { error: 'Champs obligatoires manquants.' }
  }
  if (payload.origin_city === payload.destination_city) {
    return { error: "L'origine et la destination doivent être différentes." }
  }
  if (isNaN(payload.weight_kg) || payload.weight_kg <= 0) {
    return { error: 'Le poids doit être supérieur à 0.' }
  }

  const { data, error } = await supabase
    .from('parcel_requests')
    .insert(payload)
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/demandes')
  redirect(`/demandes/${data.id}`)
}

export async function closeParcelRequest(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { error } = await supabase
    .from('parcel_requests')
    .update({ status: 'closed' })
    .eq('id', id)
    .eq('sender_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/demandes')
  revalidatePath(`/demandes/${id}`)
  return { success: true }
}
