'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Weight, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { stagger, staggerItem } from '@/lib/motion'
import { getCityLabel, TRANSPORT_MODES } from '@/lib/constants/corridors'
import type { Trip } from '@/types'

const TRANSPORT_ICONS: Record<string, string> = {
  road: '🚗',
  air:  '✈️',
  sea:  '⛵',
}

function TripCard({ trip }: { trip: Trip }) {
  const mode = TRANSPORT_MODES.find(m => m.value === trip.transport_mode)
  const departureDate = new Date(trip.departure_date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/trajets/${trip.id}`} className="block">
        <Card elevation="raised" hoverable className="flex flex-col gap-3">
          {/* Route */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display font-semibold text-text text-base leading-tight truncate">
              {getCityLabel(trip.origin_city)}
            </span>
            <ArrowRight className="size-3.5 text-accent shrink-0" />
            <span className="font-display font-semibold text-text text-base leading-tight truncate">
              {getCityLabel(trip.destination_city)}
            </span>
            <Badge variant="default" className="ml-auto shrink-0">
              {TRANSPORT_ICONS[trip.transport_mode]} {mode?.label}
            </Badge>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" />
              {departureDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Weight className="size-3.5 shrink-0" />
              {trip.max_weight_kg} kg max
            </span>
          </div>

          {/* Voyageur */}
          {trip.traveler && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <div className="size-6 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-semibold shrink-0">
                {trip.traveler.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-xs text-muted truncate">{trip.traveler.full_name}</span>
              {trip.traveler.rating > 0 && (
                <span className="text-xs text-accent/70 ml-auto shrink-0">
                  ★ {trip.traveler.rating.toFixed(1)}
                </span>
              )}
            </div>
          )}

          {trip.notes && (
            <p className="text-xs text-subtle truncate">{trip.notes}</p>
          )}
        </Card>
      </Link>
    </motion.div>
  )
}

export function TripList({ trips }: { trips: Trip[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-3"
    >
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </motion.div>
  )
}