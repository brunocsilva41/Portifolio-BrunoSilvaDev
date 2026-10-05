/*
 * Perfil editorial do portfólio (home, forma de trabalho, empresa e contato).
 * A contagem de produtos em produção vem dos próprios cases (CASES.length).
 */

import { CASES } from './case-view-model.js';

export const PROFILE = {
  name: 'Bruno Silva',
  role: { pt: 'Engenheiro de software full stack', en: 'Full stack software engineer' },
  location: { pt: 'São Paulo, Brasil · remoto', en: 'São Paulo, Brazil · remote' },
  availability: { pt: 'Disponível', en: 'Available' },
  // Linha de identidade abaixo do nome no hero.
  title: { pt: 'Fundador da BC Consultoria e Desenvolvimento de Softwares', en: 'Founder of BC Consultoria e Desenvolvimento de Softwares' },
  // Tecnologias de foco (todas presentes nos cases).
  focus: ['TypeScript', 'Node.js', 'Go', 'React', 'React Native', 'C# / .NET', 'PostgreSQL', { pt: 'IA aplicada · RAG', en: 'Applied AI · RAG' }],

  // H1 em duas linhas: a quebra acontece depois da primeira frase.
  headline: {
    pt: 'Me apresente um problema. Eu entrego o sistema que resolve.',
    en: 'Show me a problem. I’ll deliver the system that solves it.',
  },
  headlineAccent: { pt: 'o sistema que resolve', en: 'the system that solves it' },
  // Parágrafo completo (llms/SEO). No hero ele aparece desmembrado em `feats` + `hook`.
  lede: {
    pt: 'Já liguei a SEFAZ ao ERP de redes de lojas sem abrir uma porta sequer no servidor do cliente. Coloquei a segurança de uma obra inteira no celular de quem trabalha nela. Ensinei uma IA a diagnosticar empresas citando a fonte, numa base de 300 mil. E tirei do caderno a rotina de uma academia com duas unidades e mais de 500 alunos. Cada um desses sistemas começou como um problema que ninguém queria encarar.',
    en: 'I’ve connected SEFAZ to retail chains’ ERP without opening a single port on the client’s server. I put a whole construction site’s safety program on the phones of the people working there. I taught an AI to assess companies citing its sources, across a base of 300,000. And I took a two-location gym with 500+ members off paper. Each of these systems started as a problem nobody wanted to touch.',
  },
  // Os quatro feitos do hero, cada um ligado ao seu case no seletor da home.
  feats: [
    {
      case: 'steuer',
      text: {
        pt: 'Já liguei a SEFAZ ao ERP de redes de lojas sem abrir uma porta sequer no servidor do cliente.',
        en: 'I’ve connected SEFAZ to retail chains’ ERP without opening a single port on the client’s server.',
      },
    },
    {
      case: 'kippis',
      text: {
        pt: 'Coloquei a segurança de uma obra inteira no celular de quem trabalha nela.',
        en: 'I put a whole construction site’s safety program on the phones of the people working there.',
      },
    },
    {
      case: 'leadspector',
      text: {
        pt: 'Ensinei uma IA a diagnosticar empresas citando a fonte, numa base de 300 mil.',
        en: 'I taught an AI to assess companies citing its sources, across a base of 300,000.',
      },
    },
    {
      case: 'gymos',
      text: {
        pt: 'E tirei do caderno a rotina de uma academia com duas unidades e mais de 500 alunos.',
        en: 'And I took a two-location gym with 500+ members off paper.',
      },
    },
  ],
  hook: {
    pt: 'Cada um desses sistemas começou como um problema que ninguém queria encarar.',
    en: 'Each of these systems started as a problem nobody wanted to touch.',
  },

  credentials: [
    { value: '4+', label: { pt: 'anos construindo e sustentando software', en: 'years building and running software' }, count: { to: 4, suffix: '+' } },
    { value: String(CASES.length), label: { pt: 'produtos em produção de ponta a ponta', en: 'products in production end to end' }, count: { to: CASES.length } },
    { value: '12', label: { pt: 'integrações entregues: ERP, SEFAZ, gateways, crawlers e APIs', en: 'integrations delivered: ERP, SEFAZ, gateways, crawlers and APIs' }, count: { to: 12 } },
    { value: '1 mi+', label: { pt: 'registros processados por mês', en: 'records processed per month' }, count: { to: 1, suffix: ' mi+' } },
  ],

  capabilities: [
    {
      id: 'integracoes',
      title: { pt: 'Integrações', en: 'Integrations' },
      text: {
        pt: 'Conecto sistemas que não foram feitos para conversar: notas do PlugStorage e do PlugNotas até um Linx on-premise, EPIs validados na base CA-EPI, centenas de milhares de empresas no Elasticsearch. Sempre com retry e rastreabilidade.',
        en: 'I connect systems that were never meant to talk: invoices from PlugStorage and PlugNotas into an on-premise Linx, PPE checked against the CA-EPI registry, hundreds of thousands of companies in Elasticsearch. Always with retries and traceability.',
      },
      stack: ['Linx', 'PlugStorage', 'PlugNotas', 'CA-EPI', 'Elasticsearch'],
      cases: ['steuer', 'kippis', 'leadspector'],
    },
    {
      id: 'automacao',
      title: { pt: 'Automação', en: 'Automation' },
      text: {
        pt: 'Rotina manual vira processo que roda sozinho: filas RabbitMQ e fluxos n8n para o trabalho fiscal, schedulers que varrem prazos toda madrugada, uma régua de cobrança que tenta em 0, 3 e 7 dias com e-mails em fila no BullMQ, crawlers no próprio ritmo. O time cuida só da exceção.',
        en: 'Manual routines become processes that run on their own: RabbitMQ queues and n8n flows for tax work, schedulers sweeping deadlines every night, a dunning flow that retries at 0, 3 and 7 days with emails queued on BullMQ, crawlers at their own pace. The team only handles the exceptions.',
      },
      stack: ['RabbitMQ', 'n8n', 'Cron', 'BullMQ', 'Go', 'Rod'],
      cases: ['steuer', 'kippis', 'leadspector', 'gymos'],
    },
    {
      id: 'distribuidos',
      title: { pt: 'Sistemas distribuídos', en: 'Distributed systems' },
      text: {
        pt: 'Estágios independentes, para a falha ficar onde aconteceu. Estado persistido antes de enfileirar, tenant isolado na sessão, grafo Neo4j para contexto e índice para busca. Cresce sem reescrever.',
        en: 'Independent stages, so a failure stays where it happened. State persisted before queueing, tenant scoped at the session, a Neo4j graph for context and an index for search. It grows without a rewrite.',
      },
      stack: ['Bun', 'Fastify', 'Go', 'Neo4j', 'PostgreSQL', 'MySQL'],
      cases: ['steuer', 'kippis', 'leadspector'],
    },
    {
      id: 'seguranca',
      title: { pt: 'Segurança', en: 'Security' },
      text: {
        pt: 'Segurança entra no desenho, não no fim. RBAC de ponta a ponta entre API Go, painel React e app mobile, cinco papéis com escopo por unidade na academia, multi-tenancy pela sessão e um túnel WireGuard até o ERP do cliente sem abrir porta para a internet.',
        en: 'Security goes into the design, not the end. End-to-end RBAC across a Go API, a React dashboard and a mobile app, five roles scoped per location at the gym, session-scoped multi-tenancy and a WireGuard tunnel to the client’s ERP without opening a port to the internet.',
      },
      stack: ['RBAC', 'WireGuard', 'SecureStore', 'Multi-tenant'],
      cases: ['steuer', 'kippis', 'gymos'],
    },
    {
      id: 'operacao',
      title: { pt: 'Operação', en: 'Operations' },
      text: {
        pt: 'Entregar é metade do trabalho; a outra metade é manter rodando. CI/CD com Docker e GitHub Actions, um instalador MSI (WiX) que sobe o conector no servidor do cliente em minutos, a academia implantada em Docker com a equipe treinada e acompanhamento até o sistema ficar previsível.',
        en: 'Shipping is half the job; keeping it running is the other half. CI/CD with Docker and GitHub Actions, an MSI installer (WiX) that brings the connector up on the client’s server in minutes, the gym deployed on Docker with its staff trained, and follow-up until the system is predictable.',
      },
      stack: ['Docker', 'GitHub Actions', '.NET', 'WiX'],
      cases: ['steuer', 'kippis', 'gymos'],
    },
  ],

  // Forma de trabalho: aberta, sem rotular formato de contratação.
  approach: {
    title: { pt: 'Do problema ao produto.', en: 'From problem to product.' },
    intro: {
      pt: 'Pode ser um ERP que ninguém quer tocar ou uma ideia que ainda cabe num guardanapo: eu entro de ponta a ponta e entrego um produto viável, funcionando e que dá gosto de usar.',
      en: 'It can be an ERP nobody wants to touch or an idea that still fits on a napkin: I dive in end to end and deliver a viable product that works and that people enjoy using.',
    },
    steps: [
      {
        title: { pt: 'Entender o problema', en: 'Understand the problem' },
        text: {
          pt: 'Começo pela operação real e por quem vive o problema: onde se perde tempo, onde nasce o erro, o que não pode parar.',
          en: 'I start with the real operation and the people living the problem: where time is lost, where errors start, what cannot stop.',
        },
      },
      {
        title: { pt: 'Desenhar a solução', en: 'Design the solution' },
        text: {
          pt: 'Escolho arquitetura e stack pelo problema, não pela moda, e deixo claro o que entra primeiro e por quê.',
          en: 'I pick architecture and stack for the problem, not the trend, and make clear what comes first and why.',
        },
      },
      {
        title: { pt: 'Construir', en: 'Build' },
        text: {
          pt: 'Entrego em fatias que já funcionam, com código revisável, testes e CI/CD desde o primeiro dia.',
          en: 'I ship in slices that already work, with reviewable code, tests and CI/CD from day one.',
        },
      },
      {
        title: { pt: 'Colocar no ar', en: 'Go live' },
        text: {
          pt: 'Implanto, migro os dados, documento e treino quem vai usar, sem parar o que já roda.',
          en: 'I deploy, migrate the data, document and train the people who will use it, without stopping what already runs.',
        },
      },
      {
        title: { pt: 'Evoluir junto', en: 'Grow it together' },
        text: {
          pt: 'Acompanho os números depois da entrega e ajusto com dados reais até o sistema ficar previsível.',
          en: 'I follow the numbers after launch and tune with real data until the system is predictable.',
        },
      },
    ],
  },

  trajectoryIntro: {
    pt: 'Comecei no suporte técnico e na programação de uma fabricante de controle de acesso, resolvendo problema de cliente na linha de frente. Esse olhar de operação veio comigo para a engenharia: hoje desenho e entrego sistemas fiscais, de segurança do trabalho, de gestão de academias e de IA aplicada, para empresas e clientes diretos.',
    en: 'I started in technical support and programming at an access-control manufacturer, solving customer problems on the front line. That operations mindset came with me into engineering: today I design and ship tax, workplace safety, gym management and applied AI systems for companies and direct clients.',
  },

  closing: {
    statement: {
      pt: 'Qual é o próximo sistema que a sua empresa precisa?',
      en: 'What’s the next system your business needs?',
    },
    text: {
      pt: 'Me conte o contexto: um problema, uma ideia ou um sistema que precisa evoluir. Eu respondo com um caminho técnico claro e o primeiro passo para tirar do papel.',
      en: 'Tell me the context: a problem, an idea or a system that needs to evolve. I’ll reply with a clear technical path and the first step to get it built.',
    },
  },

  company: {
    name: 'BC Consultoria e Desenvolvimento de Softwares',
    legalName: 'BC CONSULTORIA E DESENVOLVIMENTO DE SOFTWARES',
    taxID: '60.589.106/0001-02',
    founder: 'Bruno Silva',
  },

  contact: {
    email: 'brunocesar.social@gmail.com',
    linkedin: 'https://www.linkedin.com/in/dev-bruno-silva/',
    github: 'https://github.com/brunocsilva41',
    phone: '+55 11 98864-4269',
    phoneHref: 'tel:+5511988644269',
  },
};
