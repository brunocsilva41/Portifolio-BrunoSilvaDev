// Definição editorial do case gymos. Normalizada em ../case-view-model.js.
// Cliente confidencial: academia de bairro em São José dos Campos, 2 unidades. Nunca citar o nome.
export default {
  slug: 'gymos',
  aliases: ['gestao-academia'],
  order: 4,
  accent: 'fitness',
  title: { pt: 'GymOS', en: 'GymOS' },
  category: 'academias',
  domains: ['gestao-de-alunos', 'cobranca-recorrente', 'multiunidade'],
  pitch: {
    pt: 'Matrícula, mensalidade e check-in de duas unidades num só sistema.',
    en: 'Enrollment, billing and check-in for two gyms in a single system.',
  },
  summary: {
    pt: 'Sistema de gestão que concebi e construí sozinho para uma academia de bairro com duas unidades: cadastro do aluno, planos, cobrança recorrente, check-in, aulas, treinos e indicadores em um só lugar. A recepção para de conferir caderno e planilha, e a inadimplência passa a ser tratada no dia em que acontece.',
    en: 'A management system I designed and built on my own for a neighborhood gym with two locations: member records, plans, recurring billing, check-in, classes, workouts and KPIs in one place. The front desk stops checking notebooks and spreadsheets, and late payments are handled the day they happen.',
  },
  client: {
    pt: 'Academia de bairro em São José dos Campos · 2 unidades',
    en: 'Neighborhood gym in São José dos Campos, Brazil · 2 locations',
  },
  period: { pt: '2026', en: '2026' },
  team: { pt: 'Projeto solo · do discovery à implantação', en: 'Solo project · from discovery to rollout' },
  roleTitle: {
    pt: 'Engenheiro full stack · projeto sob medida de ponta a ponta',
    en: 'Full stack engineer · custom build, end to end',
  },
  context: {
    pt: 'Projeto sob medida · academia de bairro com 2 unidades, 500+ alunos e 30 professores',
    en: 'Custom project · neighborhood gym with 2 locations, 500+ members and 30 instructors',
  },
  businessContext: {
    pt: 'A academia atende mais de 500 alunos em duas unidades no mesmo bairro, com 30 professores revezando turnos e turmas. Até então, a operação rodava em fichas de papel, planilhas por unidade e mensalidade cobrada no balcão. A recepção conferia o nome do aluno num caderno, ninguém sabia com segurança quem estava em dia, quem podia treinar na outra unidade ou quando um plano vencia, e a inadimplência só aparecia no fechamento do mês, quando já era difícil recuperar.',
    en: 'The gym serves more than 500 members across two locations in the same neighborhood, with 30 instructors rotating shifts and classes. Until then, operations ran on paper forms, one spreadsheet per location and fees collected at the front desk. Staff checked the member’s name in a notebook, nobody knew for sure who was up to date, who could train at the other location or when a plan expired, and late payments only surfaced at month-end close, when they were already hard to recover.',
  },
  problem: {
    pt: 'O dono não queria um software genérico de prateleira: queria que o sistema seguisse as regras da casa. Isso significava controlar acesso por plano e por unidade, cobrar todo mês sem depender de alguém lembrando, bloquear e liberar o aluno conforme o pagamento e dar aos professores a agenda e a lista de alunos sem expor o financeiro. Tudo isso para uma equipe que nunca tinha usado sistema nenhum.',
    en: 'The owner did not want generic off-the-shelf software: he wanted the system to follow the house rules. That meant controlling access by plan and by location, charging every month without depending on someone’s memory, blocking and releasing members according to payment and giving instructors their schedule and student list without exposing the finances. All of it for a team that had never used any system before.',
  },
  challengePoints: [
    {
      title: { pt: 'Duas unidades, uma operação', en: 'Two locations, one operation' },
      text: {
        pt: 'Cada unidade tem horários, capacidade e equipe próprios, mas o aluno é um só. Há planos que valem para uma unidade e planos que valem para as duas, e o gerente de cada casa só deve enxergar a sua.',
        en: 'Each location has its own hours, capacity and staff, but the member is one. Some plans are valid at one location and others at both, and each location’s manager should only see their own.',
      },
    },
    {
      title: { pt: 'Inadimplência descoberta tarde', en: 'Late payments found too late' },
      text: {
        pt: 'Sem cobrança recorrente, a mensalidade dependia do aluno lembrar e da recepção anotar. Quem atrasava continuava treinando por semanas até alguém perceber na planilha.',
        en: 'Without recurring billing, the monthly fee depended on the member remembering and the front desk writing it down. Members who fell behind kept training for weeks until someone noticed in the spreadsheet.',
      },
    },
    {
      title: { pt: 'Recepção como gargalo', en: 'The front desk as a bottleneck' },
      text: {
        pt: 'No horário de pico, a fila se formava na entrada: procurar a ficha, conferir o pagamento, perguntar o plano. A conferência manual atrasava o aluno e deixava passar quem não podia entrar.',
        en: 'At peak hours a line formed at the entrance: find the form, check the payment, ask about the plan. Manual checks slowed members down and still let in people who should not get in.',
      },
    },
  ],
  solution: {
    pt: 'Construí o GymOS como um monorepo com API em NestJS, painéis em Next.js e PostgreSQL via Prisma. Cada pessoa tem sua porta de entrada: recepção e gestão no painel da academia, professores no portal do instrutor, alunos na própria área com check-in, aulas, treinos e progresso. Por trás, uma regra única de acesso decide quem entra em cada unidade, e uma régua de cobrança recorrente cobra, tenta de novo, bloqueia e libera sozinha.',
    en: 'I built GymOS as a monorepo with a NestJS API, Next.js dashboards and PostgreSQL through Prisma. Each person has their own entry point: front desk and management in the gym dashboard, instructors in the instructor portal, members in their own area with check-in, classes, workouts and progress. Behind it, a single access rule decides who gets into each location, and a recurring billing flow charges, retries, blocks and releases on its own.',
  },
  deliverables: [
    {
      title: { pt: 'Cobrança recorrente com régua', en: 'Recurring billing with dunning' },
      text: {
        pt: 'Mensalidade gerada no vencimento, até 3 tentativas em 0, 3 e 7 dias e bloqueio automático de quem não pagou.',
        en: 'Monthly fee generated on the due date, up to 3 attempts at 0, 3 and 7 days and automatic blocking of unpaid members.',
      },
    },
    {
      title: { pt: 'Check-in com regra única', en: 'Check-in with a single rule' },
      text: {
        pt: 'Status, plano, congelamento, débitos, unidade e limite semanal conferidos em uma chamada, do app do aluno ou da recepção.',
        en: 'Status, plan, freeze, overdue bills, location and weekly limit checked in one call, from the member app or the front desk.',
      },
    },
    {
      title: { pt: 'Portal do professor e área do aluno', en: 'Instructor portal and member area' },
      text: {
        pt: 'Professores com agenda, turmas e presença; alunos com treinos, reservas de aula e evolução das medidas.',
        en: 'Instructors get schedule, classes and attendance; members get workouts, class bookings and body-measurement progress.',
      },
    },
    {
      title: { pt: 'Painel de gestão e BI', en: 'Management dashboard and BI' },
      text: {
        pt: 'Receita recorrente, churn, ticket médio, ocupação por horário, financeiro, PDV e estoque das duas unidades.',
        en: 'Recurring revenue, churn, average ticket, occupancy by hour, finance, point of sale and stock for both locations.',
      },
    },
  ],
  role: {
    pt: 'Fiz o GymOS sozinho, como projeto sob medida para o cliente. Comecei sentando com o dono e com a recepção para entender como a academia funcionava de verdade: planos, exceções, horários de pico, o que travava o dia a dia. A partir daí desenhei a arquitetura, modelei os dados, construí a API, os painéis e a área do aluno, coloquei em produção com Docker, treinei a equipe das duas unidades e sigo dando suporte e evoluindo o sistema com eles.',
    en: 'I built GymOS on my own as a custom project for the client. I started by sitting down with the owner and the front desk to understand how the gym really worked: plans, exceptions, peak hours, what slowed the day down. From there I designed the architecture, modeled the data, built the API, the dashboards and the member area, put it in production with Docker, trained the staff at both locations and keep supporting and evolving the system with them.',
  },
  responsibilities: [
    { pt: 'Conduzi o discovery com o dono e a recepção e transformei as regras da casa em requisitos.', en: 'Ran discovery with the owner and the front desk and turned the house rules into requirements.' },
    { pt: 'Modelei o domínio em PostgreSQL com Prisma: alunos, planos, assinaturas, pagamentos, faturas, check-ins, aulas e treinos.', en: 'Modeled the domain in PostgreSQL with Prisma: members, plans, subscriptions, payments, invoices, check-ins, classes and workouts.' },
    { pt: 'Construí a API modular em NestJS com JWT, cinco papéis de acesso e escopo por unidade.', en: 'Built the modular NestJS API with JWT, five access roles and per-location scoping.' },
    { pt: 'Implementei a cobrança recorrente, a régua de inadimplência e os webhooks assinados do gateway.', en: 'Implemented recurring billing, the dunning flow and the gateway’s signed webhooks.' },
    { pt: 'Desenvolvi os painéis em Next.js para gestão, professores e alunos, com indicadores em Recharts.', en: 'Developed the Next.js dashboards for management, instructors and members, with Recharts KPIs.' },
    { pt: 'Implantei com Docker, treinei a equipe das duas unidades e mantenho o suporte.', en: 'Deployed with Docker, trained the staff at both locations and provide ongoing support.' },
  ],
  outcome: {
    pt: 'Sistema em produção nas duas unidades, com mais de 500 alunos e 30 professores operando no mesmo lugar.',
    en: 'A production system at both locations, with more than 500 members and 30 instructors working in one place.',
  },
  preview: {
    summary: { pt: 'Matrícula, cobrança, check-in e treinos de duas unidades em um só sistema.', en: 'Enrollment, billing, check-in and workouts for two locations in a single system.' },
    problem: { pt: 'Papel, planilhas, fila na recepção e inadimplência descoberta tarde.', en: 'Paper, spreadsheets, front-desk lines and late payments found too late.' },
    role: { pt: 'Projeto solo: discovery, arquitetura, desenvolvimento, implantação e suporte.', en: 'Solo project: discovery, architecture, build, rollout and support.' },
    outcome: { pt: 'Mais de 500 alunos e 30 professores operando no GymOS.', en: 'More than 500 members and 30 instructors running on GymOS.' },
  },
  metrics: [
    {
      value: { pt: '500+', en: '500+' },
      label: { pt: 'alunos ativos gerenciados', en: 'active members managed' },
      context: { pt: 'duas unidades e 30 professores no mesmo sistema', en: 'two locations and 30 instructors in one system' },
      count: { to: 500, suffix: { pt: '+', en: '+' } },
      basis: 'confirmed',
    },
    {
      value: { pt: '40%', en: '40%' },
      label: { pt: 'menos inadimplência em seis meses', en: 'fewer late payments in six months' },
      context: { pt: 'cobrança recorrente com régua de tentativas', en: 'recurring billing with a retry schedule' },
      count: { to: 40, suffix: { pt: '%', en: '%' } },
      basis: 'confirmed',
    },
    {
      value: { pt: '3 s', en: '3 s' },
      label: { pt: 'para liberar a entrada do aluno', en: 'to clear a member at the entrance' },
      context: { pt: 'antes, conferência manual de ficha e pagamento', en: 'previously a manual form and payment check' },
      count: { to: 3, suffix: { pt: ' s', en: ' s' } },
      basis: 'confirmed',
    },
    {
      value: { pt: '12 h', en: '12 h' },
      label: { pt: 'por semana devolvidas à recepção', en: 'per week given back to the front desk' },
      context: { pt: 'sem planilha de cobrança nem caderno de entrada', en: 'no billing spreadsheet, no entry notebook' },
      count: { to: 12, suffix: { pt: ' h', en: ' h' } },
      basis: 'confirmed',
    },
  ],
  impact: [
    { pt: 'A inadimplência deixou de ser descoberta no fechamento: quem não paga é avisado, cobrado de novo em 3 e 7 dias e bloqueado na entrada até regularizar.', en: 'Late payments are no longer found at month-end: members who do not pay are notified, charged again at 3 and 7 days and blocked at the entrance until they settle.' },
    { pt: 'O check-in na recepção caiu de cerca de 1 minuto para poucos segundos, e a fila do horário de pico acabou.', en: 'Front-desk check-in dropped from about 1 minute to a few seconds, and the peak-hour line disappeared.' },
    { pt: 'O dono acompanha receita recorrente, churn e ocupação das duas unidades em tempo real, sem montar planilha.', en: 'The owner follows recurring revenue, churn and occupancy for both locations in real time, without building spreadsheets.' },
    { pt: 'Os 30 professores passaram a ver agenda, turmas e alunos no próprio portal, e a troca de horários saiu do grupo de mensagens.', en: 'All 30 instructors now see their schedule, classes and students in their own portal, and shift swaps left the group chat.' },
  ],
  technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'NestJS', 'Prisma', 'PostgreSQL', 'Redis', 'BullMQ', 'Socket.IO', 'Docker', 'Playwright'],
  stackGroups: [
    { label: { pt: 'Interface', en: 'Interface' }, items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
    { label: { pt: 'Backend', en: 'Backend' }, items: ['NestJS', 'Node.js', 'Prisma', 'Zod', 'JWT'] },
    { label: { pt: 'Dados e filas', en: 'Data and queues' }, items: ['PostgreSQL', 'Redis', 'BullMQ', 'Socket.IO'] },
    { label: { pt: 'Infra e qualidade', en: 'Infra and quality' }, items: ['Docker', 'Docker Compose', 'Jest', 'Playwright', 'Swagger'] },
  ],
  components: [
    {
      title: { pt: 'Ficha completa do aluno', en: 'Complete member record' },
      purpose: { pt: 'Substituir a ficha de papel por um cadastro que acompanha o aluno do primeiro dia à renovação.', en: 'Replace the paper form with a record that follows the member from day one to renewal.' },
      mechanism: { pt: 'A matrícula reúne CPF, contato, contato de emergência, endereço preenchido pelo CEP via ViaCEP, questionário PAR-Q e observações de saúde. Avaliações físicas guardam peso, percentual de gordura e perímetros; anexos guardam foto e contrato. Toda mudança de status fica no histórico, e o aluno recebe um link para ativar a própria conta.', en: 'Enrollment brings together tax ID, contact, emergency contact, an address filled in from the postal code via ViaCEP, the PAR-Q questionnaire and health notes. Physical assessments store weight, body fat and measurements; attachments store photo and contract. Every status change is kept in history, and the member gets a link to activate their own account.' },
      stack: ['NestJS', 'Prisma', 'PostgreSQL', 'ViaCEP'],
    },
    {
      title: { pt: 'Planos e assinaturas', en: 'Plans and subscriptions' },
      purpose: { pt: 'Traduzir os planos da academia em regras que o sistema aplica sozinho.', en: 'Turn the gym’s plans into rules the system enforces on its own.' },
      mechanism: { pt: 'Cada plano define preço, ciclo mensal, trimestral ou anual, taxa de matrícula, limite de acessos por semana e se vale para uma unidade ou para as duas. A assinatura pode ser congelada, cancelada com motivo ou expirada, gera o contrato do aluno e alimenta o relatório de adesões contra cancelamentos.', en: 'Each plan defines price, monthly, quarterly or yearly cycle, enrollment fee, weekly access limit and whether it covers one location or both. A subscription can be frozen, cancelled with a reason or expired, generates the member’s contract and feeds the sign-ups versus cancellations report.' },
      stack: ['NestJS', 'Prisma', 'Next.js'],
    },
    {
      title: { pt: 'Cobrança recorrente e régua de inadimplência', en: 'Recurring billing and dunning' },
      purpose: { pt: 'Cobrar todo mês sem depender de ninguém lembrar, e agir no mesmo dia em que o pagamento falha.', en: 'Charge every month without relying on anyone’s memory, and act the same day a payment fails.' },
      mechanism: { pt: 'O processo de cobrança encontra as assinaturas que vencem, gera o pagamento uma única vez por vencimento e faz até três tentativas, em 0, 3 e 7 dias. Cada tentativa e cada evento ficam registrados. Esgotadas as tentativas, a assinatura vira inadimplente e o aluno é suspenso; quando o pagamento entra, o próximo vencimento é calculado e o acesso volta na hora.', en: 'The billing process finds subscriptions coming due, creates the payment once per due date and makes up to three attempts, at 0, 3 and 7 days. Every attempt and event is recorded. Once attempts run out, the subscription goes past due and the member is suspended; when payment comes in, the next due date is calculated and access returns immediately.' },
      stack: ['NestJS', 'Prisma', 'PostgreSQL'],
    },
    {
      title: { pt: 'Gateway de pagamento por adaptador', en: 'Payment gateway behind an adapter' },
      purpose: { pt: 'Receber a confirmação de pagamento com segurança e sem nunca processar o mesmo evento duas vezes.', en: 'Receive payment confirmations securely and never process the same event twice.' },
      mechanism: { pt: 'O gateway fica atrás de uma interface única, com adaptador para Stripe e um adaptador de testes. Todo webhook tem a assinatura HMAC SHA-256 conferida em comparação de tempo constante, e o identificador do evento é único no banco: se o gateway reenviar, o evento duplicado é descartado sem efeito colateral.', en: 'The gateway sits behind a single interface, with a Stripe adapter and a test adapter. Every webhook has its HMAC SHA-256 signature checked with a constant-time comparison, and the event ID is unique in the database: if the gateway resends, the duplicate is dropped with no side effects.' },
      stack: ['NestJS', 'Stripe', 'HMAC'],
    },
    {
      title: { pt: 'Controle de acesso nas unidades', en: 'Access control at each location' },
      purpose: { pt: 'Decidir em segundos, e sempre do mesmo jeito, se o aluno pode entrar naquela unidade.', en: 'Decide in seconds, and always the same way, whether a member can enter that location.' },
      mechanism: { pt: 'Uma única validação confere status do aluno, assinatura ativa, congelamento, pagamentos e faturas vencidas, unidade permitida pelo plano e limite semanal de acessos, e impede check-in duplicado no mesmo dia. A mesma regra atende o app do aluno, a recepção e um endpoint de integração pronto para catraca.', en: 'A single validation checks member status, active subscription, freeze, overdue payments and invoices, the location allowed by the plan and the weekly access limit, and blocks duplicate check-ins on the same day. The same rule serves the member app, the front desk and an integration endpoint ready for a turnstile.' },
      stack: ['NestJS', 'Prisma', 'Next.js'],
    },
    {
      title: { pt: 'Aulas, treinos e portal do professor', en: 'Classes, workouts and instructor portal' },
      purpose: { pt: 'Organizar a rotina dos 30 professores e dar ao aluno o treino e a agenda no celular.', en: 'Organize the routine of 30 instructors and put workouts and schedule on the member’s phone.' },
      mechanism: { pt: 'Aulas têm unidade, professor, dia, horário e capacidade; a reserva respeita as vagas e passa por reservada, check-in, presente, falta ou cancelada. O professor vê a própria agenda e seus alunos e marca presença. Treinos reúnem exercícios com séries, repetições, descanso e vídeo, e o aluno acompanha a evolução das medidas na própria área.', en: 'Classes have a location, instructor, day, time and capacity; bookings respect available spots and move through booked, checked in, present, no-show or cancelled. Instructors see their own schedule and students and mark attendance. Workouts bundle exercises with sets, reps, rest and video, and members track their measurements in their own area.' },
      stack: ['Next.js', 'NestJS', 'Prisma'],
    },
  ],
  decisions: [
    {
      title: { pt: 'Uma base, duas unidades', en: 'One database, two locations' },
      rationale: { pt: 'Em vez de um sistema por unidade, cada registro carrega a academia e a unidade, e o gerente só enxerga a sua. O aluno continua sendo um só, o plano decide onde ele treina e o dono vê as duas casas juntas. Abrir uma terceira unidade vira cadastro, não projeto.', en: 'Instead of one system per location, every record carries the gym and the location, and each manager only sees their own. The member stays one person, the plan decides where they train and the owner sees both locations together. Opening a third location becomes a form, not a project.' },
    },
    {
      title: { pt: 'A regra de acesso mora em um lugar só', en: 'The access rule lives in one place' },
      rationale: { pt: 'App do aluno, recepção e catraca chamam a mesma validação. Assim não existe "na recepção passa, no app não": qualquer ajuste de regra vale para todas as portas de entrada ao mesmo tempo.', en: 'Member app, front desk and turnstile all call the same validation. There is no "it works at the desk but not in the app": any rule change applies to every entry point at once.' },
    },
    {
      title: { pt: 'Inadimplência resolvida pela régua, não por pessoas', en: 'Late payments handled by the schedule, not by people' },
      rationale: { pt: 'Escolhi três tentativas espaçadas em 0, 3 e 7 dias, com suspensão automática no fim e reativação automática no pagamento. A recepção deixa de ter a conversa difícil no balcão e o aluno sabe exatamente o que acontece se atrasar.', en: 'I chose three attempts spaced at 0, 3 and 7 days, with automatic suspension at the end and automatic reactivation on payment. The front desk no longer has the awkward conversation at the counter, and members know exactly what happens if they fall behind.' },
    },
    {
      title: { pt: 'Gateway atrás de um adaptador', en: 'Gateway behind an adapter' },
      rationale: { pt: 'A cobrança fala com uma interface, não com um fornecedor. Trocar de gateway ou testar o fluxo inteiro sem cobrar ninguém é questão de configuração, e os webhooks assinados e idempotentes protegem o financeiro de reenvios e requisições forjadas.', en: 'Billing talks to an interface, not to a vendor. Switching gateways or testing the whole flow without charging anyone is a matter of configuration, and signed, idempotent webhooks protect the books from resends and forged requests.' },
    },
  ],
  tradeoffs: [
    { pt: 'Bloquear automaticamente é o que acabou com a inadimplência silenciosa, mas a academia de bairro vive de exceções. Por isso a gestão pode suspender e reativar manualmente, sempre com motivo registrado no histórico.', en: 'Automatic blocking is what ended silent late payments, but a neighborhood gym lives on exceptions. So management can suspend and reactivate manually, always with a reason recorded in the history.' },
    { pt: 'Optei por um monólito modular em NestJS em vez de serviços separados. Para um projeto solo com duas unidades, isso significa um deploy, um banco e manutenção simples; filas entram só onde o trabalho é de fato assíncrono, como o envio de e-mails.', en: 'I chose a modular NestJS monolith over separate services. For a solo project with two locations, that means one deploy, one database and simple maintenance; queues are used only where work is truly asynchronous, such as sending email.' },
  ],
  lessons: [
    { pt: 'Em projeto sob medida, o discovery é metade do produto. As regras que mais importavam, como plano que vale para as duas unidades ou limite de acessos por semana, só apareceram conversando com a recepção no horário de pico.', en: 'In a custom project, discovery is half the product. The rules that mattered most, like plans valid at both locations or weekly access limits, only surfaced by talking to the front desk at peak hours.' },
    { pt: 'Implantar é também treinar. A adoção nas duas unidades veio quando cada perfil passou a ter uma tela pensada para o seu dia, e não um painel com tudo para todos.', en: 'Rolling out also means training. Adoption at both locations came when each role got a screen designed for their day, not one dashboard with everything for everyone.' },
    { pt: 'Dinheiro pede idempotência desde o primeiro dia. Tratar webhook repetido e cobrança duplicada como regra, e não como exceção, evitou qualquer lançamento em dobro no financeiro.', en: 'Money calls for idempotency from day one. Treating repeated webhooks and duplicate charges as the rule, not the exception, kept every entry in the books single.' },
  ],
  architecture: {
    layers: [
      { id: 'pessoas', label: { pt: 'Pessoas', en: 'People' } },
      { id: 'borda', label: { pt: 'API e segurança', en: 'API and security' } },
      { id: 'regras', label: { pt: 'Regras de negócio', en: 'Business rules' } },
      { id: 'dados', label: { pt: 'Dados e pagamentos', en: 'Data and payments' } },
      { id: 'externos', label: { pt: 'Comunicação', en: 'Messaging' } },
    ],
    nodes: [
      { id: 'recepcao', layer: 'pessoas', type: 'input', title: { pt: 'Recepção e gestão', en: 'Front desk and management' }, technology: 'Next.js', description: { pt: 'Painel da academia: matrícula, planos, financeiro, acessos e BI.', en: 'Gym dashboard: enrollment, plans, finance, access and BI.' }, detail: { pt: 'Onde a recepção matricula e acompanha os acessos do dia e o dono vê receita recorrente, churn, ticket médio e ocupação por horário das duas unidades. Também concentra PDV, estoque, CRM de interessados e equipe.', en: 'Where the front desk enrolls members and follows the day’s check-ins, and the owner sees recurring revenue, churn, average ticket and hourly occupancy for both locations. It also hosts point of sale, stock, the prospect CRM and staff.' } },
      { id: 'aluno', layer: 'pessoas', type: 'input', title: { pt: 'Área do aluno', en: 'Member area' }, technology: 'Next.js', description: { pt: 'Check-in, reservas de aula, treinos e evolução das medidas.', en: 'Check-in, class bookings, workouts and body-measurement progress.' }, detail: { pt: 'O aluno escolhe a unidade e faz o check-in pelo celular, reserva vaga nas aulas, vê o treino montado pelo professor e acompanha peso e percentual de gordura ao longo do tempo.', en: 'Members pick the location and check in from their phone, book class spots, see the workout their instructor built and track weight and body fat over time.' } },
      { id: 'instrutor', layer: 'pessoas', type: 'input', title: { pt: 'Portal do professor', en: 'Instructor portal' }, technology: 'Next.js', description: { pt: 'Agenda, turmas, alunos e presença de cada professor.', en: 'Each instructor’s schedule, classes, students and attendance.' }, detail: { pt: 'Cada um dos 30 professores vê só a sua agenda e os seus alunos, monta treinos e marca presença nas aulas, sem acesso ao financeiro.', en: 'Each of the 30 instructors sees only their own schedule and students, builds workouts and marks class attendance, with no access to finance.' } },
      { id: 'api', layer: 'borda', type: 'security', title: { pt: 'API GymOS', en: 'GymOS API' }, technology: 'NestJS · JWT', description: { pt: 'Autentica, aplica os cinco papéis e o escopo de unidade.', en: 'Authenticates and applies the five roles and location scope.' }, detail: { pt: 'Toda requisição passa por JWT, papéis de super admin, admin, gerente, professor e aluno, e pelo escopo da academia e da unidade. Validação com Zod, Helmet, limite de requisições e trilha de auditoria das operações.', en: 'Every request goes through JWT, super admin, admin, manager, instructor and member roles, and gym and location scope. Validation with Zod, Helmet, rate limiting and an audit trail of operations.' } },
      { id: 'acesso', layer: 'regras', type: 'service', title: { pt: 'Controle de acesso', en: 'Access control' }, technology: 'NestJS', description: { pt: 'Decide se o aluno pode entrar naquela unidade agora.', en: 'Decides whether the member can enter that location right now.' }, detail: { pt: 'Confere status, assinatura ativa, congelamento, débitos vencidos, unidade permitida pelo plano e limite semanal, e bloqueia check-in duplicado no dia. A mesma regra atende app, recepção e catraca.', en: 'Checks status, active subscription, freeze, overdue bills, the location allowed by the plan and the weekly limit, and blocks duplicate same-day check-ins. The same rule serves the app, the front desk and the turnstile.' } },
      { id: 'cobranca', layer: 'regras', type: 'service', title: { pt: 'Cobrança recorrente', en: 'Recurring billing' }, technology: 'NestJS', description: { pt: 'Gera a mensalidade, tenta de novo e bloqueia ou libera o aluno.', en: 'Creates the monthly fee, retries and blocks or releases the member.' }, detail: { pt: 'Encontra as assinaturas que vencem, cria o pagamento uma vez por vencimento e faz até três tentativas em 0, 3 e 7 dias. Sem pagamento, suspende; com pagamento, calcula o próximo vencimento e reativa.', en: 'Finds subscriptions coming due, creates the payment once per due date and makes up to three attempts at 0, 3 and 7 days. No payment means suspension; payment means the next due date is calculated and access is restored.' } },
      { id: 'agenda', layer: 'regras', type: 'service', title: { pt: 'Aulas e treinos', en: 'Classes and workouts' }, technology: 'NestJS', description: { pt: 'Turmas com capacidade, reservas, presença e fichas de treino.', en: 'Classes with capacity, bookings, attendance and workout plans.' }, detail: { pt: 'Cada aula tem unidade, professor, horário e vagas. A reserva respeita a capacidade e evolui até presença ou falta. Treinos reúnem exercícios com séries, repetições, descanso e vídeo.', en: 'Each class has a location, instructor, time and spots. Bookings respect capacity and move on to attendance or no-show. Workouts bundle exercises with sets, reps, rest and video.' } },
      { id: 'db', layer: 'dados', type: 'database', title: { pt: 'Base da academia', en: 'Gym database' }, technology: 'PostgreSQL · Prisma', description: { pt: 'Alunos, planos, assinaturas, pagamentos, check-ins e aulas.', en: 'Members, plans, subscriptions, payments, check-ins and classes.' }, detail: { pt: 'Fonte única da verdade das duas unidades. Cada pagamento guarda suas tentativas e eventos, cada aluno guarda seu histórico de status, e os indicadores de BI saem direto daqui.', en: 'Single source of truth for both locations. Every payment keeps its attempts and events, every member keeps their status history, and BI indicators come straight from here.' } },
      { id: 'fila', layer: 'externos', type: 'queue', title: { pt: 'Filas e tempo real', en: 'Queues and real time' }, technology: 'Redis · BullMQ · Socket.IO', description: { pt: 'Envio assíncrono de e-mails e notificações ao vivo.', en: 'Asynchronous email delivery and live notifications.' }, detail: { pt: 'E-mails entram em fila com até três tentativas e espera exponencial, sem travar a requisição. Avisos de vencimento e alertas chegam ao aluno e à equipe em tempo real pelo canal de notificações.', en: 'Emails are queued with up to three attempts and exponential backoff, without blocking the request. Due-date reminders and alerts reach members and staff in real time through the notification channel.' } },
      { id: 'gateway', layer: 'dados', type: 'external', title: { pt: 'Gateway de pagamento', en: 'Payment gateway' }, technology: 'Adaptador · Stripe', description: { pt: 'Processa a cobrança e devolve o resultado por webhook.', en: 'Processes the charge and returns the result by webhook.' }, detail: { pt: 'Fica atrás de uma interface única, então trocar de fornecedor é configuração. O retorno chega por webhook com assinatura HMAC conferida e evento único, para nunca contar o mesmo pagamento duas vezes.', en: 'It sits behind a single interface, so switching vendors is configuration. Results arrive by webhook with a verified HMAC signature and a unique event ID, so the same payment is never counted twice.' } },
      { id: 'email', layer: 'externos', type: 'output', title: { pt: 'E-mail', en: 'Email' }, technology: 'SMTP', description: { pt: 'Ativação de conta, segurança e avisos de cobrança.', en: 'Account activation, security and billing notices.' }, detail: { pt: 'Leva ao aluno o link de ativação da conta, a confirmação de troca de e-mail e senha e os avisos de vencimento e de pagamento pendente.', en: 'Delivers the account activation link, email and password change confirmations and due-date and pending-payment notices to the member.' } },
    ],
    edges: [
      { from: 'recepcao', to: 'api', payload: { pt: 'Aluno', en: 'Member' }, label: { pt: 'Matrícula e gestão', en: 'Enrollment' } },
      { from: 'aluno', to: 'api', payload: { pt: 'QR', en: 'QR' }, label: { pt: 'Check-in e reservas', en: 'Check-in and bookings' } },
      { from: 'instrutor', to: 'api', payload: { pt: 'Aula', en: 'Class' }, label: { pt: 'Agenda e presença', en: 'Attendance' } },
      { from: 'api', to: 'cobranca', payload: { pt: 'Plano', en: 'Plan' }, label: { pt: 'Ativa o plano', en: 'Activates the plan' } },
      { from: 'api', to: 'acesso', payload: { pt: 'Acesso', en: 'Access' }, label: { pt: 'Valida entrada', en: 'Validates entry' } },
      { from: 'api', to: 'agenda', payload: { pt: 'Vaga', en: 'Spot' }, label: { pt: 'Reserva e treino', en: 'Bookings' } },
      { from: 'acesso', to: 'db', payload: { pt: 'Visita', en: 'Visit' }, label: { pt: 'Registra check-in', en: 'Records check-in' } },
      { from: 'agenda', to: 'db', payload: { pt: 'Treino', en: 'Plan' }, label: { pt: 'Presença e treinos', en: 'Workouts' } },
      { from: 'cobranca', to: 'db', payload: { pt: 'Status', en: 'Status' }, label: { pt: 'Atualiza assinatura', en: 'Subscription' } },
      { from: 'cobranca', to: 'gateway', payload: { pt: 'Fatura', en: 'Charge' }, kind: 'external', label: { pt: 'Cobra mensalidade', en: 'Charges monthly fee' } },
      { from: 'cobranca', to: 'fila', payload: { pt: 'Aviso', en: 'Notice' }, kind: 'async', label: { pt: 'Enfileira aviso', en: 'Queues notice' } },
      { from: 'fila', to: 'email', payload: { pt: 'E-mail', en: 'Email' }, kind: 'async', label: { pt: 'Envia com retentativa', en: 'Retries' } },
    ],
  },
  walkthrough: [
    {
      id: 'matricula',
      title: { pt: 'O aluno se matricula', en: 'The member enrolls' },
      text: { pt: 'Na recepção, a atendente cadastra o novo aluno: CPF, contato, endereço preenchido pelo CEP e o questionário PAR-Q. Ela escolhe um plano mensal válido para as duas unidades, e o aluno recebe por e-mail o link para ativar a própria conta.', en: 'At the front desk, staff register the new member: tax ID, contact, an address filled in from the postal code and the PAR-Q questionnaire. They pick a monthly plan valid at both locations, and the member receives an email link to activate their own account.' },
      nodes: ['recepcao', 'api', 'cobranca', 'db'],
      edges: [['recepcao', 'api'], ['api', 'cobranca'], ['cobranca', 'db']],
      metric: { pt: 'Matrícula completa em menos de 5 minutos', en: 'Full enrollment in under 5 minutes' },
    },
    {
      id: 'cobranca',
      title: { pt: 'A primeira mensalidade', en: 'The first monthly fee' },
      text: { pt: 'No vencimento, a cobrança recorrente gera o pagamento e envia ao gateway. A confirmação volta por webhook assinado, a API confere a assinatura e o evento, e a assinatura fica ativa com o próximo vencimento já calculado.', en: 'On the due date, recurring billing creates the payment and sends it to the gateway. Confirmation comes back by signed webhook, the API checks the signature and the event, and the subscription stays active with the next due date already calculated.' },
      nodes: ['cobranca', 'gateway', 'db'],
      edges: [['cobranca', 'gateway'], ['cobranca', 'db']],
      metric: { pt: 'Cada evento do gateway é processado uma única vez', en: 'Each gateway event is processed exactly once' },
    },
    {
      id: 'checkin',
      title: { pt: 'Check-in na unidade', en: 'Check-in at the location' },
      text: { pt: 'Às 7h, o aluno chega à segunda unidade e faz o check-in pelo celular. Em uma única validação, o sistema confere status, plano, congelamento, débitos, unidade permitida e limite semanal, e registra a entrada.', en: 'At 7 a.m. the member arrives at the second location and checks in from their phone. In a single validation the system checks status, plan, freeze, overdue bills, allowed location and weekly limit, and records the entry.' },
      nodes: ['aluno', 'api', 'acesso', 'db'],
      edges: [['aluno', 'api'], ['api', 'acesso'], ['acesso', 'db']],
      metric: { pt: 'Entrada liberada em cerca de 3 segundos', en: 'Entry cleared in about 3 seconds' },
    },
    {
      id: 'treino',
      title: { pt: 'Treino e aula', en: 'Workout and class' },
      text: { pt: 'O professor vê o aluno na sua lista, monta a ficha com séries, repetições e vídeos e marca presença na aula de funcional que o aluno reservou pelo app, respeitando as vagas da turma.', en: 'The instructor sees the member on their list, builds the workout with sets, reps and videos and marks attendance in the functional class the member booked in the app, within the class capacity.' },
      nodes: ['instrutor', 'api', 'agenda', 'db'],
      edges: [['instrutor', 'api'], ['api', 'agenda'], ['agenda', 'db']],
    },
    {
      id: 'renovacao',
      title: { pt: 'Renovação ou bloqueio', en: 'Renewal or block' },
      text: { pt: 'No mês seguinte, o cartão é recusado. O aluno recebe o aviso por e-mail e no app, e a cobrança tenta de novo em 3 e 7 dias. Se não pagar, a assinatura fica inadimplente e a entrada é bloqueada; quando o pagamento entra, o acesso volta na hora.', en: 'The following month the card is declined. The member gets a notice by email and in the app, and billing tries again at 3 and 7 days. If they do not pay, the subscription goes past due and entry is blocked; once payment comes in, access returns immediately.' },
      nodes: ['cobranca', 'gateway', 'db', 'fila', 'email'],
      edges: [['cobranca', 'gateway'], ['cobranca', 'db'], ['cobranca', 'fila'], ['fila', 'email']],
      metric: { pt: '3 tentativas em 0, 3 e 7 dias', en: '3 attempts at 0, 3 and 7 days' },
    },
  ],
  confidentiality: 'pending',
};
