'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/tableau-de-bord')
}

export async function signUp(data: {
  email: string
  password: string
  full_name: string
  whatsapp: string
  type: 'individual' | 'company'
  company_name?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        whatsapp: data.whatsapp,
        type: data.type,
        company_name: data.company_name ?? null,
      },
    },
  })

  if (error) return { error: error.message }
  redirect('/tableau-de-bord')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/connexion')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}