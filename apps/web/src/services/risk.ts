export type RiskLevel = 'CRÍTICO' | 'ATENÇÃO' | 'OK'

type TrackInput = {
  progress: number
}

export function calculateRiskFromTracks(
  tracks: TrackInput[]
): RiskLevel {
  if (tracks.length === 0) return 'OK'

  const lowestProgress = Math.min(
    ...tracks.map(t => t.progress)
  )

  if (lowestProgress < 60) return 'CRÍTICO'
  if (lowestProgress < 90) return 'ATENÇÃO'
  return 'OK'
}
