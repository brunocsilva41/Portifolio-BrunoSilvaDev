const STORAGE_KEY = 'portfolio-projects-v2'
const COLORS = ['#6c8cff', '#ff6b9d', '#50e3c2', '#ffd76b', '#a78bfa', '#f97373', '#6dd5ed', '#f97373']

const GROUP_RADIUS = 7;

export const PROJECT_GROUPS = {
  frontend: {
    label: 'Frontend & Web',
    color: '#6c8cff',
    centerPos: { x: -6, y: -1, z: -2 },
  },
  backend: {
    label: 'Backend & Infra',
    color: '#50e3c2',
    centerPos: { x: 6, y: -1, z: -2 },
  },
  tools: {
    label: 'AI & Automação',
    color: '#a78bfa',
    centerPos: { x: 0, y: 5.5, z: -3 },
  },
  steuer: {
    label: 'Steuer & SEFAZ',
    color: '#f97373',
    centerPos: { x: 4, y: 2, z: 4 },
  },
  kippis: {
    label: 'Kippis Benefícios',
    color: '#6dd5ed',
    centerPos: { x: -4, y: -2, z: 5 },
  },
  imported: {
    label: 'Importados',
    color: '#ffd76b',
    centerPos: { x: 0, y: -4, z: -5 },
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
    pos: { x: 0, y: 0, z: 0 },
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
    id: 4, isCenter: false, group: 'steuer',
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
    id: 11, isCenter: false, group: 'steuer',
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
    id: 14, isCenter: false, group: 'steuer',
    title: 'Steuer Deployment',
    role: 'DevOps Engineer',
    tag: 'DevOps',
    desc: 'Pipeline de deploy automatizado para sistemas fiscais alemães. Automação de provisioning e deploy com C# e PowerShell.',
    tech: ['C#', 'PowerShell', 'Docker'],
    links: { github: 'https://github.com/brunocsilva41/SteuerDeployment', demo: '' },
    color: '#f97373',
    pos: { x: 0.3, y: -0.6, z: -0.4 },
  },
  // === Steuer & SEFAZ ===
  {
    id: 15, isCenter: false, group: 'steuer',
    title: 'SEFAZ Bridge Node',
    role: 'Desenvolvedor',
    tag: 'API',
    desc: 'Middleware de alta performance para ponte de comunicação e integração com serviços SEFAZ (Node.js).',
    tech: ['TypeScript', 'Node.js', 'API', 'SEFAZ'],
    links: { github: 'https://github.com/brunocsilva41/sefaz-bridge-node', demo: '' },
    color: '#f97373',
    pos: { x: -0.46, y: 0.15, z: -1.26 },
  },
  {
    id: 16, isCenter: false, group: 'steuer',
    title: 'SEFAZ .NET Client',
    role: 'Desenvolvedor',
    tag: 'API',
    desc: 'Cliente de integração SEFAZ de alta performance desenvolvido em .NET.',
    tech: ['C#', '.NET', 'SEFAZ', 'API'],
    links: { github: 'https://github.com/brunocsilva41/sefaz-dot-net-client', demo: '' },
    color: '#f97373',
    pos: { x: 0.25, y: -0.18, z: -1.56 },
  },
  {
    id: 17, isCenter: false, group: 'steuer',
    title: 'Steuer Gateway Linx',
    role: 'Desenvolvedor',
    tag: 'API',
    desc: 'Middleware API para integração fiscal com Linx e outros sistemas.',
    tech: ['TypeScript', 'Node.js', 'API', 'Linx', 'Fiscal'],
    links: { github: 'https://github.com/brunocsilva41/steuer-gateway-linx', demo: '' },
    color: '#f97373',
    pos: { x: 0.94, y: -0.52, z: -0.94 },
  },
  {
    id: 18, isCenter: false, group: 'steuer',
    title: 'Steuer Core Backend',
    role: 'Desenvolvedor',
    tag: 'Backend',
    desc: 'Backend central para processamento e gestão fiscal do sistema Steuer.',
    tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'Fiscal'],
    links: { github: 'https://github.com/brunocsilva41/steuer-core-backend', demo: '' },
    color: '#f97373',
    pos: { x: 0.64, y: 0.41, z: 0.10 },
  },
  {
    id: 19, isCenter: false, group: 'steuer',
    title: 'Steuer VPN Service',
    role: 'Desenvolvedor',
    tag: 'Infra',
    desc: 'Agente de VPN e monitoramento de rede para conectividade fiscal (C#/.NET).',
    tech: ['C#', '.NET', 'VPN', 'Rede'],
    links: { github: 'https://github.com/brunocsilva41/steuer-vpn-service', demo: '' },
    color: '#f97373',
    pos: { x: -0.58, y: 0.74, z: 0.31 },
  },
  {
    id: 20, isCenter: false, group: 'steuer',
    title: 'Steuer Admin Panel',
    role: 'Desenvolvedor',
    tag: 'Dashboard',
    desc: 'Painel administrativo e dashboard para gestão do ecossistema Steuer (Laravel).',
    tech: ['PHP', 'Laravel', 'Blade', 'Dashboard'],
    links: { github: 'https://github.com/brunocsilva41/steuer-admin-panel', demo: '' },
    color: '#f97373',
    pos: { x: -1.40, y: 0.68, z: -0.81 },
  },
  {
    id: 21, isCenter: false, group: 'steuer',
    title: 'Steuer Frontend',
    role: 'Desenvolvedor',
    tag: 'Web',
    desc: 'Interface web do sistema Steuer para gestão fiscal.',
    tech: ['TypeScript', 'React', 'CSS'],
    links: { github: 'https://github.com/brunocsilva41/steuer-frontend', demo: '' },
    color: '#f97373',
    pos: { x: -0.22, y: 0.05, z: -1.25 },
  },
  // === Kippis ===
  {
    id: 22, isCenter: false, group: 'kippis',
    title: 'Kippis API v2',
    role: 'Desenvolvedor',
    tag: 'API',
    desc: 'Backend central em Go para gestão de benefícios Kippis.',
    tech: ['Go', 'API', 'PostgreSQL', 'Docker'],
    links: { github: 'https://github.com/brunocsilva41/kippis-api-v2', demo: '' },
    color: '#6dd5ed',
    pos: { x: 0.39, y: -0.22, z: -1.32 },
  },
  {
    id: 23, isCenter: false, group: 'kippis',
    title: 'Kippis Mobile App',
    role: 'Desenvolvedor',
    tag: 'Mobile',
    desc: 'Aplicativo mobile para colaboradores consultarem e utilizarem seus benefícios Kippis.',
    tech: ['TypeScript', 'React Native', 'Mobile'],
    links: { github: 'https://github.com/brunocsilva41/kippis-mobile-app', demo: '' },
    color: '#6dd5ed',
    pos: { x: 0.79, y: 0.06, z: -0.67 },
  },
  {
    id: 24, isCenter: false, group: 'kippis',
    title: 'Kippis Scheduler',
    role: 'Desenvolvedor',
    tag: 'Backend',
    desc: 'Sistema de agendamento de tarefas e automação de recargas Kippis.',
    tech: ['Go', 'Node.js', 'Agendamento'],
    links: { github: 'https://github.com/brunocsilva41/kippis-scheduler', demo: '' },
    color: '#6dd5ed',
    pos: { x: 0.28, y: 0.44, z: 0.11 },
  },
  {
    id: 25, isCenter: false, group: 'kippis',
    title: 'Kippis Web Dashboard',
    role: 'Desenvolvedor',
    tag: 'Dashboard',
    desc: 'Frontend administrativo para gestão de benefícios Kippis.',
    tech: ['TypeScript', 'React', 'Dashboard', 'CSS'],
    links: { github: 'https://github.com/brunocsilva41/kippis-web-dashboard', demo: '' },
    color: '#6dd5ed',
    pos: { x: -0.79, y: 0.66, z: -0.03 },
  },
  // === AI & Automação ===
  {
    id: 26, isCenter: false, group: 'tools',
    title: 'Agent Deploy Engine',
    role: 'Desenvolvedor',
    tag: 'DevOps',
    desc: 'Orquestrador de agentes de deploy para automação de infraestrutura e entrega contínua.',
    tech: ['Docker', 'Shell', 'DevOps', 'CI/CD'],
    links: { github: 'https://github.com/brunocsilva41/agent-deploy-engine', demo: '' },
    color: '#ff6b9d',
    pos: { x: -1.18, y: 0.49, z: -1.20 },
  },
  {
    id: 27, isCenter: false, group: 'tools',
    title: 'MCP Server Engine',
    role: 'Desenvolvedor',
    tag: 'AI',
    desc: 'Servidor de contexto MCP (Model Context Protocol) para integração avançada de ferramentas em modelos de IA.',
    tech: ['TypeScript', 'Node.js', 'MCP', 'AI'],
    links: { github: 'https://github.com/brunocsilva41/mcp-server-engine', demo: '' },
    color: '#ff6b9d',
    pos: { x: -0.20, y: -0.05, z: -2.19 },
  },
  {
    id: 28, isCenter: false, group: 'tools',
    title: 'Universal AI Terminal Tools',
    role: 'Desenvolvedor',
    tag: 'CLI',
    desc: 'Conjunto de ferramentas CLI para integração de IA no terminal de forma produtiva.',
    tech: ['TypeScript', 'Python', 'CLI', 'AI'],
    links: { github: 'https://github.com/brunocsilva41/universal-ai-terminal-tools', demo: '' },
    color: '#ff6b9d',
    pos: { x: 0.41, y: -0.22, z: -1.09 },
  },
  {
    id: 29, isCenter: false, group: 'tools',
    title: 'Chatbot IA',
    role: 'Desenvolvedor',
    tag: 'AI',
    desc: 'Sistema de chatbot inteligente com processamento de linguagem natural.',
    tech: ['TypeScript', 'Node.js', 'Chatbot', 'NLP'],
    links: { github: 'https://github.com/brunocsilva41/chatbot-ia', demo: '' },
    color: '#ff6b9d',
    pos: { x: 0.58, y: 0.13, z: -0.50 },
  },
  {
    id: 30, isCenter: false, group: 'tools',
    title: 'Chatbot Tester',
    role: 'Desenvolvedor',
    tag: 'Teste',
    desc: 'Ferramenta de testes automatizados para sistemas de chatbot.',
    tech: ['JavaScript', 'Node.js', 'Testes'],
    links: { github: 'https://github.com/brunocsilva41/CHATBOT-TESTER', demo: '' },
    color: '#ff6b9d',
    pos: { x: -0.01, y: 0.43, z: 0.00 },
  },
  {
    id: 31, isCenter: false, group: 'tools',
    title: 'Clara AI eSaúde Docs',
    role: 'Desenvolvedor',
    tag: 'Docs',
    desc: 'Documentação técnica, processos e arquitetura da agente de IA Clara (E-saúde).',
    tech: ['TypeScript', 'AI', 'Documentação'],
    links: { github: 'https://github.com/brunocsilva41/clara-ai-esaude-docs', demo: '' },
    color: '#ff6b9d',
    pos: { x: -0.85, y: 0.54, z: -0.38 },
  },
  {
    id: 32, isCenter: false, group: 'tools',
    title: 'Agent Deploy3',
    role: 'Desenvolvedor',
    tag: 'DevOps',
    desc: 'Definições de agentes em Markdown estruturado para orquestradores de IA.',
    tech: ['Docker', 'Markdown', 'DevOps'],
    links: { github: 'https://github.com/brunocsilva41/Agent-de-Deploy3', demo: '' },
    color: '#ff6b9d',
    pos: { x: -0.88, y: 0.31, z: -1.46 },
  },
  // === Backend & Infra ===
  {
    id: 33, isCenter: false, group: 'backend',
    title: 'Mobility Service Engine',
    role: 'Desenvolvedor',
    tag: 'Backend',
    desc: 'Engine completa para aplicativos de mobilidade urbana e logística (Node.js/React Native).',
    tech: ['TypeScript', 'Node.js', 'React Native', 'API'],
    links: { github: 'https://github.com/brunocsilva41/mobility-service-engine', demo: '' },
    color: '#6dd5ed',
    pos: { x: 0.21, y: -0.21, z: -2.03 },
  },
  {
    id: 34, isCenter: false, group: 'frontend',
    title: 'Finance Twix Commercial',
    role: 'Desenvolvedor',
    tag: 'Dashboard',
    desc: 'Sistema de gestão financeira pessoal e empresarial com foco em UX e simplicidade.',
    tech: ['TypeScript', 'React', 'Dashboard', 'CSS'],
    links: { github: 'https://github.com/brunocsilva41/finance-twix-commercial', demo: '' },
    color: '#ffd76b',
    pos: { x: 1.34, y: -0.73, z: -1.21 },
  },
  {
    id: 35, isCenter: false, group: 'frontend',
    title: 'Frontend Estoque',
    role: 'Desenvolvedor',
    tag: 'Web',
    desc: 'Interface web para gestão de estoque e inventário.',
    tech: ['TypeScript', 'React', 'CSS'],
    links: { github: 'https://github.com/brunocsilva41/frontend-estoque', demo: '' },
    color: '#6dd5ed',
    pos: { x: 0.35, y: 0.16, z: -0.44 },
  },
  {
    id: 36, isCenter: false, group: 'frontend',
    title: 'Gerenciador Financeiro Frontend',
    role: 'Desenvolvedor',
    tag: 'Web',
    desc: 'Frontend para gerenciamento financeiro pessoal com dashboard interativo.',
    tech: ['TypeScript', 'React', 'CSS', 'Dashboard'],
    links: { github: 'https://github.com/brunocsilva41/gerenciador_financeiro_frontend', demo: '' },
    color: '#6dd5ed',
    pos: { x: -0.21, y: 0.38, z: -0.19 },
  },
  {
    id: 37, isCenter: false, group: 'backend',
    title: 'n8n Automation Stack',
    role: 'Desenvolvedor',
    tag: 'DevOps',
    desc: 'Stack de automação de fluxos de trabalho utilizando n8n e Docker.',
    tech: ['Docker', 'n8n', 'Automação', 'DevOps'],
    links: { github: 'https://github.com/brunocsilva41/n8n-automation-stack', demo: '' },
    color: '#50e3c2',
    pos: { x: -0.79, y: 0.41, z: -0.69 },
  },
  {
    id: 38, isCenter: false, group: 'backend',
    title: 'Nexus Inventory System',
    role: 'Desenvolvedor',
    tag: 'ERP',
    desc: 'Sistema completo de gestão de estoque e ERP industrial (Go/React).',
    tech: ['Go', 'React', 'PostgreSQL', 'ERP'],
    links: { github: 'https://github.com/brunocsilva41/nexus-inventory-system', demo: '' },
    color: '#50e3c2',
    pos: { x: -0.55, y: 0.15, z: -1.58 },
  },
  {
    id: 39, isCenter: false, group: 'backend',
    title: 'Task Flow Monitor',
    role: 'Desenvolvedor',
    tag: 'Monitor',
    desc: 'Sistema de monitoramento e rastreabilidade de tarefas técnicas e operacionais.',
    tech: ['TypeScript', 'Node.js', 'Monitoramento'],
    links: { github: 'https://github.com/brunocsilva41/task-flow-monitor', demo: '' },
    color: '#50e3c2',
    pos: { x: 0.52, y: -0.32, z: -1.77 },
  },
  {
    id: 40, isCenter: false, group: 'backend',
    title: 'Backend (Go)',
    role: 'Desenvolvedor',
    tag: 'API',
    desc: 'API REST em Go utilizando Fiber v2 para alta performance.',
    tech: ['Go', 'Fiber', 'API', 'REST'],
    links: { github: 'https://github.com/brunocsilva41/backend', demo: '' },
    color: '#50e3c2',
    pos: { x: 1.25, y: 0.01, z: -0.78 },
  },
  {
    id: 41, isCenter: false, group: 'backend',
    title: 'BACKEND Passo a Passo',
    role: 'Desenvolvedor',
    tag: 'API',
    desc: 'API REST em Node.js/Express com endpoints para consulta de instruções passo a passo.',
    tech: ['JavaScript', 'Node.js', 'Express', 'API'],
    links: { github: 'https://github.com/brunocsilva41/BACKEND---Passo-a-Passo', demo: '' },
    color: '#50e3c2',
    pos: { x: 0.61, y: 0.59, z: 0.46 },
  },
  // === Frontend & Web ===
  {
    id: 42, isCenter: false, group: 'frontend',
    title: 'Café Gourmet (HTML)',
    role: 'Desenvolvedor',
    tag: 'Web',
    desc: 'Landing page estática para cafeteria artesanal (versão HTML/CSS puro).',
    tech: ['HTML', 'CSS', 'JavaScript'],
    links: { github: 'https://github.com/brunocsilva41/cafe-gourmet', demo: '' },
    color: '#f9a873',
    pos: { x: -0.30, y: 0.30, z: -0.40 },
  },
  {
    id: 43, isCenter: false, group: 'frontend',
    title: 'GymOS',
    role: 'Desenvolvedor',
    tag: 'Web',
    desc: 'Sistema de gestão para academias com controle de alunos e treinos.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    links: { github: 'https://github.com/brunocsilva41/gymOS', demo: '' },
    color: '#6c8cff',
    pos: { x: -0.64, y: 0.29, z: -0.91 },
  },
  {
    id: 44, isCenter: false, group: 'frontend',
    title: 'Meu Projeto',
    role: 'Desenvolvedor',
    tag: 'Projeto',
    desc: 'Projeto experimental de desenvolvimento full-stack.',
    tech: ['JavaScript', 'Node.js'],
    links: { github: 'https://github.com/brunocsilva41/meuprojeto', demo: '' },
    color: '#6c8cff',
    pos: { x: -0.23, y: 0.02, z: -1.57 },
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
    name: 'Steuer & SEFAZ',
    desc: 'Ecossistema fiscal completo: middlewares de integração SEFAZ, backend central, VPN, painel admin e deploy automatizado.',
    color: '#f97373',
    repoIds: [4, 11, 14, 15, 17, 18, 19],
  },
  {
    name: 'Kippis',
    desc: 'Plataforma de gestão de benefícios: backend em Go, app mobile, scheduler e dashboard administrativo.',
    color: '#6dd5ed',
    repoIds: [22, 23, 24, 25],
  },
  {
    name: 'AI & Automação',
    desc: 'Agentes inteligentes multi-provedor, servidores MCP, chatbots e ferramentas CLI para automação com IA.',
    color: '#a78bfa',
    repoIds: [3, 12, 26, 27, 28, 29, 30, 31, 32],
  },
  {
    name: 'Ferramentas DevOps',
    desc: 'Servidores MCP, sistemas de estoque, automação n8n, monitoramento e APIs em Go/Node.js.',
    color: '#50e3c2',
    repoIds: [2, 13, 33, 37, 38, 39, 40, 41],
  },
  {
    name: 'Aplicações Web',
    desc: 'Landing pages, dashboards financeiros, gestão de estoque e frontends responsivos.',
    color: '#ff6b9d',
    repoIds: [5, 6, 34, 35, 36, 42, 43, 44],
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
