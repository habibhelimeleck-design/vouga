'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Truck, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { stagger, staggerItem } from '@/lib/motion'
import { PARCEL_STATUS_LABELS } from '@/types'
import type { Parcel, ParcelStatus } from '@/types'

const STATUS_CFG: Record<ParcelStatus, { variant: 'success' | 'accent' | 'warning' | 'destructive' | 'default'; icon: React.ElementType }> = {
  created:    { variant: 'default',     icon: Clock       },
  accepted:   { variant: 'accent',      icon: CheckCircle },
  picked_up:  { variant: 'accent',      icon: Truck       },
  in_transit: { variant: 'accent',      icon: Truck       },
  delivered:  { variant: 'success',     icon: CheckCircle },
  dispute:    { variant: 'destructive', icon: AlertCircle },
}

function ParcelCard({ parcel, role }: { parcel: Parcel; role: 'sender' | 'traveler' }) {
  const cfg = STATUS_CFG[parcel.status]
  const Icon = cfg.icon
  const other = role === 'sender' ? parcel.traveler : parcel.sender

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/colis/${parcel.id}`} className="block">
        <Card elevation="raised" hoverable className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="ghost" className="text-xs">
              {role === 'sender' ? 'Envoi' : 'Transport'}
            </Badge>
            <Badge variant={cfg.variant}>
              <Icon className="size-3" />
              {PARCEL_STATUS_LABELS[parcel.status]}
            </Badge>
          </div>

          {other && (
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-semibold shrink-0">
                {other.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-sm text-text truncate">{other.full_name}</span>
            </div>
          )}

          <p className="text-xs text-subtle">
            {new Date(parcel.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
        </Card>
      </Link>
    </motion.div>
  )
}

function ColisSection({
  title,
  subtitle,
  parcels,
  role,
}: {
  title: string
  subtitle: string
  parcels: Parcel[]
  role: 'sender' | 'traveler'
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-display font-semibold text-text text-lg tracking-tight">{title}</h2>
        <p className="text-sm text-muted mt-0.5">{subtitle}</p>
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {parcels.map(p => (
          <ParcelCard key={p.id} parcel={p} role={role} />
        ))}
      </motion.div>
    </div>
  )
}

export function ColisSections({ asSender, asTraveler }: { asSender: Parcel[]; asTraveler: Parcel[] }) {
  return (
    <div className="flex flex-col gap-8">
      {asSender.length > 0 && (
        <ColisSection
          title="Mes envois"
          subtitle="Colis que vous expédiez"
          parcels={asSender}
          role="sender"
        />
      )}
      {asTraveler.length > 0 && (
        <ColisSection
          title="Mes transports"
          subtitle="Colis que vous transportez"
          parcels={asTraveler}
          role="traveler"
        />
      )}
    </div>
  )
}