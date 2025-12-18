import Card from './Card'
import { useTheme } from '../../theme/ThemeContext'

export default function RiskEvolutionCard() {
  const { tokens } = useTheme()

  return (
    <Card title="Evolução de Risco">
      <div className="space-y-4">
        <div className="text-sm opacity-70">
          Crítico
        </div>

        {/* Linha fake (placeholder visual) */}
        <div
          className="h-24 rounded-lg"
          style={{
            background: `linear-gradient(
              90deg,
              ${tokens.warning}33,
              ${tokens.warning}66,
              ${tokens.warning}
            )`,
          }}
        />

        <div className="flex justify-between text-xs opacity-60">
          <span>3 anos</span>
          <span>1 ano</span>
          <span>90 dias</span>
          <span>Hoje</span>
        </div>
      </div>
    </Card>
  )
}
