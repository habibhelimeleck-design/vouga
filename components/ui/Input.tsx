'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'id'> {
  label?: string
  hint?: string
  error?: string
  prefix?: ReactNode
  suffix?: ReactNode
  id?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, prefix, suffix, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const inputId = externalId ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text tracking-[-0.01em]"
          >
            {label}
            {props.required && (
              <span className="text-accent ml-1" aria-hidden>*</span>
            )}
          </label>
        )}

        <div className="relative group flex items-center">
          {prefix && (
            <span className="absolute left-3.5 text-subtle pointer-events-none z-10 flex items-center">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-surface-2 border border-border rounded-[var(--radius-md)]',
              'px-4 py-3 text-sm text-text placeholder:text-subtle',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus:border-accent/60 focus:bg-surface-3',
              'focus:ring-2 focus:ring-accent/10',
              'hover:border-border-strong hover:bg-surface-3',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'min-h-[46px]',
              prefix && 'pl-10',
              suffix && 'pr-10',
              error && [
                'border-destructive/50 bg-destructive/5',
                'focus:border-destructive focus:ring-destructive/15',
              ],
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {suffix && (
            <span className="absolute right-3.5 text-subtle z-10 flex items-center">
              {suffix}
            </span>
          )}
        </div>

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-subtle">
            {hint}
          </p>
        )}

        <AnimatePresence>
          {error && (
            <motion.p
              id={`${inputId}-error`}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-destructive flex items-center gap-1.5"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

/* ── Textarea ───────────────────────────────────────────────────────── */

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const inputId = externalId ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text tracking-[-0.01em]">
            {label}
            {props.required && <span className="text-accent ml-1" aria-hidden>*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-surface-2 border border-border rounded-[var(--radius-md)]',
            'px-4 py-3 text-sm text-text placeholder:text-subtle',
            'transition-all duration-200 ease-out resize-none',
            'focus:outline-none focus:border-accent/60 focus:bg-surface-3',
            'focus:ring-2 focus:ring-accent/10',
            'hover:border-border-strong hover:bg-surface-3',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            error && 'border-destructive/50 focus:border-destructive focus:ring-destructive/15',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />

        {hint && !error && <p className="text-xs text-subtle">{hint}</p>}

        <AnimatePresence>
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-destructive flex items-center gap-1.5"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

/* ── Select ─────────────────────────────────────────────────────────── */

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, className, id: externalId, children, ...props }, ref) => {
    const generatedId = useId()
    const inputId = externalId ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text tracking-[-0.01em]">
            {label}
            {props.required && <span className="text-accent ml-1" aria-hidden>*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-surface-2 border border-border rounded-[var(--radius-md)]',
            'px-4 py-3 text-sm text-text',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:border-accent/60 focus:bg-surface-3',
            'focus:ring-2 focus:ring-accent/10',
            'hover:border-border-strong',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'min-h-[46px] appearance-none cursor-pointer',
            'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%238A9280%27 d=%27M6 8L1 3h10z%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_14px_center]',
            'pr-10',
            error && 'border-destructive/50 focus:border-destructive',
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>

        {hint && !error && <p className="text-xs text-subtle">{hint}</p>}

        <AnimatePresence>
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-destructive flex items-center gap-1.5"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Select.displayName = 'Select'