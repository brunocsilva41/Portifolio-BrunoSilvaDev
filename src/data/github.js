import { generateColor } from './projects.js'

export function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/)
  if (!match) return null
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

export async function fetchRepoFromGitHub(url) {
  const parsed = parseGitHubUrl(url)
  if (!parsed) throw new Error('URL do GitHub inválida')
  const { owner, repo } = parsed

  const [repoRes, readmeRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`),
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`),
  ])

  if (!repoRes.ok) {
    if (repoRes.status === 404) throw new Error('Repositório não encontrado')
    if (repoRes.status === 403) throw new Error('Limite de requisições. Tente mais tarde.')
    throw new Error(`Erro (${repoRes.status})`)
  }

  const repoData = await repoRes.json()
  let readmeContent = ''
  if (readmeRes.ok) {
    const readmeData = await readmeRes.json()
    try { readmeContent = atob(readmeData.content.replace(/\n/g, '')) } catch {}
  }

  return buildProjectFromGitHub(repoData, readmeContent)
}

function buildProjectFromGitHub(repoData, readme) {
  const title = repoData.name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())

  const desc = repoData.description || extractDescriptionFromReadme(readme) || 'Sem descrição disponível.'

  const tech = new Set()
  if (repoData.language) tech.add(repoData.language)
  if (repoData.topics) repoData.topics.forEach(t => tech.add(t.charAt(0).toUpperCase() + t.slice(1)))
  extractTechFromReadme(readme).forEach(t => tech.add(t))

  return {
    title,
    desc,
    tech: [...tech].slice(0, 10),
    tag: repoData.language || 'Projeto',
    links: { github: repoData.html_url, demo: repoData.homepage || '' },
  }
}

export function extractDescriptionFromReadme(readme) {
  const lines = readme.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('![') && !trimmed.startsWith('<')) {
      const cleaned = trimmed.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim()
      if (cleaned.length > 20 && cleaned.length < 300) return cleaned
    }
  }
  return ''
}

export function extractTechFromReadme(readme) {
  const techs = new Set()
  const sectionHeaders = [/##?\s*(tecnologias|tech\s*stack|technologies|built\s*with|stack|ferramentas|tools|linguagens|languages)/i]
  const lines = readme.split('\n')
  let inTechSection = false
  for (const line of lines) {
    if (sectionHeaders.some(h => h.test(line))) { inTechSection = true; continue }
    if (inTechSection) {
      if (line.startsWith('#')) break
      const m = line.match(/[-*]\s*\*\*?([^*]+)\*\*?/)
      if (m) techs.add(m[1].trim())
    }
  }
  const badgeRegex = /img\.shields\.io\/badge\/[^-]+-([^-]+)/g
  let bm; while ((bm = badgeRegex.exec(readme)) !== null) {
    const t = decodeURIComponent(bm[1]).replace(/_/g, ' ').trim()
    if (t.length > 1 && t.length < 30 && !/^\d/.test(t)) techs.add(t)
  }
  return [...techs].slice(0, 8)
}

export function compileProject(imported, projectsCount) {
  const id = Date.now()
  const offsetAngle = Math.random() * Math.PI * 2
  const offsetRadius = 0.5 + Math.random() * 0.8
  return {
    id,
    title: imported.title,
    role: imported.role || 'Desenvolvedor',
    tag: imported.tag || 'Projeto',
    desc: imported.desc || 'Sem descrição.',
    tech: imported.tech || [],
    links: imported.links || { github: '', demo: '' },
    color: imported.color || generateColor(projectsCount),
    pos: {
      x: Math.cos(offsetAngle) * offsetRadius,
      y: Math.sin(offsetAngle * 0.7) * offsetRadius * 0.6,
      z: Math.sin(offsetAngle) * offsetRadius - 1,
    },
    isCenter: false,
    group: 'imported',
  }
}
