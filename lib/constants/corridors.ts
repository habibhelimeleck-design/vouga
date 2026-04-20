export const GABON_CITIES = [
  { value: 'libreville', label: 'Libreville', country: 'Gabon' },
  { value: 'paris',      label: 'Paris',      country: 'France' },
  { value: 'lyon',       label: 'Lyon',       country: 'France' },
  { value: 'marseille',  label: 'Marseille',  country: 'France' },
  { value: 'nantes',     label: 'Nantes',     country: 'France' },
  { value: 'bordeaux',   label: 'Bordeaux',   country: 'France' },
  { value: 'rennes',     label: 'Rennes',     country: 'France' },
] as const

export type GabonCity = typeof GABON_CITIES[number]['value']

export const FRANCE_CITIES = GABON_CITIES.filter(c => c.country === 'France')

export const ACTIVE_CORRIDORS: { from: GabonCity; to: GabonCity }[] = [
  { from: 'libreville', to: 'paris' },
  { from: 'paris',      to: 'libreville' },
  { from: 'libreville', to: 'lyon' },
  { from: 'lyon',       to: 'libreville' },
  { from: 'libreville', to: 'marseille' },
  { from: 'marseille',  to: 'libreville' },
  { from: 'libreville', to: 'nantes' },
  { from: 'nantes',     to: 'libreville' },
  { from: 'libreville', to: 'bordeaux' },
  { from: 'bordeaux',   to: 'libreville' },
  { from: 'libreville', to: 'rennes' },
  { from: 'rennes',     to: 'libreville' },
]

export function getCityLabel(value: string): string {
  return GABON_CITIES.find(c => c.value === value)?.label ?? value
}

export const TRANSPORT_MODES = [
  { value: 'road', label: 'Voiture / Bus' },
  { value: 'air',  label: 'Avion' },
  { value: 'sea',  label: 'Bateau' },
] as const