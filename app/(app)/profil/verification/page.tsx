'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageShell, PageSection } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import { submitVerification } from '@/lib/actions/profile'

type DocType = 'id_card' | 'passport' | 'selfie'
type IdType = 'id_card' | 'passport'

interface FileState {
  file: File
  preview: string
  uploading: boolean
  url?: string
}

const STATUS_UI = {
  pending: {
    icon: <Upload className="size-5 text-muted" />,
    title: 'Vérification requise',
    desc: 'Soumettez vos documents pour accéder à toutes les fonctionnalités.',
    color: '',
  },
  submitted: {
    icon: <Clock className="size-5 text-info" />,
    title: 'Documents envoyés',
    desc: 'Votre dossier est en cours d\'examen par notre équipe (24–48h).',
    color: 'bg-info/10 border-info/20',
  },
  verified: {
    icon: <CheckCircle2 className="size-5 text-success" />,
    title: 'Identité vérifiée',
    desc: 'Votre compte est vérifié. Vous pouvez publier et réserver.',
    color: 'bg-success/10 border-success/20',
  },
  rejected: {
    icon: <AlertCircle className="size-5 text-destructive" />,
    title: 'Vérification refusée',
    desc: 'Soumettez à nouveau vos documents en vous assurant qu\'ils sont lisibles.',
    color: 'bg-destructive/10 border-destructive/20',
  },
}

export default function VerificationPage() {
  const router = useRouter()
  const [status, setStatus] = useState<string | null>(null)
  const [idType, setIdType] = useState<IdType>('id_card')
  const [idFile, setIdFile] = useState<FileState | null>(null)
  const [selfieFile, setSelfieFile] = useState<FileState | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const idRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)

  // Load status on mount
  useState(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('profiles')
        .select('verification_status')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setStatus(data?.verification_status ?? 'pending'))
    })
  })

  function pickFile(e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    const state: FileState = { file, preview, uploading: false }
    if (type === 'id') setIdFile(state)
    else setSelfieFile(state)
    e.target.value = ''
  }

  async function upload(fileState: FileState, docType: DocType, userId: string): Promise<string> {
    const supabase = createClient()
    const ext = fileState.file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/${docType}-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, fileState.file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(data.path)
    return publicUrl
  }

  async function handleSubmit() {
    if (!idFile || !selfieFile) return
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const [idUrl, selfieUrl] = await Promise.all([
        upload(idFile, idType, user.id),
        upload(selfieFile, 'selfie', user.id),
      ])

      const result = await submitVerification([
        { type: idType, url: idUrl },
        { type: 'selfie', url: selfieUrl },
      ])

      if (result?.error) throw new Error(result.error)
      setStatus('submitted')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inattendue')
    } finally {
      setSubmitting(false)
    }
  }

  const ui = STATUS_UI[(status as keyof typeof STATUS_UI) ?? 'pending'] ?? STATUS_UI.pending
  const canSubmit = status === 'pending' || status === 'rejected'
  const idLabel = idType === 'id_card' ? 'Carte nationale d\u2019identit\u00e9' : 'Passeport'

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Vérification d'identité" showBack onBack={() => router.back()} />
      <PageShell>
        {/* Status card */}
        <div className={cn(
          'flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border mb-6',
          ui.color || 'bg-surface border-border'
        )}>
          {ui.icon}
          <div>
            <p className="text-sm font-semibold text-text">{ui.title}</p>
            <p className="text-xs text-muted mt-0.5">{ui.desc}</p>
          </div>
        </div>

        {canSubmit && (
          <>
            {/* ID type selector */}
            <PageSection title="Type de document d'identité" className="mb-5">
              <div className="flex gap-2">
                {(['id_card', 'passport'] as IdType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setIdType(t)}
                    className={cn(
                      'flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-[150ms]',
                      'border',
                      idType === t
                        ? 'bg-accent text-accent-fg border-accent'
                        : 'bg-surface text-muted border-border hover:text-text'
                    )}
                  >
                    {t === 'id_card' ? 'Carte nationale' : 'Passeport'}
                  </button>
                ))}
              </div>
            </PageSection>

            {/* Upload zones */}
            <div className="flex flex-col gap-4 mb-6">
              <UploadZone
                label={idLabel}
                hint="Recto du document, bien lisible"
                file={idFile}
                onPick={() => idRef.current?.click()}
                onRemove={() => setIdFile(null)}
              />
              <input
                ref={idRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => pickFile(e, 'id')}
              />

              <UploadZone
                label="Selfie avec le document"
                hint="Vous tenant votre document face à la caméra"
                file={selfieFile}
                onPick={() => selfieRef.current?.click()}
                onRemove={() => setSelfieFile(null)}
              />
              <input
                ref={selfieRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => pickFile(e, 'selfie')}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive text-center mb-4">
                {error}
              </p>
            )}

            <Button
              fullWidth
              size="lg"
              loading={submitting}
              disabled={!idFile || !selfieFile}
              onClick={handleSubmit}
            >
              Soumettre mes documents
            </Button>

            <p className="text-xs text-subtle text-center mt-3">
              Vos documents sont traités de façon confidentielle et ne sont pas partagés.
            </p>
          </>
        )}
      </PageShell>
    </div>
  )
}

function UploadZone({
  label,
  hint,
  file,
  onPick,
  onRemove,
}: {
  label: string
  hint: string
  file: FileState | null
  onPick: () => void
  onRemove: () => void
}) {
  return (
    <div>
      <p className="text-sm font-medium text-text mb-1.5">{label}</p>
      <p className="text-xs text-subtle mb-2">{hint}</p>

      {file ? (
        <div className="relative rounded-[var(--radius-md)] overflow-hidden bg-surface border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.preview}
            alt={label}
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 size-7 rounded-full bg-background/80 backdrop-blur-sm
                       flex items-center justify-center text-text hover:bg-background transition-colors"
          >
            <X className="size-3.5" />
          </button>
          <div className="absolute bottom-2 left-2">
            <span className="text-xs font-medium bg-success/90 text-white px-2 py-0.5 rounded-full">
              ✓ Sélectionné
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          className="w-full h-32 flex flex-col items-center justify-center gap-2
                     border-2 border-dashed border-border rounded-[var(--radius-md)]
                     text-muted hover:border-accent/40 hover:text-text hover:bg-surface-2
                     transition-all duration-[150ms]"
        >
          <Upload className="size-5" />
          <span className="text-sm font-medium">Choisir un fichier</span>
          <span className="text-xs text-subtle">JPG, PNG — max 10 Mo</span>
        </button>
      )}
    </div>
  )
}