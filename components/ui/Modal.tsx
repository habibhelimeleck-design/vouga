'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => onClose()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'bg-surface border border-border rounded-[var(--radius-xl)]',
        'w-full max-w-md mx-auto mt-auto mb-0 sm:my-auto',
        'p-6 shadow-[var(--shadow-lg)]',
        'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        'open:animate-slide-in-bottom sm:open:animate-fade-in',
        '[&:not([open])]:hidden',
        className
      )}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          {title && (
            <h2 className="font-display font-semibold text-text text-lg">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted mt-1">{description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="shrink-0 -mr-1 -mt-1"
          aria-label="Fermer"
        >
          <X className="size-4" />
        </Button>
      </div>
      {children}
    </dialog>
  )
}
