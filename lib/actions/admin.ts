'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Document, Parcel, Profile } from '@/types'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return profile?.is_admin ? user : null
}

// ── Stats ──────────────────────────────────────────────────

export async function getAdminStats() {
  const user = await assertAdmin()
  if (!user) return null

  const admin = createAdminClient()

  const [
    { count: pendingDocs },
    { count: disputes },
    { count: totalUsers },
    { count: verifiedUsers },
  ] = await Promise.all([
    admin.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    admin.from('parcels').select('*', { count: 'exact', head: true }).eq('status', 'dispute'),
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
  ])

  return {
    pendingDocs: pendingDocs ?? 0,
    disputes: disputes ?? 0,
    totalUsers: totalUsers ?? 0,
    verifiedUsers: verifiedUsers ?? 0,
  }
}

// ── Documents ──────────────────────────────────────────────

export interface DocumentWithProfile extends Document {
  profile: Pick<Profile, 'id' | 'full_name' | 'type' | 'verification_status'>
}

export async function getPendingDocuments(): Promise<DocumentWithProfile[]> {
  const user = await assertAdmin()
  if (!user) return []

  const admin = createAdminClient()
  const { data } = await admin
    .from('documents')
    .select('*, profile:profiles(id, full_name, type, verification_status)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (data ?? []) as DocumentWithProfile[]
}

export async function approveDocument(documentId: string) {
  const user = await assertAdmin()
  if (!user) return { error: 'Non autorisé' }

  const admin = createAdminClient()

  const { data: doc } = await admin
    .from('documents')
    .select('profile_id')
    .eq('id', documentId)
    .single()

  if (!doc) return { error: 'Document introuvable' }

  const { error } = await admin
    .from('documents')
    .update({ status: 'approved', admin_note: null })
    .eq('id', documentId)

  if (error) return { error: error.message }

  // Vérifie si tous les docs de ce profil sont approuvés
  const { data: remaining } = await admin
    .from('documents')
    .select('status')
    .eq('profile_id', doc.profile_id)
    .neq('status', 'approved')

  if (!remaining || remaining.length === 0) {
    await admin
      .from('profiles')
      .update({ verification_status: 'verified' })
      .eq('id', doc.profile_id)
  }

  revalidatePath('/admin/documents')
  return { success: true }
}

export async function rejectDocument(documentId: string, note: string) {
  const user = await assertAdmin()
  if (!user) return { error: 'Non autorisé' }

  const admin = createAdminClient()

  const { data: doc } = await admin
    .from('documents')
    .select('profile_id')
    .eq('id', documentId)
    .single()

  if (!doc) return { error: 'Document introuvable' }

  const { error } = await admin
    .from('documents')
    .update({ status: 'rejected', admin_note: note })
    .eq('id', documentId)

  if (error) return { error: error.message }

  await admin
    .from('profiles')
    .update({ verification_status: 'rejected', verification_note: note })
    .eq('id', doc.profile_id)

  revalidatePath('/admin/documents')
  return { success: true }
}

// ── Litiges ────────────────────────────────────────────────

export interface DisputeParcel extends Omit<Parcel, 'sender' | 'traveler'> {
  sender: Pick<Profile, 'id' | 'full_name' | 'whatsapp'>
  traveler: Pick<Profile, 'id' | 'full_name' | 'whatsapp'>
}

export async function getDisputeParcels(): Promise<DisputeParcel[]> {
  const user = await assertAdmin()
  if (!user) return []

  const admin = createAdminClient()
  const { data } = await admin
    .from('parcels')
    .select(`
      *,
      sender:profiles!parcels_sender_id_fkey(id, full_name, whatsapp),
      traveler:profiles!parcels_traveler_id_fkey(id, full_name, whatsapp)
    `)
    .eq('status', 'dispute')
    .order('updated_at', { ascending: true })

  return (data ?? []) as DisputeParcel[]
}

export async function resolveDispute(parcelId: string, resolution: 'delivered' | 'cancelled', note: string) {
  const user = await assertAdmin()
  if (!user) return { error: 'Non autorisé' }

  const admin = createAdminClient()

  const { error } = await admin
    .from('parcels')
    .update({ status: resolution, updated_at: new Date().toISOString() })
    .eq('id', parcelId)
    .eq('status', 'dispute')

  if (error) return { error: error.message }

  await admin.from('parcel_events').insert({
    parcel_id: parcelId,
    status: resolution,
    note: `[Admin] ${note}`,
    actor_id: user.id,
  })

  revalidatePath('/admin/litiges')
  return { success: true }
}