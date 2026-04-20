'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { stagger, staggerItem } from '@/lib/motion'
import { getCityLabel } from '@/lib/constants/corridors'
import type { ParcelRequest } from '@/types'

function ParcelRequestCard({ req }: { req: ParcelRequest }) {
  const createdAt = new Date(req.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short',
  })

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/demandes/${req.id}`} className="block">
        <Card elevation="raised" hoverable className="flex flex-col gap-3">
          {/* Route */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display font-semibold text-text text-base truncate">
              {getCityLabel(req.origin_city)}
            </span>
            <ArrowRight className="size-3.5 text-accent shrink-0" />
            <span className="font-display font-semibold text-text text-base truncate">
              {getCityLabel(req.destination_city)}
            </span>
            <Badge variant="accent" className="ml-auto shrink-0">
              {req.weight_kg} kg
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted line-clamp-2">{req.description}</p>

          {/* Photos preview */}
          {req.photo_urls.length > 0 && (
            <div className="flex gap-1.5">
              {req.photo_urls.slice(0, 3).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="size-14 rounded-[var(--radius-sm)] object-cover border border-border"
                />
              ))}
            </div>
          )}

          {/* Meta + Expéditeur */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            {req.sender && (
              <>
                <div className="size-6 rounded-full bg-surface-3 flex items-center justify-center text-subtle text-xs font-semibold shrink-0">
                  {req.sender.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span className="text-xs text-muted truncate flex-1">{req.sender.full_name}</span>
              </>
            )}
            <span className="text-xs text-subtle ml-auto shrink-0 flex items-center gap-1">
              <Calendar className="size-3" />
              {createdAt}
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

export function ParcelRequestList({ requests }: { requests: ParcelRequest[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-3"
    >
      {requests.map(req => (
        <ParcelRequestCard key={req.id} req={req} />
      ))}
    </motion.div>
  )
}