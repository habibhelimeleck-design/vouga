import { PublicHeader } from '@/components/layout/Header'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
    </>
  )
}
