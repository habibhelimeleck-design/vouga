'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types'

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function updateProfile(
  updates: Partial<Pick<Profile,
    'full_name' | 'phone' | 'whatsapp' | 'company_name' | 'company_reg' | 'avatar_url'
  >>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profil')
  return { success: true }
}

export async function submitVerification(
  docs: Array<{ type: string; url: string }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { error: docsError } = await supabase.from('documents').insert(
    docs.map(d => ({ profile_id: user.id, type: d.type, file_url: d.url }))
  )
  if (docsError) return { error: docsError.message }

  const { error } = await supabase
    .from('profiles')
    .update({ verification_status: 'submitted', updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profil')
  return { success: true }
}