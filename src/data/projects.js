export const COLORS = ['#6c8cff', '#ff6b9d', '#50e3c2', '#ffd76b', '#a78bfa', '#f97373', '#6dd5ed', '#f97373']

export const PROJECT_GROUPS = {
  game: {
    label: 'Jogos',
    color: '#6c8cff',
    centerPos: { x: -6, y: -1, z: -2 },
  },
  ai: {
    label: 'Inteligência Artificial',
    color: '#a78bfa',
    centerPos: { x: 0, y: 5.5, z: -3 },
  },
  infra: {
    label: 'Infraestrutura & Integração',
    color: '#50e3c2',
    centerPos: { x: 6, y: -1, z: -2 },
  },
  web: {
    label: 'Aplicações Web',
    color: '#ff6b9d',
    centerPos: { x: -4, y: -2, z: 5 },
  },
  empresa: {
    label: 'Case Studies',
    color: '#f97373',
    centerPos: { x: 4, y: 2, z: 4 },
  },
}

export const DEFAULT_PROJECTS = [
  {
    id: 0, isCenter: true,
    title: 'Bruno Silva',
    role: 'Full-Stack Developer & Software Engineer',
    tag: '★ Central',
    desc: {
      pt: 'Engenheiro de software focado em criar soluções escaláveis. Experiência em TypeScript, React, Node.js, Rust e arquiteturas distribuídas. Cada estrela desta constelação representa um projeto real da minha jornada.',
      en: 'Software engineer focused on building scalable solutions. Experienced in TypeScript, React, Node.js, Rust and distributed architectures. Every star in this constellation represents a real project from my journey.',
    },
    tech: ['TypeScript', 'React', 'Node.js', 'Rust', 'PostgreSQL', 'Docker', 'AWS', 'Three.js'],
    links: { github: 'https://github.com/brunocsilva41', demo: '' },
    color: '#ffffff',
    pos: { x: 0, y: 0, z: 0 },
    group: null,
  },
  {
    id: 1, isCenter: false, group: 'game',
    title: 'TrioOnline',
    role: 'Game Engine Developer',
    tag: 'Game',
    desc: {
      pt: 'Versão online do jogo de cartas Trio, criada para partidas em tempo real com amigos. Engine determinística baseada em ticks, monorepo React/Next.js + Colyseus e deploy contínuo em Kubernetes com ArgoCD.',
      en: 'Online version of the Trio card game, built for real-time matches with friends. Deterministic tick-based engine, React/Next.js + Colyseus monorepo and continuous deployment on Kubernetes with ArgoCD.',
    },
    tech: ['TypeScript', 'React', 'Next.js', 'Colyseus', 'Prisma', 'PostgreSQL', 'Redis', 'Docker', 'K8s', 'ArgoCD'],
    links: { github: 'https://github.com/brunocsilva41/TrioOnline', demo: '' },
    color: '#6c8cff',
    pos: { x: 0, y: 0.9, z: -0.5 },
  },
  {
    id: 2, isCenter: false, group: 'ai',
    title: 'MCP Server Database',
    role: 'Backend & Security Engineer',
    tag: 'AI',
    desc: {
      pt: 'Servidor MCP que dá a modelos de IA acesso seguro a bancos MySQL/MSSQL para análises. Validação multi-estágio com AST parsing e sandbox de queries eliminam o risco de operações destrutivas.',
      en: 'MCP server that gives AI models safe access to MySQL/MSSQL databases for analysis. Multi-stage validation with AST parsing and a query sandbox eliminate the risk of destructive operations.',
    },
    tech: ['TypeScript', 'Node.js', 'MySQL', 'MSSQL', 'MCP', 'Winston'],
    links: { github: 'https://github.com/brunocsilva41/mcp-server-database', demo: '' },
    color: '#a78bfa',
    pos: { x: 0, y: 0.9, z: -0.5 },
  },
  {
    id: 3, isCenter: false, group: 'ai',
    title: 'AI Terminal Tools',
    role: 'AI/DevOps Engineer',
    tag: 'CLI',
    desc: {
      pt: 'CLI unificada para trabalhar com múltiplos provedores de IA (Gemini, Claude, Copilot, OpenAI) direto no terminal. Desenvolvimento acelerado por IA com padrões rigorosos, smoke checks automatizados e CI/CD matricial.',
      en: 'Unified CLI for working with multiple AI providers (Gemini, Claude, Copilot, OpenAI) right from the terminal. AI-accelerated development under strict standards, automated smoke checks and matrix CI/CD.',
    },
    tech: ['JavaScript', 'Node.js', 'Python', 'MCP', 'GitHub Actions'],
    links: { github: 'https://github.com/brunocsilva41/ai-terminal-tools', demo: '' },
    color: '#a78bfa',
    pos: { x: 0.8, y: -0.3, z: 0.4 },
  },
  {
    id: 4, isCenter: false, group: 'web',
    title: 'Café Gourmet',
    role: 'Frontend Developer',
    tag: { pt: 'TCC', en: 'Capstone' },
    desc: {
      pt: 'E-commerce completo de cafeteria desenvolvido como TCC de Ciências da Computação. Cardápio interativo, carrinho de compras e integração com API própria, publicado em produção.',
      en: 'Complete coffee shop e-commerce built as my Computer Science capstone project. Interactive menu, shopping cart and integration with its own API, published to production.',
    },
    tech: ['JavaScript', 'React', 'CSS', 'API'],
    links: { github: 'https://github.com/brunocsilva41/cafe-gourmet-react', demo: 'https://coffeforyou.netlify.app' },
    color: '#f9a873',
    pos: { x: -0.9, y: 0.3, z: 0.2 },
  },
  {
    id: 5, isCenter: false, group: 'web',
    title: 'API Café Gourmet',
    role: 'Backend Developer',
    tag: { pt: 'TCC', en: 'Capstone' },
    desc: {
      pt: 'API REST do e-commerce de cafeteria do TCC: gestão de produtos, pedidos e autenticação em Node.js, com deploy na Vercel.',
      en: 'REST API for the capstone coffee shop e-commerce: product management, orders and authentication in Node.js, deployed on Vercel.',
    },
    tech: ['JavaScript', 'Node.js', 'Express', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/api-cafe-gourmet', demo: 'https://api-cafe-gourmet.vercel.app' },
    color: '#f9a873',
    pos: { x: 0.5, y: -0.3, z: -0.5 },
  },
  {
    id: 6, isCenter: false, group: 'web',
    title: 'Casamento Frontend',
    role: 'Frontend Developer',
    tag: 'Web',
    desc: {
      pt: 'Site do meu próprio casamento: confirmação de presença (RSVP), contagem regressiva e lista de presentes, com experiência elegante em React/TypeScript.',
      en: 'Website for my own wedding: RSVP, countdown and gift registry, with an elegant React/TypeScript experience.',
    },
    tech: ['TypeScript', 'React', 'CSS', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/Casamento_FrontEnd', demo: 'https://casamento-front-end.vercel.app' },
    color: '#f97373',
    pos: { x: -0.6, y: -0.6, z: 0.3 },
  },
  {
    id: 7, isCenter: false, group: 'web',
    title: 'Casamento Backend',
    role: 'Backend Developer',
    tag: 'API',
    desc: {
      pt: 'API em NestJS que gerencia convidados, confirmações de presença e lista de presentes do casamento, com pagamentos via PIX e cartão.',
      en: 'NestJS API managing wedding guests, RSVPs and the gift registry, with payments via PIX and credit card.',
    },
    tech: ['TypeScript', 'NestJS', 'PostgreSQL', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/Casamento_backend', demo: 'https://casamento-backend-mu.vercel.app' },
    color: '#6dd5ed',
    pos: { x: -0.7, y: -0.4, z: 0.3 },
  },
  {
    id: 8, isCenter: false, group: 'web',
    title: 'Controle Financeiro',
    role: 'Full-Stack Developer',
    tag: 'Dashboard',
    desc: {
      pt: 'Dashboard de finanças pessoais com gestão de receitas, despesas e relatórios em tempo real, criado para uso diário.',
      en: 'Personal finance dashboard with income and expense management and real-time reports, built for daily use.',
    },
    tech: ['TypeScript', 'React', 'CSS', 'Vercel'],
    links: { github: 'https://github.com/brunocsilva41/CONTROLE-FINANCEIRO', demo: 'https://controle-financeiro-ten-liart.vercel.app' },
    color: '#6dd5ed',
    pos: { x: 0.5, y: -0.7, z: -0.3 },
  },
  {
    id: 9, isCenter: false, group: 'empresa',
    title: 'Landing Page Webinar',
    role: 'Frontend Developer',
    tag: 'Case Study',
    desc: {
      pt: 'Landing page de captação de leads para inscrição em webinar, em React/TypeScript, otimizada para conversão e com deploy contínuo na Vercel.',
      en: 'Lead capture landing page for webinar sign-ups, in React/TypeScript, optimized for conversion with continuous deployment on Vercel.',
    },
    tech: ['TypeScript', 'React', 'CSS', 'Vercel'],
    links: { github: '', demo: '' },
    color: '#ff6b9d',
    caseStudy: 'landingWebinar',
    pos: { x: -0.7, y: -0.4, z: 0.5 },
  },
  {
    id: 10, isCenter: false, group: 'ai',
    title: 'Agents Hub',
    role: 'AI Engineer',
    tag: 'AI',
    desc: {
      pt: 'Control plane para orquestração de múltiplos agentes de IA, centralizando configuração e execução multi-provedor em um único painel.',
      en: 'Control plane for orchestrating multiple AI agents, centralizing multi-provider configuration and execution in a single panel.',
    },
    tech: ['TypeScript', 'Node.js', 'Docker', 'Claude', 'OpenAI'],
    links: { github: 'https://github.com/brunocsilva41/Agents-Hub', demo: '' },
    color: '#ff6b9d',
    pos: { x: 0.9, y: 0.3, z: -0.6 },
  },
  {
    id: 11, isCenter: false, group: 'infra',
    title: 'ControlPC',
    role: 'Systems Engineer',
    tag: 'Infra',
    desc: {
      pt: 'Desktop agent em Rust que permite a agentes de IA controlar o PC com segurança, seguindo abordagem security-first fail-closed.',
      en: 'Rust desktop agent that lets AI agents control the PC safely, following a security-first, fail-closed approach.',
    },
    tech: ['Rust', 'AI', 'Segurança', 'Desktop'],
    links: { github: 'https://github.com/brunocsilva41/ControlPC', demo: '' },
    color: '#50e3c2',
    pos: { x: -0.6, y: 0.5, z: -0.4 },
  },
  {
    id: 12, isCenter: false, group: 'ai',
    title: 'Escuta Promo',
    role: 'Automation Engineer',
    tag: { pt: 'Automação', en: 'Automation' },
    desc: {
      pt: 'Automação que monitora rádio ao vivo o dia inteiro, detecta sorteios e promoções e dispara alertas em tempo real para nunca perder uma participação.',
      en: 'Automation that monitors live radio all day, detects giveaways and promotions and fires real-time alerts so no entry is ever missed.',
    },
    tech: ['Python', 'Automação', 'Áudio', 'Alertas'],
    links: { github: '', demo: '' },
    color: '#a78bfa',
    pos: { x: -0.8, y: -0.2, z: 0.3 },
  },
  {
    id: 13, isCenter: false, group: 'web',
    title: 'GymOS',
    role: 'Full-Stack Developer',
    tag: { pt: 'Estudo', en: 'Study' },
    desc: {
      pt: 'Sistema de gestão para academias com controle de alunos e treinos, desenvolvido como projeto de estudo de arquitetura de sistemas.',
      en: 'Gym management system with member and workout tracking, developed as a systems architecture study project.',
    },
    tech: ['HTML', 'CSS', 'JavaScript'],
    links: { github: 'https://github.com/brunocsilva41/gymOS', demo: '' },
    color: '#6c8cff',
    pos: { x: -0.3, y: 0.4, z: -0.6 },
  },
  {
    id: 14, isCenter: false, group: 'infra',
    title: 'AcrossCore ERP',
    role: 'Software Architect',
    tag: 'Middleware',
    desc: {
      pt: 'Middleware de integração padronizada entre sistemas legados e ERPs de mercado, criado a partir de desafios reais de integração enfrentados em produção. Em desenvolvimento.',
      en: 'Standardized integration middleware between legacy systems and mainstream ERPs, born from real integration challenges faced in production. In development.',
    },
    tech: ['TypeScript', 'Node.js', 'ERP', 'Integração'],
    links: { github: '', demo: '' },
    color: '#50e3c2',
    pos: { x: 0.6, y: -0.4, z: 0.4 },
  },
  {
    id: 15, isCenter: false, group: 'empresa',
    title: 'Gestão Fiscal',
    role: 'Full-Stack Developer',
    tag: 'Case Study',
    desc: {
      pt: 'SaaS de gestão de documentos fiscais (NF-e/NFS-e/CT-e) com captação automática de notas, download de XML/PDF, automação de inserção no ERP Linx e VPN para ambientes on-premise.',
      en: 'Tax document management SaaS (Brazilian NF-e/NFS-e/CT-e) with automatic invoice capture, XML/PDF downloads, automated insertion into the Linx ERP and a VPN for on-premise environments.',
    },
    tech: ['Bun', 'Fastify', 'Prisma', 'MySQL', 'RabbitMQ', 'AWS S3', 'Laravel', 'C#', '.NET', 'WireGuard'],
    links: { github: '', demo: '' },
    color: '#f97373',
    caseStudy: 'gestaoFiscal',
    pos: { x: 0.6, y: 0.4, z: -0.4 },
  },
]

// Project view: groups repos that complete each other into full projects
export const PROJECT_VIEWS = [
  {
    name: 'Gestão Fiscal',
    displayName: { pt: 'Gestão Fiscal', en: 'Tax Management' },
    desc: {
      pt: 'SaaS de gestão de documentos fiscais (NF-e/NFS-e/CT-e) com captação automática, download de XML/PDF, integração e automação de inserção no ERP Linx e VPN para ambientes on-premise.',
      en: 'Tax document management SaaS (NF-e/NFS-e/CT-e) with automatic capture, XML/PDF downloads, automated insertion into the Linx ERP and a VPN for on-premise environments.',
    },
    color: '#f97373',
    repoIds: [15],
    isCaseStudy: true,
    caseStudy: 'gestaoFiscal',
  },
  {
    name: 'Inteligência Artificial',
    displayName: { pt: 'Inteligência Artificial', en: 'Artificial Intelligence' },
    desc: {
      pt: 'Acesso seguro de IA a bancos de dados, CLI multi-provedor, orquestração de agentes e automação de monitoramento de rádio.',
      en: 'Secure AI access to databases, multi-provider CLI, agent orchestration and radio monitoring automation.',
    },
    color: '#a78bfa',
    repoIds: [2, 3, 10, 12],
  },
  {
    name: 'Infraestrutura & Integração',
    displayName: { pt: 'Infraestrutura & Integração', en: 'Infrastructure & Integration' },
    desc: {
      pt: 'Desktop agent em Rust com segurança fail-closed e middleware de integração padronizada com ERPs.',
      en: 'Rust desktop agent with fail-closed security and standardized ERP integration middleware.',
    },
    color: '#50e3c2',
    repoIds: [11, 14],
  },
  {
    name: 'Aplicações Web',
    displayName: { pt: 'Aplicações Web', en: 'Web Applications' },
    desc: {
      pt: 'E-commerce de cafeteria (TCC), sistema de casamento com pagamentos PIX, dashboards financeiros, gestão de academia e landing de captação de leads.',
      en: 'Coffee shop e-commerce (capstone), wedding system with PIX payments, finance dashboards, gym management and a lead capture landing page.',
    },
    color: '#ff6b9d',
    repoIds: [4, 5, 6, 7, 8, 13, 9],
  },
  {
    name: 'TrioOnline',
    displayName: { pt: 'TrioOnline', en: 'TrioOnline' },
    desc: {
      pt: 'Versão online do jogo de cartas Trio, com engine determinística para partidas em tempo real.',
      en: 'Online version of the Trio card game, with a deterministic engine for real-time matches.',
    },
    color: '#6c8cff',
    repoIds: [1],
  },
];

export function getProjectViewPositions() {
  const count = PROJECT_VIEWS.length;
  const radius = 18;
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    positions.push({
      x: Math.cos(angle) * radius,
      y: -4 + Math.sin(angle * 2) * 3.5,
      z: Math.sin(angle) * radius - 4,
    });
  }
  return positions;
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

export function generateColor(index) {
  return COLORS[index % COLORS.length]
}
