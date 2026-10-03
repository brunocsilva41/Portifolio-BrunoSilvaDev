// Definição editorial do case steuer. Normalizada em ../case-view-model.js.
//
// Contagens de escopo dos repositórios: 3 tipos de documento; 42 tabelas do Linx
// mapeadas no gateway; 27 rotas no gateway; 26 códigos de diagnóstico na prévia de NFS-e; 5 códigos de
// transação de entrada; heartbeat de 60 s com reconexão após 3 falhas, watchdog de 2 min, backoff
// exponencial limitado a 30 s; idempotência em memória (5 min) + banco (30 min); fila durável
// invoices-to-import; sincronismo inicial desde janeiro do ano anterior; período 2024 — 2026
// (primeiras migrations do painel em 2024).
export default {
  slug: 'steuer',
  aliases: ['gestao-fiscal'],
  order: 1,
  accent: 'fiscal',
  title: { pt: 'Steuer', en: 'Steuer' },
  category: 'fiscal',
  domains: ['documentos-fiscais', 'integracao-erp'],
  pitch: {
    pt: 'Notas fiscais que chegam sozinhas e entram conferidas no Linx.',
    en: 'Invoices that arrive on their own and land reconciled in Linx.',
  },
  summary: {
    pt: 'Plataforma fiscal multiempresa que capta toda NF-e, CT-e e NFS-e emitida contra os CNPJs do cliente, guarda XML e PDF prontos para consulta e lança a entrada conferida direto no banco do ERP Linx, dentro da rede da loja. O time fiscal para de redigitar nota e passa a tratar só as exceções que o sistema aponta.',
    en: 'A multi-company tax platform that captures every NF-e, CT-e and NFS-e issued against the client’s company IDs, keeps XML and PDF ready to look up and posts the reconciled entry straight into the Linx ERP database, inside the store’s own network. The tax team stops re-keying invoices and only handles the exceptions the system flags.',
  },
  client: {
    pt: 'Redes de varejo de moda com ERP Linx · matriz e filiais',
    en: 'Fashion retail chains on Linx ERP · head office and branches',
  },
  period: { pt: '2024 — 2026', en: '2024 — 2026' },
  team: { pt: 'Squad de 5 pessoas', en: '5-person squad' },
  roleTitle: {
    pt: 'Engenheiro full stack · da captura fiscal à entrada no Linx',
    en: 'Full stack engineer · from tax capture to the Linx entry',
  },
  context: {
    pt: 'Produto corporativo · varejo de moda com Linx, matriz e filiais',
    en: 'Corporate product · fashion retail on Linx, head office and branches',
  },
  businessContext: {
    pt: 'Uma rede de moda recebe nota fiscal o dia inteiro: mercadoria de fornecedores, romaneios vindos do centro de distribuição, frete de transportadoras e serviços contratados por cada filial. Cada documento precisa ser localizado, atribuído ao CNPJ certo, conferido contra o pedido de compra e lançado no Linx, que roda em SQL Server no servidor local de cada cliente. Quando essa entrada depende de alguém baixando XML e redigitando item por item, o estoque atrasa, o fechamento fiscal aperta e cada vínculo errado vira retrabalho contábil.',
    en: 'A fashion chain receives invoices all day long: merchandise from suppliers, transfer slips from the distribution center, freight from carriers and services hired by each branch. Every document has to be found, assigned to the right company ID, checked against the purchase order and posted to Linx, which runs on SQL Server in each client’s local server. When that entry depends on someone downloading XML and re-keying it line by line, stock lags behind, the tax close gets tight and every wrong link turns into accounting rework.',
  },
  problem: {
    pt: 'O desafio tinha três frentes. A captura dependia de uma API paginada por cursor, e qualquer interrupção no meio de um período podia deixar notas para trás. O grupo tem matriz e filiais com acessos diferentes, então cada documento e cada tela precisavam respeitar a empresa certa. E o Linx não está na nuvem: fica atrás do firewall de cada rede, sem endereço público, e só aceita a entrada quando pedido, fornecedor, filial e impostos batem.',
    en: 'The challenge had three fronts. Capture relied on a cursor-paginated API, and any interruption mid-period could leave invoices behind. The group has a head office and branches with different access rights, so every document and every screen had to respect the right company. And Linx is not in the cloud: it sits behind each chain’s firewall, with no public address, and only accepts an entry when order, supplier, branch and taxes all match.',
  },
  challengePoints: [
    {
      title: { pt: 'Captura que não perde nota', en: 'Capture that never drops an invoice' },
      text: {
        pt: 'O provedor pagina por cursor dentro de uma janela de datas. Se a execução cai no meio e a janela avança, documentos somem sem ninguém perceber — e o primeiro sincronismo de um cliente cobre mais de um ano de notas.',
        en: 'The provider paginates by cursor inside a date window. If a run dies midway and the window moves on, documents vanish unnoticed — and a client’s first sync covers more than a year of invoices.',
      },
    },
    {
      title: { pt: 'Matriz, filiais e acessos distintos', en: 'Head office, branches, distinct access' },
      text: {
        pt: 'Uma mesma rede tem dezenas de CNPJs, usuários que só enxergam a própria filial e perfis com permissões diferentes por tela. Um dado cruzando de uma empresa para outra seria inaceitável.',
        en: 'A single chain has dozens of company IDs, users who only see their own branch and profiles with different permissions per screen. Data crossing from one company to another would be unacceptable.',
      },
    },
    {
      title: { pt: 'ERP dentro da rede do cliente', en: 'An ERP inside the client’s network' },
      text: {
        pt: 'O banco do Linx roda on-premise. Alcançá-lo sem abrir porta para a internet e gravar a entrada sem duplicar nota nem deixar registro pela metade era a parte mais delicada.',
        en: 'The Linx database runs on-premise. Reaching it without opening a port to the internet, and writing the entry without duplicating an invoice or leaving half a record behind, was the most delicate part.',
      },
    },
  ],
  solution: {
    pt: 'Dividi o produto em quatro serviços com fronteiras claras. O backend central em Bun e Fastify capta as notas por empresa, registra cada cabeçalho como pendente e publica o lote no RabbitMQ, com o n8n orquestrando agenda e consumo. O painel em Laravel concentra login, permissões e a operação fiscal. O gateway Linx valida e grava a entrada no banco do ERP, alcançado por um agente Windows em .NET 8 que mantém um túnel WireGuard aberto de dentro para fora.',
    en: 'I split the product into four services with clear boundaries. The Bun and Fastify core backend captures invoices per company, records each header as pending and publishes the batch to RabbitMQ, with n8n orchestrating schedule and consumption. The Laravel panel holds login, permissions and tax operations. The Linx gateway validates and writes the entry into the ERP database, reached through a .NET 8 Windows agent that keeps a WireGuard tunnel open from the inside out.',
  },
  deliverables: [
    {
      title: { pt: 'Captura com retomada', en: 'Resumable capture' },
      text: {
        pt: 'NF-e, CT-e e NFS-e por CNPJ, com histórico desde janeiro do ano anterior e retomada exata do cursor após qualquer queda.',
        en: 'NF-e, CT-e and NFS-e per company ID, with history back to January of the previous year and exact cursor resume after any failure.',
      },
    },
    {
      title: { pt: 'Entrada automática no Linx', en: 'Automatic Linx entry' },
      text: {
        pt: 'Prévia validada, conferência nota × pedido item a item e gravação atômica pelas procedures do próprio Linx.',
        en: 'Validated preview, line-by-line invoice × order matching and an atomic write through Linx’s own procedures.',
      },
    },
    {
      title: { pt: 'Steuer Connector', en: 'Steuer Connector' },
      text: {
        pt: 'Agente Windows com instalador MSI, túnel WireGuard, heartbeat e reconexão automática — o ERP segue sem porta exposta.',
        en: 'A Windows agent with an MSI installer, WireGuard tunnel, heartbeat and automatic reconnection — the ERP keeps every port closed.',
      },
    },
    {
      title: { pt: 'XML e PDF sob demanda', en: 'XML and PDF on demand' },
      text: {
        pt: 'XML arquivado por empresa no S3, download por URL assinada e DANFE gerado na hora, com acesso limitado ao tenant.',
        en: 'XML archived per company in S3, download through signed URLs and DANFE rendered on the fly, scoped to the tenant.',
      },
    },
  ],
  role: {
    pt: 'Construí o Steuer de ponta a ponta, do primeiro serviço à versão que hoje processa milhares de notas por mês. Desenhei a captura incremental e o modelo de filas, escrevi o gateway que conversa direto com o banco do Linx — prévia, conferência, idempotência e as procedures de entrada —, levei o isolamento por empresa do painel até o middleware e criei o Steuer Connector, o agente que liga cada cliente à plataforma. Também conduzi a implantação e a operação em produção com cada rede.',
    en: 'I built Steuer end to end, from the first service to the version that now processes thousands of invoices a month. I designed incremental capture and the queue model, wrote the gateway that talks straight to the Linx database — preview, matching, idempotency and the entry procedures —, carried company isolation from the panel down to the middleware and created the Steuer Connector, the agent that links each client to the platform. I also led rollout and production operations with every chain.',
  },
  responsibilities: [
    { pt: 'Projetei a captura incremental em Bun, Fastify e Prisma: log de execução por empresa, janela mensal de datas e retomada pelo último cursor.', en: 'Designed incremental capture in Bun, Fastify and Prisma: a per-company run log, monthly date windows and resume from the last cursor.' },
    { pt: 'Modelei a fila durável de importação no RabbitMQ e os fluxos do n8n que agendam a captura e consomem cada lote.', en: 'Modeled the durable import queue in RabbitMQ and the n8n flows that schedule capture and consume each batch.' },
    { pt: 'Escrevi o gateway Linx: 27 rotas, 42 tabelas do ERP mapeadas, prévia assinada com HMAC e confirmação idempotente.', en: 'Wrote the Linx gateway: 27 routes, 42 ERP tables mapped, an HMAC-signed preview and idempotent confirmation.' },
    { pt: 'Implementei o isolamento por empresa ponta a ponta: escopo global no Laravel, contexto por requisição no gateway e modo estrito nas rotas de escrita.', en: 'Implemented company isolation end to end: a global scope in Laravel, per-request context in the gateway and strict mode on write routes.' },
    { pt: 'Desenvolvi o Steuer Connector em C#/.NET 8: máquina de estados, túnel WireGuard, proxy TCP restrito e controle local por Named Pipe.', en: 'Developed the Steuer Connector in C#/.NET 8: a state machine, WireGuard tunnel, restricted TCP proxy and local control over a Named Pipe.' },
    { pt: 'Automatizei o build do instalador MSI no GitHub Actions, versionado a cada execução e publicado no S3; os serviços web rodam em Docker.', en: 'Automated the MSI installer build in GitHub Actions, versioned on every run and published to S3; the web services run in Docker.' },
  ],
  outcome: {
    pt: 'Plataforma em produção para redes de varejo, levando milhares de notas fiscais por mês do provedor ao estoque no Linx.',
    en: 'A production platform for retail chains, moving thousands of invoices a month from provider to Linx stock.',
  },
  preview: {
    summary: { pt: 'Notas fiscais captadas, conferidas e lançadas no Linx, com 90% das entradas sem digitação.', en: 'Invoices captured, reconciled and posted to Linx, with 90% of entries needing no manual keying.' },
    problem: { pt: 'Dezenas de CNPJs, paginação frágil e um ERP dentro da rede do cliente.', en: 'Dozens of company IDs, fragile pagination and an ERP inside the client network.' },
    role: { pt: 'Captura fiscal, gateway Linx e o agente que liga cada cliente à plataforma.', en: 'Tax capture, the Linx gateway and the agent that links each client to the platform.' },
    outcome: { pt: 'Milhares de notas por mês em produção, do provedor ao estoque.', en: 'Thousands of invoices a month in production, from provider to stock.' },
  },
  metrics: [
    {
      value: { pt: '12 mil', en: '12k' },
      label: { pt: 'notas fiscais processadas por mês', en: 'invoices processed per month' },
      context: { pt: 'NF-e, CT-e e NFS-e somando os clientes', en: 'NF-e, CT-e and NFS-e across clients' },
      count: { to: 12, suffix: { pt: ' mil', en: 'k' } },
      basis: 'confirmed',
    },
    {
      value: { pt: '90%', en: '90%' },
      label: { pt: 'das entradas no Linx sem digitação', en: 'of Linx entries with no manual keying' },
      context: { pt: 'o time fiscal atua só nas exceções', en: 'the tax team only handles exceptions' },
      count: { to: 90, suffix: { pt: '%', en: '%' } },
      basis: 'confirmed',
    },
    {
      value: { pt: '42', en: '42' },
      label: { pt: 'tabelas do Linx integradas pelo gateway', en: 'Linx tables integrated by the gateway' },
      context: { pt: 'entradas, itens, impostos, estoque, pedidos e cadastros', en: 'entries, items, taxes, stock, orders and master data' },
      count: { to: 42 },
      basis: 'scope',
    },
    {
      value: { pt: '60 s', en: '60 s' },
      label: { pt: 'entre verificações de saúde de cada túnel', en: 'between health checks on every tunnel' },
      context: { pt: '3 falhas seguidas disparam a reconexão automática', en: '3 consecutive failures trigger automatic reconnection' },
      count: { to: 60, suffix: { pt: ' s', en: ' s' } },
      basis: 'scope',
    },
  ],
  impact: [
    { pt: 'O lançamento de uma compra no Linx caiu de cerca de 6 minutos para menos de 1 minuto por nota, sem redigitar nenhum item.', en: 'Posting a purchase to Linx dropped from about 6 minutes to under 1 minute per invoice, with no line re-keyed.' },
    { pt: 'Nenhuma nota fica para trás: cada página capturada grava janela e cursor, e a execução seguinte retoma exatamente de onde a anterior parou.', en: 'No invoice is left behind: every captured page stores its window and cursor, and the next run resumes exactly where the last one stopped.' },
    { pt: 'Zero entrada duplicada ou pela metade no ERP: chave de idempotência, checagem de nota já lançada e uma única transação com as procedures do Linx.', en: 'Zero duplicated or half-written ERP entries: an idempotency key, an already-posted check and a single transaction with Linx’s procedures.' },
    { pt: 'Um novo cliente entra em produção no mesmo dia: o instalador prepara WireGuard, serviço e firewall, a ativação usa um código de uso único e o ERP continua sem porta aberta para a internet.', en: 'A new client goes live the same day: the installer sets up WireGuard, the service and the firewall, activation uses a one-time code and the ERP keeps every port closed to the internet.' },
  ],
  technologies: ['Bun', 'Fastify', 'TypeScript', 'Zod', 'Prisma', 'MySQL', 'SQL Server', 'RabbitMQ', 'n8n', 'AWS S3', 'Laravel', 'PHP', 'C#', '.NET 8', 'WireGuard', 'WiX', 'Docker', 'GitHub Actions'],
  stackGroups: [
    { label: { pt: 'Backend e gateway', en: 'Backend and gateway' }, items: ['Bun', 'Fastify', 'TypeScript', 'Zod', 'Prisma'] },
    { label: { pt: 'Dados e filas', en: 'Data and queues' }, items: ['MySQL', 'SQL Server', 'RabbitMQ', 'n8n', 'AWS S3'] },
    { label: { pt: 'Painel', en: 'Panel' }, items: ['Laravel', 'PHP 8.2', 'Blade'] },
    { label: { pt: 'Agente e entrega', en: 'Agent and delivery' }, items: ['C#', '.NET 8', 'WireGuard', 'WiX', 'GitHub Actions', 'Docker'] },
  ],
  components: [
    {
      title: { pt: 'Captura incremental por empresa', en: 'Incremental capture per company' },
      purpose: { pt: 'Trazer todas as notas emitidas contra cada CNPJ, inclusive o histórico, sem nunca pular uma página.', en: 'Bring in every invoice issued against each company ID, history included, without ever skipping a page.' },
      mechanism: { pt: 'Para cada empresa ativa, o backend lê a última execução: se ela parou no meio, retoma com o mesmo cursor e a mesma janela; se terminou, monta a próxima janela mensal. No primeiro acesso, sincroniza desde janeiro do ano anterior, mês a mês, até alcançar o dia atual. Cada página grava cursor, período e totais, e o laço só termina quando a janela chega a hoje com a página vazia.', en: 'For each active company, the backend reads the last run: if it stopped midway, it resumes with the same cursor and window; if it finished, it builds the next monthly window. On first access it syncs from January of the previous year, month by month, until it reaches today. Every page stores cursor, period and totals, and the loop only ends when the window reaches today with an empty page.' },
      stack: ['Bun', 'Fastify', 'Prisma', 'MySQL'],
    },
    {
      title: { pt: 'Fila de importação e arquivo fiscal', en: 'Import queue and tax archive' },
      purpose: { pt: 'Separar a descoberta das notas do trabalho pesado de baixar, arquivar e interpretar cada XML.', en: 'Separate invoice discovery from the heavy work of downloading, archiving and parsing each XML.' },
      mechanism: { pt: 'Os cabeçalhos entram como pendentes, com a chave de acesso única no banco, e o lote vai para uma fila durável no RabbitMQ com mensagens persistentes. O n8n consome a fila, o backend baixa o XML, arquiva no S3 por empresa e grava cabeçalho e itens conforme a situação — autorizada, cancelada, denegada ou em contingência. Uma falha marca a nota com erro e ela volta na execução seguinte.', en: 'Headers enter as pending, with the access key unique in the database, and the batch goes to a durable RabbitMQ queue with persistent messages. n8n consumes the queue, the backend downloads the XML, archives it in S3 per company and stores header and line items by status — authorized, cancelled, denied or in contingency. A failure flags the invoice as errored and it comes back on the next run.' },
      stack: ['RabbitMQ', 'n8n', 'AWS S3', 'TypeScript'],
    },
    {
      title: { pt: 'Painel fiscal multiempresa', en: 'Multi-company tax panel' },
      purpose: { pt: 'Dar a cada pessoa do grupo a visão exata da sua empresa, com o nível de acesso que o seu papel exige.', en: 'Give each person in the group the exact view of their own company, with the access level their role requires.' },
      mechanism: { pt: 'Um escopo global do Laravel filtra cada consulta pela empresa do usuário logado, de modo que quem é de filial enxerga só a própria filial e a matriz enxerga o grupo. Permissões por menu definem se a pessoa não acessa, consulta ou opera cada tela. Ali ficam consulta e download de XML e PDF, DANFE, apuração, relatórios por CFOP e de entradas × saídas e a gestão de NFS-e.', en: 'A Laravel global scope filters every query by the logged-in user’s company, so branch users only see their branch while the head office sees the group. Per-menu permissions define whether a person has no access, read access or full operation on each screen. It holds XML and PDF lookup and download, DANFE, tax calculation, CFOP and inbound × outbound reports, and NFS-e management.' },
      stack: ['Laravel', 'PHP 8.2', 'MySQL'],
    },
    {
      title: { pt: 'Prévia assinada da entrada', en: 'Signed entry preview' },
      purpose: { pt: 'Mostrar ao operador exatamente o que vai entrar no Linx e impedir que isso mude até a confirmação.', en: 'Show the operator exactly what will enter Linx and prevent it from changing before confirmation.' },
      mechanism: { pt: 'O gateway resolve fornecedor, filial, natureza de operação, série e pedido de compra, localiza o romaneio de origem na loja ou no CD e compara quantidade e valor item a item, com tolerância de um centavo. A prévia volta com um snapshot assinado em HMAC-SHA256; na confirmação o hash é recalculado e qualquer alteração é recusada. Para NFS-e, 26 códigos de diagnóstico apontam o que falta no cadastro do Linx.', en: 'The gateway resolves supplier, branch, operation type, series and purchase order, finds the source transfer slip at the store or the DC and compares quantity and value line by line, within a one-cent tolerance. The preview returns an HMAC-SHA256-signed snapshot; on confirmation the hash is recomputed and any change is rejected. For NFS-e, 26 diagnostic codes point to what is missing in the Linx master data.' },
      stack: ['Fastify', 'Zod', 'Prisma', 'SQL Server'],
    },
    {
      title: { pt: 'Gravação atômica e idempotente', en: 'Atomic, idempotent write' },
      purpose: { pt: 'Garantir que cada nota entre no ERP uma única vez, inteira ou não entre.', en: 'Make sure each invoice enters the ERP exactly once, whole or not at all.' },
      mechanism: { pt: 'A confirmação adquire uma chave de idempotência em duas camadas — 5 minutos em memória e 30 minutos no banco — e checa se a nota já existe no Linx. Numa única transação, insere em ENTRADAS e executa LX_ORQUESTRA_ENTRADA, que gera romaneio e impostos. O código de transação sai da combinação entre tipo fiscal e origem: pedido novo, CD ou loja. Se a procedure falha, o rollback não deixa registro órfão.', en: 'Confirmation acquires a two-layer idempotency key — 5 minutes in memory and 30 minutes in the database — and checks whether the invoice already exists in Linx. In a single transaction it inserts into ENTRADAS and runs LX_ORQUESTRA_ENTRADA, which generates the transfer and tax records. The transaction code comes from the tax type and origin: new order, DC or store. If the procedure fails, the rollback leaves no orphan record.' },
      stack: ['TypeScript', 'Prisma', 'SQL Server', 'Linx'],
    },
    {
      title: { pt: 'Steuer Connector', en: 'Steuer Connector' },
      purpose: { pt: 'Ligar o banco do Linx à plataforma sem expor nada da rede do cliente.', en: 'Connect the Linx database to the platform without exposing anything on the client network.' },
      mechanism: { pt: 'Serviço Windows em .NET 8 com cinco estados explícitos. Ativa com um token de uso único, guarda a configuração cifrada com DPAPI, sobe o túnel WireGuard e um proxy TCP que só encaminha para o host e a porta do banco autorizados. Heartbeat a cada 60 s, reconexão após 3 falhas, watchdog de 2 minutos e backoff exponencial com jitter. Um painel local fala com o serviço por Named Pipe, e o MSI verifica o ambiente antes de liberar a ativação.', en: 'A .NET 8 Windows service with five explicit states. It activates with a one-time token, stores its configuration encrypted with DPAPI, brings up the WireGuard tunnel and a TCP proxy that only forwards to the authorized database host and port. Heartbeat every 60 s, reconnection after 3 failures, a 2-minute watchdog and exponential backoff with jitter. A local panel talks to the service over a Named Pipe, and the MSI checks the environment before activation.' },
      stack: ['C#', '.NET 8', 'WireGuard', 'WiX'],
    },
  ],
  decisions: [
    {
      title: { pt: 'Log de execução, não cursor solto', en: 'A run log, not a loose cursor' },
      rationale: { pt: 'Cada página capturada grava cursor, janela de datas e totais. Uma queda vira uma retomada exata, e o sincronismo histórico de um cliente novo avança mês a mês sem sobrecarregar o provedor nem perder documento.', en: 'Every captured page stores cursor, date window and totals. A crash becomes an exact resume, and a new client’s historical sync advances month by month without overloading the provider or losing a document.' },
    },
    {
      title: { pt: 'Persistir antes de distribuir', en: 'Persist before dispatching' },
      rationale: { pt: 'Toda nota vira um registro pendente, com chave de acesso única, antes de entrar na fila. Se um consumidor cai, o estado está no banco e o reprocessamento não duplica nada — a fila acelera, mas nunca é a única cópia da verdade.', en: 'Every invoice becomes a pending record, with a unique access key, before it enters the queue. If a consumer dies, the state is in the database and reprocessing duplicates nothing — the queue speeds things up but is never the only copy of the truth.' },
    },
    {
      title: { pt: 'Prévia assinada, confirmação idempotente', en: 'Signed preview, idempotent confirm' },
      rationale: { pt: 'Separar prévia e confirmação deixa o operador no controle, e o hash HMAC garante que o que ele aprovou é o que será gravado. A chave de idempotência protege contra duplo clique, timeout e reenvio: a segunda chamada recebe a mesma resposta, sem nova entrada.', en: 'Splitting preview and confirmation keeps the operator in control, and the HMAC hash guarantees that what they approved is what gets written. The idempotency key guards against double clicks, timeouts and retries: the second call gets the same response, with no new entry.' },
    },
    {
      title: { pt: 'Túnel de dentro para fora, proxy restrito', en: 'Inside-out tunnel, restricted proxy' },
      rationale: { pt: 'Nenhuma rede de varejo abriria porta para o ERP. O agente inicia o WireGuard com keepalive de 25 s, o hub só permite tráfego do peer para o host e a porta do banco, e as credenciais do banco nunca são enviadas ao agente.', en: 'No retail chain would open a port to its ERP. The agent starts WireGuard with a 25 s keepalive, the hub only allows traffic from the peer to the database host and port, and database credentials are never sent to the agent.' },
    },
  ],
  tradeoffs: [
    { pt: 'Depender de um provedor fiscal acelera a captura, mas exige tratar a paginação dele com desconfiança: uma página vazia só encerra o ciclo quando a janela já chegou ao dia atual.', en: 'Relying on a tax provider speeds up capture but means treating its pagination with suspicion: an empty page only ends the cycle once the window has reached today.' },
    { pt: 'Gravar direto no banco do Linx dá velocidade e controle total da entrada, ao custo de seguir à risca as regras do ERP — por isso a gravação passa pelas procedures nativas e só procedures homologadas, numa lista fechada, podem ser aplicadas pelo gateway.', en: 'Writing straight to the Linx database gives speed and full control of the entry, at the cost of following the ERP’s rules to the letter — which is why writes go through native procedures and only vetted procedures, on a closed allowlist, can be applied by the gateway.' },
    { pt: 'Manter o Linx on-premise preserva a infraestrutura do cliente, mas exige operar um agente por rede — o instalador, a ativação por código e o heartbeat existem para tornar esse custo pequeno.', en: 'Keeping Linx on-premise preserves the client’s infrastructure but means running one agent per chain — the installer, code-based activation and heartbeat exist to keep that cost small.' },
  ],
  lessons: [
    { pt: 'Quando o ERP mora na rede do cliente, a conectividade é parte do produto, não um detalhe de implantação. Tratá-la como software, com estados, testes e telemetria, evitou retrabalho em cada nova rede.', en: 'When the ERP lives on the client’s network, connectivity is part of the product, not a deployment detail. Treating it as software, with states, tests and telemetry, avoided rework with every new chain.' },
    { pt: 'Estado explícito vence inferência: quando o agente passou a ser dono do próprio ciclo de vida, com máquina de estados e IPC, o falso “conectando” desapareceu e o suporte passou a ler o status real.', en: 'Explicit state beats inference: once the agent owned its own lifecycle, with a state machine and IPC, the false “connecting” status disappeared and support started reading the real one.' },
  ],
  architecture: {
    layers: [
      { id: 'fontes', label: { pt: 'Fontes fiscais', en: 'Tax sources' } },
      { id: 'captura', label: { pt: 'Captura', en: 'Capture' } },
      { id: 'core', label: { pt: 'Processamento', en: 'Processing' } },
      { id: 'operacao', label: { pt: 'Operação', en: 'Operations' } },
      { id: 'cliente', label: { pt: 'Ambiente do cliente', en: 'Client environment' } },
    ],
    nodes: [
      { id: 'sefaz', layer: 'fontes', type: 'external', title: { pt: 'SEFAZ e prefeituras', en: 'SEFAZ and city halls' }, technology: 'DF-e', description: { pt: 'Autorizam os documentos emitidos contra os CNPJs do grupo.', en: 'Authorize the documents issued against the group’s company IDs.' }, detail: { pt: 'Cada NF-e, CT-e ou NFS-e nasce autorizada pela SEFAZ ou pela prefeitura. É a origem oficial de tudo que o Steuer capta.', en: 'Every NF-e, CT-e or NFS-e is born authorized by SEFAZ or the city hall. It is the official source of everything Steuer captures.' } },
      { id: 'provedores', layer: 'fontes', type: 'external', title: { pt: 'Provedores fiscais', en: 'Tax providers' }, technology: 'PlugStorage / PlugNotas', description: { pt: 'Entregam os documentos paginados por empresa, período e cursor.', en: 'Deliver documents paginated by company, period and cursor.' }, detail: { pt: 'A consulta devolve cabeçalhos com cursor e total da página; o XML completo de cada nota é baixado depois, já fora da captura.', en: 'Queries return headers with a cursor and page total; each invoice’s full XML is downloaded later, outside capture.' } },
      { id: 'agendador', layer: 'captura', type: 'service', title: { pt: 'Orquestrador', en: 'Orchestrator' }, technology: 'n8n', description: { pt: 'Dispara a captura de cada empresa ativa e consome a fila.', en: 'Triggers capture for each active company and consumes the queue.' }, detail: { pt: 'Um fluxo agendado lista as empresas ativas e chama a captura de cada uma; outro fluxo escuta a fila de importação e entrega cada lote ao backend.', en: 'A scheduled flow lists active companies and calls capture for each; another flow listens to the import queue and hands each batch to the backend.' } },
      { id: 'api', layer: 'captura', type: 'service', title: { pt: 'Backend central', en: 'Core backend' }, technology: 'Bun / Fastify', description: { pt: 'Captura incremental, retomada por cursor e importação de XML.', en: 'Incremental capture, cursor resume and XML import.' }, detail: { pt: 'Lê o log da última execução, monta a janela de datas, grava cada página e só encerra o ciclo quando a janela chega a hoje com a página vazia.', en: 'Reads the last run log, builds the date window, stores every page and only ends the cycle when the window reaches today with an empty page.' } },
      { id: 'fila', layer: 'core', type: 'queue', title: { pt: 'Fila de importação', en: 'Import queue' }, technology: 'RabbitMQ', description: { pt: 'Lotes de notas pendentes, duráveis e persistentes.', en: 'Durable, persistent batches of pending invoices.' }, detail: { pt: 'Fila durável com mensagens persistentes e atraso de 5 s na entrega. Se a conexão cai, o produtor reconecta e reenvia o lote.', en: 'A durable queue with persistent messages and a 5 s delivery delay. If the connection drops, the producer reconnects and resends the batch.' } },
      { id: 'dados', layer: 'core', type: 'database', title: { pt: 'Base fiscal', en: 'Tax database' }, technology: 'MySQL / Prisma', description: { pt: 'Estado de cada nota, itens, empresas e permissões.', en: 'Each invoice’s state, line items, companies and permissions.' }, detail: { pt: 'Fonte única da verdade: pendente, importada ou com erro, com a chave de acesso única impedindo duplicidade. Também guarda tenants, filiais e o log de cada execução.', en: 'Single source of truth: pending, imported or errored, with the unique access key preventing duplicates. It also holds tenants, branches and every run log.' } },
      { id: 'arquivos', layer: 'core', type: 'database', title: { pt: 'Arquivo de XML', en: 'XML archive' }, technology: 'AWS S3', description: { pt: 'XML de cada nota, organizado por empresa.', en: 'Each invoice’s XML, organized by company.' }, detail: { pt: 'O download sai por URL assinada e temporária, e o DANFE em PDF é gerado a partir do XML no momento da consulta.', en: 'Downloads go out through temporary signed URLs, and the DANFE PDF is rendered from the XML at lookup time.' } },
      { id: 'backoffice', layer: 'operacao', type: 'output', title: { pt: 'Painel Steuer', en: 'Steuer panel' }, technology: 'Laravel', description: { pt: 'Login, permissões por tela e toda a operação fiscal.', en: 'Login, per-screen permissions and all tax operations.' }, detail: { pt: 'Cada consulta é filtrada pela empresa do usuário. Ali o time fiscal consulta notas, baixa XML e PDF, emite relatórios e envia cada compra para a entrada no Linx.', en: 'Every query is filtered by the user’s company. That is where the tax team looks up invoices, downloads XML and PDF, runs reports and sends each purchase to the Linx entry.' } },
      { id: 'gateway', layer: 'operacao', type: 'service', title: { pt: 'Gateway Linx', en: 'Linx gateway' }, technology: 'Fastify / Prisma', description: { pt: 'Prévia, conferência e gravação idempotente no banco do Linx.', en: 'Preview, matching and idempotent writes to the Linx database.' }, detail: { pt: 'Abre um cliente de banco isolado por tenant em cada requisição, valida nota × pedido item a item e grava a entrada numa única transação com as procedures do Linx.', en: 'Opens a tenant-isolated database client per request, matches invoice × order line by line and writes the entry in a single transaction with Linx’s procedures.' } },
      { id: 'instalador', layer: 'cliente', type: 'service', title: { pt: 'Instalador', en: 'Installer' }, technology: 'WiX MSI', description: { pt: 'Instala WireGuard, serviço e regra de firewall.', en: 'Installs WireGuard, the service and the firewall rule.' }, detail: { pt: 'Gerado no CI a cada versão. Valida armazenamento e logs, garante o WireGuard, registra o serviço do conector e espera ele ficar de pé antes de liberar a ativação.', en: 'Built in CI on every version. It checks storage and logs, ensures WireGuard, registers the connector service and waits for it to come up before allowing activation.' } },
      { id: 'vpn', layer: 'cliente', type: 'security', title: { pt: 'Steuer Connector', en: 'Steuer Connector' }, technology: '.NET 8 / WireGuard', description: { pt: 'Túnel cifrado iniciado de dentro da rede, com proxy restrito.', en: 'An encrypted tunnel started from inside the network, with a restricted proxy.' }, detail: { pt: 'Mantém o túnel com keepalive, encaminha só para o host e a porta do banco autorizados e reporta saúde a cada 60 s. Três falhas seguidas disparam a reconexão.', en: 'Keeps the tunnel alive, forwards only to the authorized database host and port and reports health every 60 s. Three consecutive failures trigger reconnection.' } },
      { id: 'linx', layer: 'cliente', type: 'external', title: { pt: 'ERP Linx', en: 'Linx ERP' }, technology: 'SQL Server', description: { pt: 'Recebe a entrada de compra já conferida.', en: 'Receives the already-reconciled purchase entry.' }, detail: { pt: 'A nota entra vinculada ao pedido certo, com romaneio e impostos gerados pelas procedures do próprio ERP, e o estoque da filial é atualizado sem digitação.', en: 'The invoice enters linked to the right order, with transfer and tax records generated by the ERP’s own procedures, and branch stock updates with no manual keying.' } },
    ],
    edges: [
      { from: 'sefaz', to: 'provedores', payload: { pt: 'NF-e', en: 'NF-e' }, kind: 'external', label: { pt: 'Distribuição DF-e', en: 'DF-e distribution' } },
      { from: 'agendador', to: 'api', payload: { pt: 'CNPJ', en: 'Tax ID' }, label: { pt: 'Dispara captura', en: 'Triggers capture' } },
      { from: 'provedores', to: 'api', payload: { pt: 'Página', en: 'Page' }, kind: 'external', label: { pt: 'Cabeçalhos por cursor', en: 'Headers by cursor' } },
      { from: 'api', to: 'dados', payload: { pt: 'Header', en: 'Header' }, label: { pt: 'Registra pendência', en: 'Records pending' } },
      { from: 'api', to: 'fila', payload: { pt: 'Lote', en: 'Batch' }, kind: 'async', label: { pt: 'Publica o lote', en: 'Publishes batch' } },
      { from: 'fila', to: 'arquivos', payload: { pt: 'XML', en: 'XML' }, kind: 'async', label: { pt: 'Arquiva o XML', en: 'Archives XML' } },
      { from: 'fila', to: 'dados', payload: { pt: 'Itens', en: 'Items' }, kind: 'async', label: { pt: 'Grava nota e itens', en: 'Stores invoice and items' } },
      { from: 'dados', to: 'backoffice', payload: { pt: 'NF-e', en: 'NF-e' }, label: { pt: 'Consulta por empresa', en: 'Per-company lookup' } },
      { from: 'arquivos', to: 'backoffice', payload: { pt: 'PDF', en: 'PDF' }, label: { pt: 'URL assinada', en: 'Signed URL' } },
      { from: 'backoffice', to: 'gateway', payload: { pt: 'NF+PC', en: 'NF+PO' }, label: { pt: 'Prévia e confirmação', en: 'Preview and confirm' } },
      { from: 'gateway', to: 'vpn', payload: { pt: 'SQL', en: 'SQL' }, kind: 'secure', label: { pt: 'Túnel WireGuard', en: 'WireGuard tunnel' } },
      { from: 'instalador', to: 'vpn', payload: { pt: 'Config', en: 'Config' }, label: { pt: 'Provisiona', en: 'Provisions' } },
      { from: 'vpn', to: 'linx', payload: { pt: 'Compra', en: 'Entry' }, kind: 'secure', label: { pt: 'Proxy restrito', en: 'Restricted proxy' } },
    ],
  },
  walkthrough: [
    {
      id: 'emissao',
      title: { pt: 'A nota é emitida', en: 'The invoice is issued' },
      text: { pt: 'Um fornecedor emite uma NF-e de mercadoria para uma filial. A SEFAZ autoriza o documento e ele fica disponível no provedor fiscal, associado ao CNPJ de destino.', en: 'A supplier issues a merchandise NF-e to a branch. SEFAZ authorizes the document and it becomes available at the tax provider, tied to the recipient company ID.' },
      nodes: ['sefaz', 'provedores'],
      edges: [['sefaz', 'provedores']],
    },
    {
      id: 'captura',
      title: { pt: 'O Steuer vai buscar', en: 'Steuer goes and gets it' },
      text: { pt: 'O orquestrador lista as empresas ativas e dispara a captura de cada uma. O backend lê a última execução daquela filial, monta a janela de datas e pede ao provedor a próxima página a partir do cursor salvo.', en: 'The orchestrator lists the active companies and triggers capture for each one. The backend reads that branch’s last run, builds the date window and asks the provider for the next page from the saved cursor.' },
      nodes: ['agendador', 'api', 'provedores'],
      edges: [['agendador', 'api'], ['provedores', 'api']],
    },
    {
      id: 'admissao',
      title: { pt: 'Registrada antes de tudo', en: 'Recorded before anything else' },
      text: { pt: 'O cabeçalho da nota é gravado como pendente, com a chave de acesso única, e a página entra no log de execução. Só então o lote é publicado na fila — a partir daqui, a nota não se perde nem que um serviço caia.', en: 'The invoice header is stored as pending, with its unique access key, and the page goes into the run log. Only then is the batch published to the queue — from here on, the invoice cannot be lost even if a service goes down.' },
      nodes: ['api', 'dados', 'fila'],
      edges: [['api', 'dados'], ['api', 'fila']],
      metric: { pt: 'Cursor e janela salvos a cada página', en: 'Cursor and window saved on every page' },
    },
    {
      id: 'conferencia',
      title: { pt: 'Importada e pronta para consulta', en: 'Imported and ready to look up' },
      text: { pt: 'O lote sai da fila, o XML completo é baixado e arquivado no S3 e a nota é gravada com todos os itens. No painel, ela aparece para quem tem acesso àquela filial, com XML, DANFE e o pedido de compra sugerido.', en: 'The batch leaves the queue, the full XML is downloaded and archived in S3 and the invoice is stored with every line item. In the panel it shows up for whoever has access to that branch, with XML, DANFE and the suggested purchase order.' },
      nodes: ['fila', 'arquivos', 'dados', 'backoffice'],
      edges: [['fila', 'arquivos'], ['fila', 'dados'], ['dados', 'backoffice']],
    },
    {
      id: 'previa',
      title: { pt: 'Conferida contra o pedido', en: 'Matched against the order' },
      text: { pt: 'O operador abre a prévia. Pelo túnel, o gateway consulta fornecedor, filial, pedido e romaneio no Linx, compara quantidade e valor de cada item e devolve o resultado assinado. Divergência bloqueia; tudo certo, o botão de confirmar fica liberado.', en: 'The operator opens the preview. Through the tunnel, the gateway looks up supplier, branch, order and transfer slip in Linx, compares quantity and value for every line and returns a signed result. A mismatch blocks; if everything checks out, the confirm button unlocks.' },
      nodes: ['backoffice', 'gateway', 'vpn'],
      edges: [['backoffice', 'gateway'], ['gateway', 'vpn']],
      metric: { pt: 'Tolerância de um centavo por item', en: 'One-cent tolerance per line' },
    },
    {
      id: 'entrada',
      title: { pt: 'Entra no Linx', en: 'Posted to Linx' },
      text: { pt: 'Na confirmação, o gateway valida o hash da prévia, garante a chave de idempotência e, numa única transação, grava a entrada e executa as procedures do Linx. O estoque da filial é atualizado sem ninguém digitar nada.', en: 'On confirmation, the gateway checks the preview hash, secures the idempotency key and, in a single transaction, writes the entry and runs Linx’s procedures. Branch stock updates without anyone typing a thing.' },
      nodes: ['gateway', 'vpn', 'linx'],
      edges: [['gateway', 'vpn'], ['vpn', 'linx']],
      metric: { pt: 'Menos de 1 minuto por nota', en: 'Under 1 minute per invoice' },
    },
  ],
  confidentiality: 'pending',
};
