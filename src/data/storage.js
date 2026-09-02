import { DEFAULT_PROJECTS } from './projects.js'

const STORAGE_KEY = 'portfolio-projects-v3'

export function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return structuredClone(DEFAULT_PROJECTS)
}

export function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch {}
}

export function resetProjects() {
  localStorage.removeItem(STORAGE_KEY)
  return structuredClone(DEFAULT_PROJECTS)
}
