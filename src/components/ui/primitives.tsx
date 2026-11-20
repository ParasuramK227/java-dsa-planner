import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'
import { AlertCircle } from 'lucide-react'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}) {
  return (
    <button
      className={clsx(
        'pressable inline-flex items-center justify-center gap-2 rounded-md border font-medium disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
        variant === 'primary' && 'border-fg bg-fg text-bg hover:opacity-85',
        variant === 'secondary' && 'border-line bg-raised text-fg hover:border-muted',
        variant === 'ghost' && 'border-transparent bg-transparent text-muted hover:bg-raised hover:text-fg',
        variant === 'danger' && 'border-line bg-transparent text-fg hover:bg-raised',
        className,
      )}
      {...props}
    />
  )
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('rounded-lg border border-line bg-panel', className)}>{children}</div>
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'solid' | 'outline'
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        tone === 'solid' ? 'border-fg bg-fg text-bg' : 'border-line text-muted',
        tone === 'outline' && 'bg-transparent',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-fg">{title}</h2>
        {description && <p className="mt-1 text-xs text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

const fieldClass =
  'w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-fg focus:outline-none'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(fieldClass, className)} {...props} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={clsx(fieldClass, 'appearance-none pr-8', className)} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(fieldClass, 'min-h-24 resize-y', className)} {...props} />
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-faint">{hint}</span>}
    </label>
  )
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={clsx('h-1.5 w-full overflow-hidden rounded-full bg-raised', className)}>
      <div
        className="h-full rounded-full bg-fg transition-[width] duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      {icon && <div className="mb-3 text-faint">{icon}</div>}
      <p className="text-sm font-medium text-fg">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-muted">{description}</p>}
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-line bg-raised px-3 py-2 text-xs text-fg">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="pressable inline-flex items-center gap-2 text-xs text-muted"
      aria-pressed={checked}
    >
      <span className={clsx('relative h-4 w-8 rounded-full border border-line', checked ? 'bg-fg' : 'bg-raised')}>
        <span
          className={clsx(
            'absolute top-0.5 h-2.5 w-2.5 rounded-full transition-all',
            checked ? 'left-4 bg-bg' : 'left-0.5 bg-muted',
          )}
        />
      </span>
      {label}
    </button>
  )
}
