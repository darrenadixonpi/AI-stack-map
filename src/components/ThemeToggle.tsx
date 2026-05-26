import { useState } from 'react'
import { applyTheme, getStoredTheme, type Theme } from '../theme'

const OPTIONS: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  const select = (next: Theme) => {
    setTheme(next)
    applyTheme(next)
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`theme-toggle-btn${theme === opt.id ? ' active' : ''}`}
          onClick={() => select(opt.id)}
          aria-pressed={theme === opt.id}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
