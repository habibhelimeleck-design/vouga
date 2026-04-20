import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Avatar } from '@/components/ui/Avatar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, verification_status')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex flex-col min-h-dvh">
      <Header
        action={
          <Link href="/profil" aria-label="Mon profil">
            <Avatar
              name={profile?.full_name}
              src={profile?.avatar_url}
              size="sm"
              verified={profile?.verification_status === 'verified'}
            />
          </Link>
        }
      />
      <div className="flex-1">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}