import { Certificate } from '../types/certificate'

const STORAGE_KEY = 'jurisflow:certificates'

function load(): Certificate[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function save(data: Certificate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useCertificate() {
  function issue(trackId: string, userName: string) {
    const data = load()

    if (data.find(c => c.trackId === trackId)) return

    data.push({
      id: crypto.randomUUID(),
      trackId,
      userName,
      issuedAt: new Date().toISOString(),
    })

    save(data)
  }

  function get(trackId: string) {
    return load().find(c => c.trackId === trackId)
  }

  return { issue, get }
}
