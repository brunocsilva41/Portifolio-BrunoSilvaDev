const STORAGE_KEY = 'portfolio-projects-v2'
const COLORS = ['#6c8cff', '#ff6b9d', '#50e3c2', '#ffd76b', '#a78bfa', '#f97373', '#6dd5ed', '#f97373']

const GROUP_RADIUS = 7;

export const PROJECT_GROUPS = {
  frontend: {
    label: 'Frontend & Web',
    color: '#6c8cff',
    centerPos: { x: -GROUP_RADIUS, y: -2, z: -2 },
  },
  backend: {
    label: 'Backend & Infra',
    color: '#50e3c2',
    centerPos: { x: GROUP_RADIUS, y: -2, z: -2 },
  },
  tools: {
    label: 'AI & Automação',
    color: '#a78bfa',
    centerPos: { x: 0, y: 5.5, z: -4 },
  },
}

export const DEFAULT_PROJECTS = [
  {
    id: 0, isCenter: true,
    title: 'Bruno Silva',
    role: 'Full-Stack Developer & Software Engineer',
    tag: '★ Central',
    desc: 'Engenheiro de software focado em criar soluções escaláveis. Experiência em TypeScript, React, Node.js, Go e arquiteturas distribuídas. Cada estrela desta constelação representa um projeto real da minha jornada.',
    tech: ['TypeScript', 'React', 'Node.js', 'Go', 'PostgreSQL', 'Docker', 'AWS', 'Three.js'],
    links: { github: 'https://github.com/brunocsilva41', demo: '' },
    color: '#ffffff',
    pos: { x: 0, y: -0.8, z: 4.5 },
    group: null,
  },
  {
    id: 1, isCenter: false, group: 'frontend',
    title: 'TrioOnline',
    role: 'Game Engine Developer',
    tag: 'Game',
    desc: 'Jogo multiplayer com engine determinística baseada em ticks. Monorepo React/Next.js + Colyseus. Kubernetes com ArgoCD para deploy contínuo.',
    tech: ['TypeScript', 'React', 'Next.js', 'Colyseus', 'Prisma', 'PostgreSQL', 'Redis', 'Docker', 'K8s', 'ArgoCD'],
    links: { github: 'https://github.com/brunocsilva41/TrioOnline', demo: '' },
    color: '#6c8cff',
    pos: { x: 0, y: 0.9, z: -0.5 },
  },
  {
    id: 2, isCenter: false, group: 'backend',
    title: 'MCP Server Database',
    role: 'Backend & Security Engineer',
    tag: 'Infra',
    desc: 'Servidor MCP seguro para LLMs acessarem bancos MySQL/MSSQL. Validação multi-estágio com AST parsing e sandbox de queries.',
    tech: ['TypeScript', 'Node.js', 'MySQL', 'MSSQL', 'MCP', 'Winston'],
    links: { github: 'https://github.com/brunocsilva41/mcp-server-database', demo: '' },
    color: '#50e3c2',
    pos: { x: 0, y: 0.9, z: -0.5 },
  },
  {
    id: 3, isCenter: false, group: 'tools',
    title: 'AI Terminal Tools',
    role: 'AI/DevOps Engineer',
    tag: 'CLI',
    desc: 'Automação multi-CLI integrando Gemini, Claude, Copilot e OpenAI. Smoke checks automatizados e CI/CD matricial com GitHub Actions.',
    tech: ['JavaScript', 'Node.js', 'Python', 'MCP', 'GitHub Actions'],
    links: { github: 'https://github.com/brunocsilva41/ai-terminal-tools', demo: '' },
    color: '#a78bfa',
    pos: { x: 0, y: 0.8, z: -0.5 },
  },
  {
    id: 4, isCenter: false, group: 'backend',
    title: 'Integração SEFAZ',
    role: 'Backend Developer',
    tag: 'API',
    desc: 'SaaS para NF-e/NFS-e/CT-e com DDD em NestJS. Prisma, Redis, BullMQ e criptografia AES-256-GCM para certificados digitais.',
    tech: ['TypeScript', 'NestJS', 'Prisma', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker'],
    links: { github: 'https://github.com/brunocsilva41/integracao_sefaz', demo: '' },
    color: '#ffd76b',
    pos: { x: 0.85, y: -0.3, z: 0.4 },
  },
  {
    id: 5, isCenter: false, group: 'frontend',
    title: 'Landing Page Intelsis',
    role: 'Frontend Developer',
    tag: 'Web',
    desc: 'Landing page responsiva em React/TypeScript. Performance otimizada com lazy loading e deploy contínuo na Vercel.',
    tech: ['TypeScript', 'React', 'CSS', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/landingpage-intelsis2', demo: 'https://landingpage-intelsis2.vercel.app' },
    color: '#ff6b9d',
    pos: { x: 0.9, y: -0.2, z: 0.4 },
  },
  {
    id: 6, isCenter: false, group: 'frontend',
    title: 'Controle Financeiro',
    role: 'Full-Stack Developer',
    tag: 'Dashboard',
    desc: 'Dashboard financeiro interativo com React/TypeScript. Gestão completa de receitas, despesas e relatórios em tempo real.',
    tech: ['TypeScript', 'React', 'CSS', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/CONTROLE-FINANCEIRO', demo: 'https://controle-financeiro-ten-liart.vercel.app' },
    color: '#6dd5ed',
    pos: { x: 0.5, y: -0.7, z: -0.3 },
  },
  {
    id: 7, isCenter: false, group: 'frontend',
    title: 'Casamento FrontEnd',
    role: 'Frontend Developer',
    tag: 'Web',
    desc: 'Site de cerimônia com confirmação de presença e contagem regressiva. Experiência elegante em React/TypeScript.',
    tech: ['TypeScript', 'React', 'CSS', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/Casamento_FrontEnd', demo: 'https://casamento-front-end.vercel.app' },
    color: '#f97373',
    pos: { x: -0.6, y: -0.6, z: 0.3 },
  },
  {
    id: 8, isCenter: false, group: 'frontend',
    title: 'Café Gourmet',
    role: 'Frontend Developer',
    tag: 'Web',
    desc: 'Site elegante para cafeteria artesanal em React. Cardápio interativo, carrinho de compras e integração com API própria.',
    tech: ['JavaScript', 'React', 'CSS', 'API'],
    links: { github: 'https://github.com/brunocsilva41/cafe-gourmet-react', demo: 'https://coffeforyou.netlify.app' },
    color: '#f9a873',
    pos: { x: -0.9, y: 0.3, z: 0.2 },
  },
  {
    id: 9, isCenter: false, group: 'backend',
    title: 'Casamento Backend',
    role: 'Backend Developer',
    tag: 'API',
    desc: 'API REST em NestJS para gerenciamento de convidados, confirmações e lista de presentes. Deploy na Vercel.',
    tech: ['TypeScript', 'NestJS', 'PostgreSQL', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/Casamento_backend', demo: 'https://casamento-backend-mu.vercel.app' },
    color: '#6dd5ed',
    pos: { x: -0.7, y: -0.4, z: 0.3 },
  },
  {
    id: 10, isCenter: false, group: 'backend',
    title: 'API Café Gourmet',
    role: 'Backend Developer',
    tag: 'API',
    desc: 'API REST para e-commerce de cafeteria. Gestão de produtos, pedidos e autenticação com Node.js e deploy na Vercel.',
    tech: ['JavaScript', 'Node.js', 'Express', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/api-cafe-gourmet', demo: 'https://api-cafe-gourmet.vercel.app' },
    color: '#f9a873',
    pos: { x: 0.5, y: -0.3, z: -0.5 },
  },
  {
    id: 11, isCenter: false, group: 'backend',
    title: 'API Middleware Linx',
    role: 'Backend Developer',
    tag: 'API',
    desc: 'Middleware de integração com sistemas legados. Transformação e roteamento de dados entre plataformas com TypeScript.',
    tech: ['TypeScript', 'Node.js', 'Docker'],
    links: { github: 'https://github.com/brunocsilva41/api-middleware-linx', demo: '' },
    color: '#50e3c2',
    pos: { x: -0.4, y: 0.5, z: -0.2 },
  },
  {
    id: 12, isCenter: false, group: 'tools',
    title: 'Agent Orquestrator',
    role: 'AI Engineer',
    tag: 'AI',
    desc: 'Sistema operacional open source para negócios impulsionados por IA. Orquestração de agentes multi-provedor com Claude Code.',
    tech: ['TypeScript', 'Python', 'Shell', 'Docker', 'Claude', 'OpenAI'],
    links: { github: 'https://github.com/brunocsilva41/agent-orquestrator', demo: '' },
    color: '#ff6b9d',
    pos: { x: 0.9, y: -0.3, z: 0.2 },
  },
  {
    id: 13, isCenter: false, group: 'tools',
    title: 'GerenciaDB',
    role: 'Full-Stack Developer',
    tag: 'Ferramenta',
    desc: 'Interface web para gerenciamento de bancos de dados. Visualização de schemas, execução de queries e exportação de dados.',
    tech: ['JavaScript', 'Node.js', 'PostgreSQL', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/gerenciadb', demo: 'https://gerenciadb.vercel.app' },
    color: '#a78bfa',
    pos: { x: -0.8, y: -0.2, z: 0.3 },
  },
  {
    id: 14, isCenter: false, group: 'tools',
    title: 'Steuer Deployment',
    role: 'DevOps Engineer',
    tag: 'DevOps',
    desc: 'Pipeline de deploy automatizado para sistemas fiscais alemães. Automação de provisioning e deploy com C# e PowerShell.',
    tech: ['C#', 'PowerShell', 'Docker'],
    links: { github: 'https://github.com/brunocsilva41/SteuerDeployment', demo: '' },
    color: '#f97373',
    pos: { x: 0.3, y: -0.6, z: -0.4 },
  },
]

// Project view: groups repos that complete each other into full projects
export const PROJECT_VIEWS = [
  {
    name: 'Café Gourmet',
    desc: 'Plataforma completa de e-commerce para cafeteria artesanal com frontend React e API REST.',
    color: '#f9a873',
    repoIds: [8, 10],
  },
  {
    name: 'Casamento',
    desc: 'Sistema de gerenciamento de cerimônia: site com confirmação de presença + API de gestão de convidados.',
    color: '#6dd5ed',
    repoIds: [7, 9],
  },
  {
    name: 'Ferramentas DevOps',
    desc: 'Automação de deploy, middlewares de integração e servidores MCP para bancos de dados.',
    color: '#50e3c2',
    repoIds: [14, 11, 2],
  },
  {
    name: 'AI & Automação',
    desc: 'Agentes inteligentes multi-provedor e automação de terminais com IA.',
    color: '#a78bfa',
    repoIds: [3, 12],
  },
  {
    name: 'Aplicações Web',
    desc: 'Landing pages responsivas e dashboards financeiros interativos.',
    color: '#ff6b9d',
    repoIds: [5, 6],
  },
  {
    name: 'Sistemas',
    desc: 'SaaS para notas fiscais e interface web para gerenciamento de bancos de dados.',
    color: '#ffd76b',
    repoIds: [4, 13],
  },
  {
    name: 'TrioOnline',
    desc: 'Jogo multiplayer com engine determinística, matchmaking e deploy contínuo em Kubernetes.',
    color: '#6c8cff',
    repoIds: [1],
  },
];

export function getProjectViewPositions() {
  const count = PROJECT_VIEWS.length;
  const radius = 5.5;
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    positions.push({
      x: Math.cos(angle) * radius,
      y: -1.5 + Math.sin(angle * 2) * 0.5,
      z: Math.sin(angle) * radius - 2,
    });
  }
  return positions;
}

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

export function getGroupPositions(projects) {
  const groups = {}
  for (const p of projects) {
    if (p.isCenter || !p.group) continue
    if (!groups[p.group]) groups[p.group] = []
    groups[p.group].push(p)
  }
  const groupCenters = {}
  for (const [name, members] of Object.entries(groups)) {
    const gc = PROJECT_GROUPS[name]
    if (!gc) continue
    groupCenters[name] = { x: gc.centerPos.x, y: gc.centerPos.y, z: gc.centerPos.z }
  }
  return groupCenters
}

export function getAbsolutePosition(project) {
  if (project.isCenter || !project.group) {
    return { x: project.pos.x, y: project.pos.y, z: project.pos.z }
  }
  const gc = PROJECT_GROUPS[project.group]
  if (!gc) return { x: project.pos.x, y: project.pos.y, z: project.pos.z }
  return {
    x: gc.centerPos.x + (project.pos.x ?? 0),
    y: gc.centerPos.y + (project.pos.y ?? 0),
    z: gc.centerPos.z + (project.pos.z ?? 0),
  }
}

export function autoConnectProjects(projects) {
  const center = projects.find(p => p.isCenter)
  if (!center) return projects
  const centerId = center.id
  const nonCenter = projects.filter(p => !p.isCenter)

  const byGroup = {}
  nonCenter.forEach(p => {
    const g = p.group || 'other'
    if (!byGroup[g]) byGroup[g] = []
    byGroup[g].push(p)
  })

  return projects.map(p => {
    if (p.isCenter) return { ...p, connections: nonCenter.map(n => n.id) }

    const sameGroup = byGroup[p.group]?.filter(n => n.id !== p.id) || []
    const sorted = sameGroup
      .map(n => ({
        id: n.id,
        dist: Math.hypot(n.pos.x - p.pos.x, n.pos.y - p.pos.y, n.pos.z - p.pos.z),
      }))
      .sort((a, b) => a.dist - b.dist)

    const intraGroup = sorted.slice(0, 2).map(n => n.id)

    const otherGroups = nonCenter
      .filter(n => n.group !== p.group)
      .map(n => ({
        id: n.id,
        dist: Math.hypot(n.pos.x - p.pos.x, n.pos.y - p.pos.y, n.pos.z - p.pos.z),
      }))
      .sort((a, b) => a.dist - b.dist)

    const interGroup = otherGroups.slice(0, 1).map(n => n.id)

    return { ...p, connections: [centerId, ...intraGroup, ...interGroup] }
  })
}

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

export function generateColor(index) {
  return COLORS[index % COLORS.length]
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
