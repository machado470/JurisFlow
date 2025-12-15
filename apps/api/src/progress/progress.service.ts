import { Injectable } from '@nestjs/common'

type ProgressKey = string

@Injectable()
export class ProgressService {
  private progress = new Map<ProgressKey, number>()

  private key(orgId: string, personId: string, trackId: string) {
    return `${orgId}:${personId}:${trackId}`
  }

  set(
    orgId: string,
    personId: string,
    trackId: string,
    value: number,
  ) {
    this.progress.set(
      this.key(orgId, personId, trackId),
      Math.max(0, Math.min(100, value)),
    )
  }

  get(
    orgId: string,
    personId: string,
    trackId: string,
  ): number {
    return this.progress.get(
      this.key(orgId, personId, trackId),
    ) ?? 0
  }
}
