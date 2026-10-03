// Definição editorial do case kippis. Normalizada em ../case-view-model.js.
//
// Contagens do código dos sistemas: 180 endpoints em 27 módulos de API, 78 tabelas em 6 schemas,
// 5 rotinas do scheduler (3h, 3h30, 4h, 4h30, 5h), 42 condições de insalubridade/periculosidade,
// matriz de risco 5 × 4 com 5 prioridades, RBAC em 3 níveis sobre 32 módulos de permissão, 18 telas no app,
// regras de sessão (MFA 15 min, sessão 1 h, refresh 30 dias, 5 sessões web) e período 2025 — 2026.
export default {
  slug: 'kippis',
  aliases: ['gestao-beneficios'],
  order: 2,
  accent: 'ops',
  title: { pt: 'Kippis', en: 'Kippis' },
  category: 'operacoes',
  domains: ['seguranca-do-trabalho', 'gestao-de-pessoas'],
  pitch: {
    pt: 'Segurança do trabalho no bolso de quem está na obra.',
    en: 'Workplace safety in the pocket of the people on site.',
  },
  summary: {
    pt: 'Plataforma de SST que leva APR, permissão de trabalho, inspeção e advertência para o celular do técnico e liga tudo a colaboradores, cargos, NRs, exames e EPIs. Toda madrugada, cinco rotinas varrem os prazos legais de cada empresa e avisam o responsável certo antes do vencimento e de novo no dia, antes do turno começar.',
    en: 'A workplace safety platform that puts risk assessments, work permits, inspections and disciplinary warnings on the technician’s phone and ties them to employees, roles, safety standards, exams and PPE. Every night, five routines sweep each company’s legal deadlines and alert the right person ahead of the due date and again on the day, before the shift starts.',
  },
  client: { pt: 'Construtora de grande porte', en: 'Large construction company' },
  period: { pt: '2025 — 2026', en: '2025 — 2026' },
  team: { pt: 'Squad de 4 pessoas', en: '4-person squad' },
  roleTitle: {
    pt: 'Engenheiro full stack · líder do app mobile e das regras de SST',
    en: 'Full stack engineer · lead for the mobile app and safety rules',
  },
  context: {
    pt: 'Produto empresarial · construtora de grande porte',
    en: 'Enterprise product · large construction company',
  },
  businessContext: {
    pt: 'Numa construtora de grande porte, segurança do trabalho é exigência legal e risco de vida ao mesmo tempo. Cada frente de obra reúne equipes próprias e terceiras; cada cargo carrega NRs, exames do PCMSO, EPIs com CA válido e adicionais de insalubridade ou periculosidade. Toda atividade crítica começa com uma APR e uma permissão assinada. Quando esse controle vive em papel, planilha e grupo de mensagem, o treinamento vencido aparece na fiscalização, na auditoria ou, no pior caso, depois do acidente.',
    en: 'At a large construction company, workplace safety is both a legal requirement and a matter of life and death. Every site mixes in-house and contracted crews; every role carries safety standards, occupational health exams, PPE with a valid approval certificate and hazard or unhealthy-work allowances. Every critical activity starts with a risk assessment and a signed permit. When all of that lives on paper, spreadsheets and chat groups, an expired training shows up during an inspection, an audit or, at worst, after an accident.',
  },
  problem: {
    pt: 'O registro precisava acontecer no canteiro, em minutos, com a assinatura de quem vai executar o serviço. RH, saúde ocupacional, segurança e almoxarifado precisavam enxergar o mesmo colaborador sem misturar dados entre empresas. E prazos de naturezas diferentes — certificado de treinamento, CA do EPI, vida útil de cada unidade, ASO periódico e ativos — tinham de virar avisos para a pessoa certa, na hora certa e sem repetição, sem soterrar o técnico de segurança em notificações.',
    en: 'Records had to happen on site, in minutes, signed by the people who will do the job. HR, occupational health, safety and the warehouse needed to see the same employee without mixing data across companies. And deadlines of very different kinds — training certificates, PPE approval numbers, the lifespan of each unit, periodic medical exams and assets — had to become alerts for the right person, at the right time and never repeated, without burying the safety technician in notifications.',
  },
  challengePoints: [
    {
      title: { pt: 'Campo primeiro', en: 'Field first' },
      text: {
        pt: 'APR com matriz de risco, permissão de trabalho e inspeção preenchidas no celular, etapa por etapa, com assinatura na tela e validação antes do envio. Nenhuma PT pode nascer sem uma APR vinculada.',
        en: 'Risk assessments with a risk matrix, work permits and inspections filled in on the phone, step by step, with on-screen signatures and validation before sending. No permit may exist without a linked risk assessment.',
      },
    },
    {
      title: { pt: 'Cada NR com a sua regra', en: 'Every standard has its own rule' },
      text: {
        pt: 'NR-35, NR-15, NR-16, NR-06: cada norma exige coisas diferentes de cargos, turmas e permissões. Incluir uma norma nova ou acompanhar uma revisão tinha de ser cadastro, nunca deploy.',
        en: 'NR-35, NR-15, NR-16, NR-06 — work at height, unhealthy work, hazardous work, PPE: each regulation demands different things from roles, classes and permits. Adding a new standard or following a revision had to be data entry, never a deploy.',
      },
    },
    {
      title: { pt: 'Prazos que não podem passar', en: 'Deadlines that cannot slip' },
      text: {
        pt: 'Treinamentos, CAs, vida útil de EPI por unidade, ASOs periódicos e ativos vencem em ritmos diferentes — e cada um tem um responsável diferente a ser avisado.',
        en: 'Training, approval numbers, per-unit PPE lifespan, periodic medical exams and assets expire at different paces — and each one has a different person who must be warned.',
      },
    },
  ],
  solution: {
    pt: 'Construí o app de campo em Expo e React Native e estruturei o painel web em React. Por trás, uma API em Go e Fiber, com 180 endpoints em 27 módulos de API e 32 módulos de permissão, isola cada empresa na sessão e trata NRs, exames, EPIs e adicionais como dados ligados ao cargo. Um scheduler em Go roda cinco rotinas por empresa toda madrugada, descobre quem precisa ser avisado e registra cada envio.',
    en: 'I built the field app in Expo and React Native and structured the React web dashboard. Behind them, a Go and Fiber API with 180 endpoints across 27 API modules and 32 permission modules scopes every company at the session and treats standards, exams, PPE and allowances as data tied to the role. A Go scheduler runs five routines per company every night, works out who must be warned and records every delivery.',
  },
  deliverables: [
    {
      title: { pt: 'App de campo', en: 'Field app' },
      text: {
        pt: 'APR em cinco etapas com matriz de risco 5 × 4, PT com equipe e assinaturas, inspeção por checklist e advertência com testemunhas e foto.',
        en: 'Five-step risk assessment with a 5 × 4 risk matrix, permits with crew and signatures, checklist inspections and warnings with witnesses and photos.',
      },
    },
    {
      title: { pt: 'API multiempresa', en: 'Multi-tenant API' },
      text: {
        pt: 'Go e Fiber com empresa vinda da sessão, RBAC em três níveis por módulo e por plataforma, MFA e auditoria em cada alteração.',
        en: 'Go and Fiber with the company taken from the session, three-level RBAC per module and per platform, MFA and an audit trail on every change.',
      },
    },
    {
      title: { pt: 'NRs, cargos e treinamentos', en: 'Standards, roles and training' },
      text: {
        pt: 'Catálogo de NRs ligado a turmas e PTs; cada cargo define exames, EPIs e adicionais a partir de 42 condições de insalubridade e periculosidade.',
        en: 'A standards catalog linked to classes and permits; each role defines exams, PPE and allowances from 42 mapped unhealthy and hazardous conditions.',
      },
    },
    {
      title: { pt: 'Scheduler de vencimentos', en: 'Expiry scheduler' },
      text: {
        pt: 'Cinco rotinas escalonadas entre 3h e 5h, que avisam antes do vencimento e de novo no dia, com destinatário resolvido pela hierarquia e um único aviso por item a cada dia.',
        en: 'Five routines staggered between 3 and 5 a.m. that alert ahead of the due date and again on the day, with recipients resolved through the hierarchy and a single alert per item per day.',
      },
    },
  ],
  role: {
    pt: 'Planejei e construí o app mobile do zero, da arquitetura de rotas ao tratamento de sessão, e fiz a estruturação real do painel web. Na API, modelei o backend para comportar várias NRs e se adaptar a cada uma: norma, cargo, exame, EPI e adicional viraram dados relacionados, não regras fixas no código. Escrevi a lógica de negócio dos avisos de exames, de vencimento de EPI e de treinamentos, e transformei as exigências do time de SST do cliente em validações de sistema.',
    en: 'I planned and built the mobile app from scratch, from route architecture to session handling, and did the real structuring of the web dashboard. In the API, I modeled the backend to support many safety standards and adapt to each one: standard, role, exam, PPE and allowance became related data, not rules hard-coded in the system. I wrote the business logic for exam alerts, PPE expiry and training notices, and turned the client safety team’s requirements into system validations.',
  },
  responsibilities: [
    { pt: 'Construí o app em Expo/React Native: APR, PT, inspeção, advertência, MFA e recuperação de senha em 18 telas.', en: 'Built the Expo/React Native app: risk assessments, permits, inspections, warnings, MFA and password recovery across 18 screens.' },
    { pt: 'Modelei NRs, cargos, exames, EPIs e adicionais como dados relacionados, para que uma norma nova seja cadastro e não código.', en: 'Modeled standards, roles, exams, PPE and allowances as related data, so a new standard is data entry rather than code.' },
    { pt: 'Desenhei o RBAC com níveis ver, interagir e gerenciar por módulo, aplicado de forma distinta para web e mobile.', en: 'Designed RBAC with view, interact and manage levels per module, enforced separately for web and mobile.' },
    { pt: 'Escrevi as cinco rotinas de vencimento e a resolução de destinatários por líder direto, gestor do setor e gestor do local.', en: 'Wrote the five expiry routines and recipient resolution through direct leader, sector manager and site manager.' },
    { pt: 'Integrei o cadastro de EPIs ao serviço CA-EPI e a vida útil de cada unidade ao controle de estoque.', en: 'Integrated PPE registration with the CA-EPI service and per-unit lifespan with inventory control.' },
    { pt: 'Gerei certificados de treinamento em PDF no próprio backend, guardados no S3 por turma e participante.', en: 'Generated PDF training certificates in the backend itself, stored in S3 per class and participant.' },
  ],
  outcome: {
    pt: 'App de campo, API multiempresa e rotinas noturnas de vencimento sustentando a operação de SST de uma construtora de grande porte.',
    en: 'A field app, multi-tenant API and nightly expiry routines running safety operations for a large construction company.',
  },
  preview: {
    summary: { pt: 'SST no canteiro: APR, permissões, treinamentos, EPIs e alertas de vencimento.', en: 'Safety on site: risk assessments, permits, training, PPE and expiry alerts.' },
    problem: { pt: 'Prazos legais espalhados entre papel, planilha e cinco tipos de controle.', en: 'Legal deadlines scattered across paper, spreadsheets and five kinds of control.' },
    role: { pt: 'App mobile, modelagem de NRs e lógica dos avisos de vencimento.', en: 'Mobile app, safety-standard modeling and expiry alert logic.' },
    outcome: { pt: 'Nenhum prazo de SST vence sem o responsável saber.', en: 'No safety deadline expires without its owner knowing.' },
  },
  metrics: [
    {
      value: { pt: '5', en: '5' },
      label: { pt: 'prazos legais vigiados toda madrugada', en: 'legal deadlines watched every night' },
      context: { pt: 'treinamento, CA, vida útil de EPI, ASO periódico e ativos', en: 'training, approval number, PPE lifespan, periodic exam and assets' },
      count: { to: 5 },
      basis: 'scope',
    },
    {
      value: { pt: '180', en: '180' },
      label: { pt: 'endpoints na API multiempresa', en: 'endpoints in the multi-tenant API' },
      context: { pt: '27 módulos de API, de RH e saúde a estoque e comunicação', en: '27 API modules, from HR and health to inventory and comms' },
      count: { to: 180 },
      basis: 'scope',
    },
    {
      value: { pt: '2.500', en: '2,500' },
      label: { pt: 'colaboradores acompanhados', en: 'employees tracked' },
      context: { pt: 'próprios e terceiros, em várias frentes de obra', en: 'in-house and contracted, across several sites' },
      count: { to: 2500 },
      basis: 'confirmed',
    },
    {
      value: { pt: '42', en: '42' },
      label: { pt: 'condições de insalubridade e periculosidade mapeadas', en: 'unhealthy and hazardous conditions mapped' },
      context: { pt: '24 da NR-15 e 18 da NR-16, com o percentual de adicional de cada cargo', en: '24 under NR-15 and 18 under NR-16, with each role’s allowance rate' },
      count: { to: 42 },
      basis: 'scope',
    },
  ],
  impact: [
    { pt: 'Treinamentos, CAs, EPIs, ASOs e ativos avisam o responsável antes do vencimento e de novo no dia, antes do turno, em vez de aparecerem na auditoria.', en: 'Training, approval numbers, PPE, medical exams and assets alert their owner ahead of the due date and again on the day, before the shift, instead of surfacing at audit time.' },
    { pt: 'A emissão de uma permissão de trabalho no canteiro caiu de cerca de 20 minutos em papel para menos de 5 no app.', en: 'Issuing a work permit on site dropped from about 20 minutes on paper to under 5 in the app.' },
    { pt: 'Toda PT nasce vinculada a uma APR avaliada risco a risco, com equipe e signatários validados dentro da mesma empresa.', en: 'Every permit is born linked to a risk assessment scored risk by risk, with crew and signers validated inside the same company.' },
    { pt: 'Cada aviso fica registrado com destinatário e resultado do envio: na fiscalização, a prova de que o responsável foi avisado já está pronta.', en: 'Every alert is stored with its recipient and delivery result: when inspectors arrive, proof that the owner was warned is already there.' },
  ],
  technologies: ['Go', 'Fiber', 'PostgreSQL', 'Expo', 'React Native', 'TypeScript', 'React', 'Vite', 'Tailwind CSS', 'AWS S3', 'Docker', 'CA-EPI'],
  stackGroups: [
    { label: { pt: 'Mobile', en: 'Mobile' }, items: ['Expo', 'React Native', 'Expo Router', 'React Query', 'React Hook Form', 'Zod', 'SecureStore'] },
    { label: { pt: 'Web', en: 'Web' }, items: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Zustand'] },
    { label: { pt: 'Backend', en: 'Backend' }, items: ['Go', 'Fiber', 'sqlx', 'JWT', 'TOTP', 'robfig/cron'] },
    { label: { pt: 'Dados e integrações', en: 'Data and integrations' }, items: ['PostgreSQL', 'Goose', 'AWS S3', 'CA-EPI', 'SMTP'] },
    { label: { pt: 'Infra', en: 'Infra' }, items: ['Docker', 'Nginx', 'GitHub Actions'] },
  ],
  components: [
    {
      title: { pt: 'Aplicativo de campo', en: 'Field app' },
      purpose: { pt: 'Levar o registro de segurança para o lugar onde o trabalho acontece.', en: 'Bring safety records to the place where the work happens.' },
      mechanism: { pt: 'São 18 telas em Expo Router. A APR segue cinco etapas — informações, riscos, etapas da atividade, gravidade e assinatura — e cada risco recebe frequência e severidade numa matriz 5 × 4 que devolve prioridade de 1 a 5, com medida de controle administrativa, de EPI ou de engenharia. React Hook Form e Zod barram o envio incompleto. A sessão vive em cookies no SecureStore, e o app só volta ao login quando a API responde SESSION_EXPIRED: um 401 qualquer não derruba um formulário em andamento.', en: 'Eighteen screens on Expo Router. The risk assessment follows five steps — details, risks, activity steps, severity and signature — and each risk gets a frequency and severity on a 5 × 4 matrix that returns a priority from 1 to 5, with an administrative, PPE or engineering control. React Hook Form and Zod block incomplete submissions. The session lives in cookies in SecureStore, and the app only returns to login when the API answers SESSION_EXPIRED: a generic 401 never kills a form in progress.' },
      stack: ['Expo', 'React Native', 'TypeScript', 'Zod'],
    },
    {
      title: { pt: 'API multiempresa', en: 'Multi-tenant API' },
      purpose: { pt: 'Fazer RH, saúde ocupacional, segurança e almoxarifado compartilharem contexto sem misturar empresas.', en: 'Let HR, occupational health, safety and the warehouse share context without mixing companies.' },
      mechanism: { pt: 'O middleware de autenticação tira empresa e usuário da sessão; o de autorização compara o nível exigido pela rota — ver, interagir ou gerenciar — com o do papel naquele módulo e naquela plataforma, com cache de 30 segundos invalidado quando o papel muda. Login com MFA por código, sessão de 1 hora renovada por refresh token de 30 dias e no máximo 5 sessões web por usuário. 68 pontos de auditoria registram quem alterou o quê. São 78 tabelas em 6 schemas: core, hr, health, safety, stock e comms.', en: 'The authentication middleware takes company and user from the session; the authorization middleware compares the level the route requires — view, interact or manage — with the role’s level for that module and platform, cached for 30 seconds and invalidated when the role changes. Login with an MFA code, a 1-hour session renewed by a 30-day refresh token and at most 5 web sessions per user. Sixty-eight audit points record who changed what. Seventy-eight tables across 6 schemas: core, hr, health, safety, stock and comms.' },
      stack: ['Go', 'Fiber', 'PostgreSQL', 'JWT'],
    },
    {
      title: { pt: 'NRs, cargos e saúde ocupacional', en: 'Standards, roles and occupational health' },
      purpose: { pt: 'Fazer o sistema se adaptar a cada norma sem reescrever código.', en: 'Make the system adapt to each standard without rewriting code.' },
      mechanism: { pt: 'Cada NR é um registro com atividade e objetivo; tabelas de ligação conectam a norma às turmas que a cobrem e às PTs que a exigem. O cargo define exames obrigatórios, EPIs exigidos e adicionais: insalubridade da NR-15 em 10, 20 ou 40%, periculosidade da NR-16 em 30% fixo e condições de penosidade. Os ASOs — admissional, periódico, retorno ao trabalho, demissional e PCMSO — registram apto, inapto ou restrito.', en: 'Each standard is a record with its activity and objective; link tables connect it to the classes that cover it and the permits that require it. The role defines mandatory exams, required PPE and allowances: unhealthy-work allowance under NR-15 at 10, 20 or 40%, hazard pay under NR-16 at a fixed 30%, and strenuous-work conditions. Medical certificates — pre-hire, periodic, return to work, exit and the health program — record fit, unfit or restricted.' },
      stack: ['Go', 'PostgreSQL'],
    },
    {
      title: { pt: 'Treinamentos e certificados', en: 'Training and certificates' },
      purpose: { pt: 'Registrar quem participou, quais NRs a turma cobre e qual evidência foi emitida.', en: 'Record who attended, which standards the class covers and what evidence was issued.' },
      mechanism: { pt: 'Turmas de treinamento ou DDS, do tipo obrigatório, específico ou reciclagem, com instrutor, carga horária, lista de presença e NRs. O backend gera o certificado em PDF A4 sem nenhuma dependência externa — nome, documento, carga horária, instrutor e validade — e o guarda no S3 por turma e participante, pronto para baixar na auditoria.', en: 'Training classes or safety talks, typed as mandatory, specific or refresher, with instructor, workload, attendance and standards. The backend generates an A4 PDF certificate with no external dependency — name, ID, workload, instructor and expiry — and stores it in S3 per class and participant, ready to download at audit time.' },
      stack: ['Go', 'PostgreSQL', 'AWS S3'],
    },
    {
      title: { pt: 'EPIs, estoque e ativos', en: 'PPE, inventory and assets' },
      purpose: { pt: 'Saber qual equipamento está com quem, se o CA vale e quando ele precisa ser trocado.', en: 'Know which equipment is with whom, whether its approval is valid and when it must be replaced.' },
      mechanism: { pt: 'O modelo de EPI consulta o número do CA no serviço CA-EPI e guarda a validade. Cada unidade tem número de série, status e data de compra, de onde sai a vida útil em dias, semanas, meses ou anos. Entregas ao colaborador registram a devolução e o estado do item; ferramentas e máquinas têm empréstimo com checklist, intervenção e inventário. Só este módulo responde por 38 endpoints.', en: 'The PPE model looks up the approval number on the CA-EPI service and stores its expiry. Each unit has a serial number, status and purchase date, from which lifespan is computed in days, weeks, months or years. Handouts to employees record the return and the item’s condition; tools and machines get loans with checklists, interventions and inventory. This module alone serves 38 endpoints.' },
      stack: ['Go', 'PostgreSQL', 'CA-EPI'],
    },
    {
      title: { pt: 'Scheduler de vencimentos', en: 'Expiry scheduler' },
      purpose: { pt: 'Transformar prazos espalhados entre módulos em avisos acionáveis para a pessoa certa.', en: 'Turn deadlines scattered across modules into actionable alerts for the right person.' },
      mechanism: { pt: 'Serviço Go separado da API, com cinco jobs em horários próprios: treinamentos às 3h, CA às 3h30, vida útil de EPI às 4h, ASO periódico às 4h30 e ativos às 5h. Todos reaproveitam um retrato das empresas em cache de 6 horas. Cada job resolve o destinatário — gestor do local da turma, gestor do setor cujos cargos usam aquele EPI, líder direto do colaborador com fallback para o setor e para a empresa — e grava item, destinatários e resultado do envio. Cada prazo gera um aviso antes do vencimento e outro no próprio dia, e a consulta ignora o que já foi avisado no dia.', en: 'A Go service separate from the API, with five jobs at their own times: training at 3:00, approval numbers at 3:30, PPE lifespan at 4:00, periodic exams at 4:30 and assets at 5:00. All reuse a snapshot of companies cached for 6 hours. Each job resolves the recipient — the class site manager, the manager of the sector whose roles use that PPE, the employee’s direct leader with fallback to the sector and the company — and stores the item, recipients and delivery result. Every deadline triggers one alert ahead of the due date and another on the day itself, and the query skips anything already alerted that day.' },
      stack: ['Go', 'robfig/cron', 'SMTP'],
    },
    {
      title: { pt: 'Painel de gestão', en: 'Management dashboard' },
      purpose: { pt: 'Dar à gestão de SST uma visão administrativa de colaboradores, EPIs, inspeções, treinamentos e permissões.', en: 'Give safety management an administrative view of employees, PPE, inspections, training and permits.' },
      mechanism: { pt: 'React 19, Vite e Tailwind. O menu nasce da sessão: o backend devolve os caminhos liberados para o papel a partir de um registro de 32 módulos de permissão, então mudar uma rota não exige reescrever perfis. Telas de alerta de CA, vida útil, ASO e treinamentos concentram as pendências, e os mesmos avisos chegam numa caixa de entrada com contador de não lidas.', en: 'React 19, Vite and Tailwind. The menu comes from the session: the backend returns the paths unlocked for the role from a registry of 32 permission modules, so changing a route never means rewriting profiles. Alert screens for approval numbers, lifespan, medical exams and training gather pending items, and the same alerts land in an inbox with an unread counter.' },
      stack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
    },
  ],
  decisions: [
    {
      title: { pt: 'Empresa vem da sessão, nunca do cliente', en: 'Company comes from the session, never the client' },
      rationale: { pt: 'O middleware carrega a empresa em cada requisição e toda consulta filtra por ela. Ao criar uma PT, APRs, técnico, trabalhadores e signatários são validados em lote contra a mesma empresa — nenhuma tela consegue misturar dados de outra, mesmo com um parâmetro manipulado.', en: 'The middleware loads the company on every request and every query filters by it. When a permit is created, risk assessments, technician, workers and signers are batch-validated against the same company — no screen can mix in another company’s data, even with a tampered parameter.' },
    },
    {
      title: { pt: 'NR é dado, não código', en: 'A standard is data, not code' },
      rationale: { pt: 'A norma é uma linha no catálogo, ligada a turmas, PTs e cargos por tabelas de relação. Atender uma NR nova, uma revisão ou uma exigência específica de obra vira cadastro, e a PT já mostra quais NRs cada trabalhador tem treinadas.', en: 'A standard is a row in the catalog, linked to classes, permits and roles through relation tables. Supporting a new standard, a revision or a site-specific requirement becomes data entry, and the permit already shows which standards each worker is trained on.' },
    },
    {
      title: { pt: 'Permissão por módulo, nível e plataforma', en: 'Permission by module, level and platform' },
      rationale: { pt: 'A mesma rota pode exigir permissões diferentes no web e no mobile: criar APR no painel pede um módulo de gestão, no celular pede o módulo de campo. Assim o técnico opera na obra sem ganhar acesso administrativo.', en: 'The same route can require different permissions on web and mobile: creating a risk assessment in the dashboard needs a management module, on the phone it needs the field module. The technician works on site without gaining admin access.' },
    },
    {
      title: { pt: 'Aviso registrado, não só disparado', en: 'Alerts recorded, not just fired' },
      rationale: { pt: 'Cada envio grava item, destinatários, origem do responsável e sucesso. Isso impede repetir a mesma notificação no dia e prova, na auditoria, que o responsável foi avisado a tempo.', en: 'Each delivery stores the item, recipients, where the owner came from and success. That prevents repeating the same notification on the same day and proves, at audit time, that the owner was warned in time.' },
    },
  ],
  tradeoffs: [
    { pt: 'Varredura noturna em vez de eventos em tempo real: mais simples de operar e de auditar, com uma latência de horas que o domínio aceita bem, já que os jobs terminam antes do turno.', en: 'A nightly sweep instead of real-time events: simpler to run and audit, with hours of latency the domain tolerates well, since the jobs finish before the shift.' },
    { pt: 'Scheduler como serviço separado: deploy e falha independentes da API, ao custo de manter as consultas alinhadas ao schema em dois repositórios.', en: 'The scheduler as a separate service: deploys and failures independent from the API, at the cost of keeping queries aligned with the schema in two codebases.' },
    { pt: 'Depender do serviço CA-EPI no cadastro exige tratar indisponibilidade: a consulta tem timeout de 30 segundos e devolve um erro claro em vez de travar a tela.', en: 'Depending on the CA-EPI service at registration means handling downtime: the lookup times out after 30 seconds and returns a clear error instead of freezing the screen.' },
  ],
  lessons: [
    { pt: 'Modelar norma, cargo e exigência como dados relacionados desde o início foi o que permitiu acompanhar cada NR sem uma fila de mudanças no código.', en: 'Modeling standard, role and requirement as related data from the start is what let the system follow each standard without a queue of code changes.' },
    { pt: 'Aviso útil é aviso que chega à pessoa certa, na hora certa e sem repetição. Resolver o destinatário pela hierarquia e registrar cada envio fez o técnico confiar no sistema em vez de silenciá-lo.', en: 'A useful alert reaches the right person at the right time, never repeated. Resolving the recipient through the hierarchy and recording every delivery made the technician trust the system instead of muting it.' },
    { pt: 'No campo, sessão expirada precisa ser um estado explícito da interface. Separar SESSION_EXPIRED dos outros 401 evitou formulários perdidos e assinaturas sem dono.', en: 'In the field, an expired session must be an explicit UI state. Telling SESSION_EXPIRED apart from other 401s prevented lost forms and orphaned signatures.' },
  ],
  architecture: {
    layers: [
      { id: 'interfaces', label: { pt: 'Interfaces', en: 'Interfaces' } },
      { id: 'regras', label: { pt: 'Regras de negócio', en: 'Business rules' } },
      { id: 'dados', label: { pt: 'Dados e fontes', en: 'Data and sources' } },
      { id: 'rotinas', label: { pt: 'Rotinas', en: 'Routines' } },
      { id: 'uso', label: { pt: 'Ação', en: 'Action' } },
    ],
    nodes: [
      { id: 'mobile', layer: 'interfaces', type: 'input', title: { pt: 'App de campo', en: 'Field app' }, technology: 'Expo / React Native', description: { pt: 'APR, PT, inspeções, advertências e assinaturas no canteiro.', en: 'Risk assessments, permits, inspections, warnings and signatures on site.' }, detail: { pt: '18 telas. APR em cinco etapas com matriz de risco 5 × 4, PT com equipe e signatários, checklist de inspeção e advertência com testemunhas e foto. Sessão no SecureStore, encerrada só por SESSION_EXPIRED.', en: '18 screens. Five-step risk assessment with a 5 × 4 risk matrix, permits with crew and signers, inspection checklists and warnings with witnesses and photos. Session in SecureStore, ended only by SESSION_EXPIRED.' } },
      { id: 'web', layer: 'interfaces', type: 'input', title: { pt: 'Painel de gestão', en: 'Management dashboard' }, technology: 'React / Vite', description: { pt: 'Colaboradores, cargos, turmas, EPIs, ativos e alertas.', en: 'Employees, roles, classes, PPE, assets and alerts.' }, detail: { pt: 'O menu vem da sessão, a partir de um registro de 32 módulos de permissão. Telas de alerta de CA, vida útil, ASO e treinamento concentram as pendências.', en: 'The menu comes from the session, out of a registry of 32 permission modules. Alert screens for approval numbers, lifespan, medical exams and training gather pending items.' } },
      { id: 'api', layer: 'regras', type: 'service', title: { pt: 'API multiempresa', en: 'Multi-tenant API' }, technology: 'Go / Fiber', description: { pt: '180 endpoints em 27 módulos de API, com empresa e usuário vindos da sessão.', en: '180 endpoints across 27 API modules, with company and user taken from the session.' }, detail: { pt: 'MFA, sessão de 1 hora com refresh de 30 dias, RBAC ver/interagir/gerenciar por módulo e plataforma, e auditoria em cada alteração.', en: 'MFA, 1-hour sessions with 30-day refresh, view/interact/manage RBAC per module and platform, and an audit trail on every change.' } },
      { id: 'treinamentos', layer: 'regras', type: 'service', title: { pt: 'Treinamentos e NRs', en: 'Training and standards' }, technology: 'Go', description: { pt: 'Turmas, presença, NRs cobertas e certificados por participante.', en: 'Classes, attendance, covered standards and per-participant certificates.' }, detail: { pt: 'Treinamento ou DDS, obrigatório, específico ou reciclagem. O certificado em PDF sai do próprio backend, com carga horária, instrutor e validade.', en: 'Training or safety talk, mandatory, specific or refresher. The PDF certificate comes out of the backend itself, with workload, instructor and expiry.' } },
      { id: 'seguranca', layer: 'regras', type: 'service', title: { pt: 'SST e saúde', en: 'Safety and health' }, technology: 'Go', description: { pt: 'APR, PT, inspeções, ASOs e adicionais por cargo.', en: 'Risk assessments, permits, inspections, medical exams and role allowances.' }, detail: { pt: 'Toda PT exige ao menos uma APR, equipe sem repetição e signatários da mesma empresa. Cada risco da APR precisa de frequência e severidade.', en: 'Every permit needs at least one risk assessment, a crew without duplicates and signers from the same company. Every risk needs a frequency and a severity.' } },
      { id: 'estoque', layer: 'regras', type: 'service', title: { pt: 'EPIs e estoque', en: 'PPE and inventory' }, technology: 'Go', description: { pt: 'Modelos com CA, unidades com série, entregas, devoluções e empréstimos.', en: 'Models with approval numbers, serialized units, handouts, returns and loans.' }, detail: { pt: 'Vida útil calculada por unidade a partir da data de compra. EPIs ligados aos cargos que os exigem. 38 endpoints.', en: 'Lifespan computed per unit from the purchase date. PPE linked to the roles that require it. 38 endpoints.' } },
      { id: 'arquivos', layer: 'dados', type: 'database', title: { pt: 'Certificados e evidências', en: 'Certificates and evidence' }, technology: 'AWS S3', description: { pt: 'PDFs de certificado e fotos de evidência.', en: 'Certificate PDFs and evidence photos.' }, detail: { pt: 'Um arquivo por turma e participante, pronto para baixar quando a fiscalização pedir.', en: 'One file per class and participant, ready to download when inspectors ask.' } },
      { id: 'banco', layer: 'dados', type: 'database', title: { pt: 'Base operacional', en: 'Operational database' }, technology: 'PostgreSQL', description: { pt: '78 tabelas em 6 schemas, todas com a empresa na chave.', en: '78 tables across 6 schemas, all keyed by company.' }, detail: { pt: 'core, hr, health, safety, stock e comms, versionados em 57 migrações. Alterações em colaborador e cargo ficam auditadas.', en: 'core, hr, health, safety, stock and comms, versioned in 57 migrations. Employee and role changes are audited.' } },
      { id: 'caepi', layer: 'dados', type: 'external', title: { pt: 'Serviço CA-EPI', en: 'CA-EPI service' }, technology: 'HTTP', description: { pt: 'Consulta oficial do certificado de aprovação de EPI.', en: 'Official PPE approval certificate lookup.' }, detail: { pt: 'Acionado pelo número do CA no cadastro do modelo, com timeout de 30 segundos. A validade retornada vira um prazo monitorado.', en: 'Queried by approval number when the model is registered, with a 30-second timeout. The returned expiry becomes a watched deadline.' } },
      { id: 'scheduler', layer: 'rotinas', type: 'service', title: { pt: 'Scheduler de vencimentos', en: 'Expiry scheduler' }, technology: 'Go / cron', description: { pt: 'Cinco rotinas por empresa, toda madrugada, entre 3h e 5h.', en: 'Five routines per company, every night, between 3 and 5 a.m.' }, detail: { pt: 'Treinamentos 3h, CA 3h30, vida útil de EPI 4h, ASO periódico 4h30, ativos 5h. Um retrato das empresas em cache de 6 horas serve todos os jobs.', en: 'Training 3:00, approval numbers 3:30, PPE lifespan 4:00, periodic exams 4:30, assets 5:00. A company snapshot cached for 6 hours serves every job.' } },
      { id: 'notificacoes', layer: 'rotinas', type: 'queue', title: { pt: 'Avisos', en: 'Alerts' }, technology: 'SMTP · inbox', description: { pt: 'Resolve o destinatário, envia e registra cada aviso.', en: 'Resolves the recipient, sends and records each alert.' }, detail: { pt: 'Líder direto, gestor do setor ou do local, com fallback para a empresa. O registro de envio evita repetição no dia e serve de prova em auditoria.', en: 'Direct leader, sector or site manager, with fallback to the company. The delivery record prevents same-day repeats and serves as audit evidence.' } },
      { id: 'gestao', layer: 'uso', type: 'output', title: { pt: 'Pendências e ações', en: 'Pending work and action' }, description: { pt: 'O responsável recebe o que vai vencer e o que vence no dia, e age antes de a equipe entrar em campo.', en: 'The owner gets what is about to expire and what expires that day, and acts before the crew goes out.' }, detail: { pt: 'Reciclagem agendada, exame marcado, EPI trocado — a pendência some quando o novo registro entra.', en: 'Refresher scheduled, exam booked, PPE replaced — the pending item clears when the new record comes in.' } },
    ],
    edges: [
      { from: 'mobile', to: 'api', payload: { pt: 'APR', en: 'Form' }, label: { pt: 'Campo', en: 'Field entries' } },
      { from: 'web', to: 'api', payload: { pt: 'JSON', en: 'JSON' }, label: { pt: 'Gestão', en: 'Management' } },
      { from: 'api', to: 'seguranca', payload: { pt: 'PT', en: 'Permit' }, label: { pt: 'APR e PT', en: 'Permits' } },
      { from: 'api', to: 'treinamentos', payload: { pt: 'Turma', en: 'Class' }, label: { pt: 'Turmas', en: 'Classes' } },
      { from: 'api', to: 'estoque', payload: { pt: 'EPI', en: 'PPE' }, label: { pt: 'EPIs e ativos', en: 'PPE, assets' } },
      { from: 'estoque', to: 'caepi', payload: { pt: 'CA', en: 'CA' }, kind: 'external', label: { pt: 'Consulta CA', en: 'CA lookup' } },
      { from: 'seguranca', to: 'banco', payload: { pt: 'Evento', en: 'Event' }, label: { pt: 'Persiste', en: 'Persists' } },
      { from: 'treinamentos', to: 'banco', payload: { pt: 'Certif', en: 'Cert' }, label: { pt: 'Presença', en: 'Attendance' } },
      { from: 'treinamentos', to: 'arquivos', payload: { pt: 'PDF', en: 'PDF' }, label: { pt: 'Certificado', en: 'Certificate' } },
      { from: 'estoque', to: 'banco', payload: { pt: 'EPI', en: 'PPE' }, label: { pt: 'Estoque', en: 'Stock' } },
      { from: 'banco', to: 'scheduler', payload: { pt: 'Prazo', en: 'Due' }, kind: 'async', label: { pt: 'Prazos', en: 'Due dates' } },
      { from: 'scheduler', to: 'notificacoes', payload: { pt: 'Aviso', en: 'Alert' }, kind: 'async', label: { pt: 'Pendências', en: 'Pending items' } },
      { from: 'notificacoes', to: 'gestao', payload: { pt: 'Email', en: 'Email' }, kind: 'async', label: { pt: 'Aviso', en: 'Alert' } },
    ],
  },
  walkthrough: [
    {
      id: 'turma',
      title: { pt: 'O treinamento acontece', en: 'The training happens' },
      text: { pt: 'Uma turma de NR-35, trabalho em altura, é registrada no painel com instrutor, carga horária, datas e participantes. A API grava a presença e as NRs cobertas dentro da empresa de quem fez o registro.', en: 'A working-at-height class (NR-35) is registered in the dashboard with instructor, workload, dates and participants. The API stores attendance and covered standards inside the company of whoever registered it.' },
      nodes: ['web', 'api', 'treinamentos'],
      edges: [['web', 'api'], ['api', 'treinamentos']],
    },
    {
      id: 'certificado',
      title: { pt: 'O certificado ganha validade', en: 'The certificate gets an expiry date' },
      text: { pt: 'Cada participante recebe um certificado em PDF, gerado no backend e guardado no S3, com data de vencimento. A partir daí o prazo existe como dado — não como lembrete na cabeça de alguém.', en: 'Each participant gets a PDF certificate, generated in the backend and stored in S3, with an expiry date. From then on, the deadline exists as data — not as a reminder in someone’s head.' },
      nodes: ['treinamentos', 'banco', 'arquivos'],
      edges: [['treinamentos', 'banco'], ['treinamentos', 'arquivos']],
    },
    {
      id: 'campo',
      title: { pt: 'A PT sai no canteiro', en: 'The permit is issued on site' },
      text: { pt: 'Na obra, o técnico abre uma PT de trabalho em altura no celular, vincula a APR, monta a equipe e colhe as assinaturas. A API confere que APR, trabalhadores e signatários são da mesma empresa e mostra as NRs treinadas de cada um.', en: 'On site, the technician opens a work-at-height permit on the phone, links the risk assessment, builds the crew and collects signatures. The API checks that assessment, workers and signers belong to the same company and shows each worker’s trained standards.' },
      nodes: ['mobile', 'api', 'seguranca', 'banco'],
      edges: [['mobile', 'api'], ['api', 'seguranca'], ['seguranca', 'banco']],
      metric: { pt: 'Nenhuma PT sem APR vinculada', en: 'No permit without a linked assessment' },
    },
    {
      id: 'varredura',
      title: { pt: 'A varredura da madrugada encontra', en: 'The night sweep finds it' },
      text: { pt: 'Meses depois, antes de o certificado de um encarregado vencer, o job de treinamentos percorre aquela empresa e encontra a turma; na madrugada do vencimento, encontra de novo — sempre antes de a equipe chegar para o turno.', en: 'Months later, before a foreman’s certificate expires, the training job walks through that company and finds the class; on the night it expires, it finds it again — always before the crew arrives for the shift.' },
      nodes: ['banco', 'scheduler'],
      edges: [['banco', 'scheduler']],
      metric: { pt: 'Job de treinamentos às 3h', en: 'Training job at 3 a.m.' },
    },
    {
      id: 'aviso',
      title: { pt: 'Um aviso, para a pessoa certa', en: 'One alert, to the right person' },
      text: { pt: 'O scheduler resolve o gestor do local da turma, envia o email e registra item, destinatário e resultado. Se a rotina rodar de novo no mesmo dia, ninguém recebe a mesma mensagem duas vezes.', en: 'The scheduler resolves the class site manager, sends the email and records the item, recipient and result. If the routine runs again that day, nobody gets the same message twice.' },
      nodes: ['scheduler', 'notificacoes'],
      edges: [['scheduler', 'notificacoes']],
      metric: { pt: '1 aviso por item a cada dia', en: '1 alert per item per day' },
    },
    {
      id: 'acao',
      title: { pt: 'A reciclagem é agendada', en: 'The refresher is scheduled' },
      text: { pt: 'O gestor agenda a reciclagem e, se ela não sair antes do prazo, tira o encarregado da frente em altura. Quando a nova turma entra, a pendência some — e o registro do aviso continua lá para a próxima auditoria.', en: 'The manager schedules the refresher and, if it can’t happen before the deadline, pulls the foreman off work at height. When the new class is recorded, the pending item clears — and the alert record stays there for the next audit.' },
      nodes: ['notificacoes', 'gestao'],
      edges: [['notificacoes', 'gestao']],
    },
  ],
  confidentiality: 'pending',
};
