import { ThemeName, themes } from '../theme'

const STORAGE_KEY = 'jurisflow:theme'

export function useTheme() {
  function get() {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName
    return themes[saved] ?? themes.institutional
  }

  function set(name: ThemeName) {
    localStorage.setItem(STORAGE_KEY, name)
  }

  return { get, set }
}
