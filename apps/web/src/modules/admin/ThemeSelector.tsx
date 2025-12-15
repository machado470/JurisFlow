import { useTheme } from '../../hooks/useTheme'
import { ThemeName, themes } from '../../theme'
import { useState } from 'react'

export default function ThemeSelector() {
  const { set } = useTheme()
  const [current, setCurrent] = useState<ThemeName>(
    (localStorage.getItem('jurisflow:theme') as ThemeName) ||
      'institutional'
  )

  function apply(theme: ThemeName) {
    set(theme)
    setCurrent(theme)
    window.location.reload()
  }

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 32,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        Tema da Plataforma
      </h2>

      <div style={{ display: 'flex', gap: 12 }}>
        {(Object.keys(themes) as ThemeName[]).map(name => (
          <button
            key={name}
            onClick={() => apply(name)}
            style={{
              padding: '8px 12px',
              border:
                current === name
                  ? `2px solid ${themes[name].primary}`
                  : '1px solid #d1d5db',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: current === name ? 'bold' : 'normal',
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
