export type UiMode = 'classic' | 'v2'

const STORAGE_KEY = 'seven-guide-ui-mode'

export function loadUiMode(): UiMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'v2' || v === 'classic') return v
  } catch {
    /* ignore */
  }
  return 'classic'
}

export function saveUiMode(mode: UiMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}
