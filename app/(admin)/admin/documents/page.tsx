import { ExternalLink, FileCheck } from 'lucide-react'
import { getPendingDocuments } from '@/lib/actions/admin'
import { DocumentActions } from './DocumentActions'

const DOC_TYPE_LABELS: Record<string, string> = {
  id_card: 'CNI',
  passport: 'Passeport',
  company_reg: 'Registre commerce',
  selfie: 'Selfie',
}

export default async function AdminDocumentsPage() {
  const documents = await getPendingDocuments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-text">Documents en attente</h1>
        <p className="text-sm text-muted mt-1">
          {documents.length === 0
            ? 'Aucun document à traiter.'
            : `${documents.length} document${documents.length > 1 ? 's' : ''} à vérifier`}
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
            <FileCheck className="size-6 text-subtle" />
          </div>
          <p className="text-muted text-sm">Tout est à jour — aucun document en attente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">{doc.profile.full_name}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {doc.profile.type === 'company' ? 'Entreprise' : 'Particulier'}
                    {' · '}
                    <span className="text-accent font-medium">
                      {DOC_TYPE_LABELS[doc.type] ?? doc.type}
                    </span>
                  </p>
                </div>
                <span className="text-xs text-subtle shrink-0">
                  {new Date(doc.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              {/* Preview link */}
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-accent hover:underline"
              >
                <ExternalLink className="size-3.5" />
                Voir le document
              </a>

              {/* Actions */}
              <DocumentActions documentId={doc.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}