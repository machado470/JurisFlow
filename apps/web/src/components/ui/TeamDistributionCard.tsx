import Card from './Card'
import { useTheme } from '../../theme/ThemeContext'

type Item = {
  label: string
  value: number
  color: string
}

export default function TeamDistributionCard() {
  const { tokens } = useTheme()

  const data: Item[] = [
    { label: 'Apto', value: 67, color: tokens.success },
    { label: 'Em atenção', value: 23, color: tokens.warning },
    { label: 'Abaixo do padrão', value: 10, color: tokens.danger },
  ]

  return (
    <Card title="Distribuição da Equipe">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Donut fake */}
        <div className="relative h-40 w-40 shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                ${data[0].color} 0% ${data[0].value}%,
                ${data[1].color} ${data[0].value}% ${data[0].value + data[1].value}%,
                ${data[2].color} ${data[0].value + data[1].value}% 100%
              )`,
            }}
          />
          <div
            className="absolute inset-6 rounded-full"
            style={{ backgroundColor: tokens.card }}
          />
        </div>

        {/* Legenda */}
        <div className="space-y-3">
          {data.map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>

              <span className="font-medium">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
