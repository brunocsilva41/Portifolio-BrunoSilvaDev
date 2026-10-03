// Definição editorial do case leadspector. Normalizada em ../case-view-model.js.
//
// Fatos do código dos repositórios do produto: ≈300 mil empresas pesquisáveis em segundos;
// 13 filtros combináveis na busca de leads; score de oportunidade 0–100 com 4 fatores (dor 40%, amplitude 25%,
// fit de porte 20%, confiança 15%); 3 frentes de análise; até 8 reclamações e 6 avaliações por frente, limiar de
// similaridade 0,2; chunks de até 1.000 caracteres com 1 sentença de sobreposição; embeddings nomic-embed-text no
// Ollama; /ask limitado a 30 perguntas/min com timeout de 75 s; sync PG → ES a cada 5 min com reconciliação completa;
// crawler Glassdoor com 3 workers, timeout de 30 s por página, até 100 avaliações por empresa; Reclame Aqui com até
// 10 reclamações por empresa; lote de insights com até 200 empresas; job em background com 10 workers e pausa a cada
// 1.500 empresas; funil com 5 status; backups PostgreSQL com retenção de 30 dias e snapshots diários do ES (7 dias).
export default {
  slug: 'leadspector',
  aliases: ['prospeccao-comercial'],
  order: 3,
  accent: 'ai',
  title: { pt: 'LeadSpector', en: 'LeadSpector' },
  category: 'inteligencia-comercial',
  domains: ['prospeccao', 'busca-empresarial'],
  pitch: {
    pt: 'De 300 mil CNPJs à abordagem certa, com a IA citando a fonte.',
    en: 'From 300,000 companies to the right pitch, with AI citing its sources.',
  },
  summary: {
    pt: 'Plataforma de prospecção que cruza a base da Receita Federal com reclamações do Reclame Aqui e avaliações do Glassdoor para mostrar onde cada empresa sofre e o que oferecer a ela. O vendedor filtra 300 mil empresas em segundos, abre um diagnóstico com score de oportunidade e sai com o email de abordagem pronto.',
    en: 'A prospecting platform that combines Brazil’s federal company registry with Reclame Aqui complaints and Glassdoor reviews to show where each company hurts and what to offer it. Sellers filter 300,000 companies in seconds, open a diagnosis with an opportunity score and leave with the outreach email ready.',
  },
  client: { pt: 'Software house B2B · time comercial interno', en: 'B2B software house · in-house sales team' },
  period: { pt: '2025 — 2026', en: '2025 — 2026' },
  team: { pt: 'Squad de 6 pessoas', en: '6-person squad' },
  roleTitle: {
    pt: 'Engenheiro full stack · frontend, RAG, insights e busca',
    en: 'Full stack engineer · frontend, RAG, insights and search',
  },
  context: {
    pt: 'Software house B2B · time comercial interno',
    en: 'B2B software house · in-house sales team',
  },
  businessContext: {
    pt: 'A software house vende modernização de sistemas, integração, dados e IA para empresas médias e grandes. O gargalo do time comercial não era fechar negócio: era chegar na conta certa com o argumento certo. Cada SDR montava listas na mão, pesquisava a empresa, lia reclamações de clientes e avaliações de funcionários atrás de sistema legado, processo manual ou instabilidade, e só então escrevia o primeiro email. Eram horas por conta, pouca cobertura de mercado e abordagens genéricas.',
    en: 'The software house sells system modernization, integration, data and AI to mid-sized and large companies. The sales team’s bottleneck was not closing deals: it was reaching the right account with the right argument. Each SDR built lists by hand, researched the company, read customer complaints and employee reviews looking for legacy systems, manual processes or instability, and only then wrote the first email. That meant hours per account, little market coverage and generic outreach.',
  },
  problem: {
    pt: 'Os sinais existem, mas estão em três lugares que não conversam: o cadastro oficial de CNPJs, em dumps brutos com milhões de linhas; o Reclame Aqui, com a dor do cliente final; e o Glassdoor, com a dor de quem opera os sistemas por dentro. Era preciso unir tudo pelo CNPJ, pesquisar centenas de milhares de empresas em segundos e transformar texto solto em oportunidade comercial, sem deixar a IA inventar um problema que a empresa não tem.',
    en: 'The signals exist, but they live in three places that do not talk to each other: the official company registry, in raw dumps with millions of rows; Reclame Aqui, with the end customer’s pain; and Glassdoor, with the pain of the people running the systems from the inside. Everything had to converge on the company ID, become searchable across hundreds of thousands of companies in seconds and turn loose text into sales opportunity, without letting the AI invent a problem the company does not have.',
  },
  challengePoints: [
    {
      title: { pt: 'Três fontes, três formatos', en: 'Three sources, three formats' },
      text: {
        pt: 'Dumps da Receita em lote, Reclame Aqui em HTML com JSON-LD e Glassdoor em GraphQL paginado. Cada fonte ganhou coletor próprio, ritmo próprio e status de coleta por CNPJ.',
        en: 'Registry dumps in batches, Reclame Aqui in HTML with JSON-LD and Glassdoor in paginated GraphQL. Each source got its own collector, its own pace and per-company collection status.',
      },
    },
    {
      title: { pt: 'Busca comercial em 300 mil empresas', en: 'Sales search across 300,000 companies' },
      text: {
        pt: 'O vendedor combina região, porte, CNAE, capital social, tempo de atividade e score de IA na mesma consulta, e a lista precisa chegar em segundos, já sem leads de outro SDR.',
        en: 'Sellers combine region, size, industry code, share capital, years in business and AI score in one query, and the list must arrive in seconds, already without other SDRs’ leads.',
      },
    },
    {
      title: { pt: 'IA que não pode inventar', en: 'AI that cannot make things up' },
      text: {
        pt: 'Um diagnóstico errado queima a conta. Toda evidência citada pelo modelo precisa existir no texto recuperado daquele CNPJ; o que não tem âncora é descartado antes de chegar à tela.',
        en: 'A wrong diagnosis burns the account. Every piece of evidence the model cites must exist in the text retrieved for that company; anything without an anchor is dropped before it reaches the screen.',
      },
    },
  ],
  solution: {
    pt: 'Dividi a plataforma em coleta, preparação, recuperação e uso. Um ETL em Spark limpa a base da Receita, um daemon mantém o Elasticsearch sincronizado com o PostgreSQL e crawlers em Go levam reclamações e avaliações para um grafo Neo4j com embeddings locais. Sobre esse grafo rodam o chat RAG e o motor de insights, que pontua cada empresa de 0 a 100. No topo, um workspace em React reúne busca, perfil, funil, agenda e emails.',
    en: 'I split the platform into collection, preparation, retrieval and use. A Spark ETL cleans the registry data, a daemon keeps Elasticsearch in sync with PostgreSQL and Go crawlers bring complaints and reviews into a Neo4j graph with local embeddings. The RAG chat and the insights engine, which scores each company from 0 to 100, run on top of that graph. Above it all, a React workspace brings together search, profile, pipeline, scheduling and emails.',
  },
  deliverables: [
    {
      title: { pt: 'Busca em 300 mil empresas', en: 'Search across 300,000 companies' },
      text: {
        pt: 'Índice Elasticsearch com 13 filtros combináveis, taxonomia CNAE em quatro níveis e filtros salvos por usuário.',
        en: 'An Elasticsearch index with 13 combinable filters, a four-level industry taxonomy and per-user saved filters.',
      },
    },
    {
      title: { pt: 'Diagnóstico com score de oportunidade', en: 'Diagnosis with an opportunity score' },
      text: {
        pt: 'Três frentes de análise por empresa, evidências auditadas e um score de 0 a 100 que ordena a fila do time.',
        en: 'Three analysis fronts per company, audited evidence and a 0–100 score that orders the team’s queue.',
      },
    },
    {
      title: { pt: 'Chat RAG que cita a fonte', en: 'RAG chat that cites its sources' },
      text: {
        pt: 'Perguntas livres sobre uma empresa ou um setor, respondidas com trechos recuperados e tabela de evidências.',
        en: 'Free-form questions about a company or an industry, answered with retrieved passages and an evidence table.',
      },
    },
    {
      title: { pt: 'Workspace de prospecção', en: 'Prospecting workspace' },
      text: {
        pt: 'Funil com cinco status, agenda, cadências, emails gerados por IA com disparo SMTP e controle de prompts.',
        en: 'A five-stage pipeline, scheduling, cadences, AI-generated emails with SMTP delivery and prompt control.',
      },
    },
  ],
  role: {
    pt: 'Construí o crawler do Glassdoor e o frontend inteiro do LeadSpector. No backend, o leadspector-rag, desenhei e implementei o chat RAG, o motor de insights com score de oportunidade, a listagem de leads sobre Elasticsearch, a gestão de prospecção, a geração de emails a partir das oportunidades encontradas e o controle de prompts que deixa o time comercial ajustar cada geração sem esperar deploy.',
    en: 'I built the Glassdoor crawler and the entire LeadSpector frontend. In the backend, leadspector-rag, I designed and implemented the RAG chat, the insights engine with its opportunity score, lead listing on Elasticsearch, prospecting management, email generation from the opportunities found and the prompt control that lets the sales team tune every generation without waiting for a deploy.',
  },
  responsibilities: [
    { pt: 'Escrevi o crawler do Glassdoor em Go: pool de workers, resolução do empregador por nome e domínio, captura do GraphQL paginado e retry com backoff exponencial.', en: 'Wrote the Glassdoor crawler in Go: worker pool, employer resolution by name and domain, paginated GraphQL capture and retry with exponential backoff.' },
    { pt: 'Construí o frontend em React 19 com TanStack Router e Query: busca com filtros inteligentes, perfil da empresa, funil, agenda, emails e configurações.', en: 'Built the React 19 frontend with TanStack Router and Query: smart-filter search, company profile, pipeline, scheduling, emails and settings.' },
    { pt: 'Implementei o chat RAG: classificação de intenção, recuperação restrita ao CNPJ, busca por setor e UF, auditoria de citações e verificação da resposta por um segundo modelo.', en: 'Implemented the RAG chat: intent classification, retrieval scoped to the company ID, industry and state search, citation auditing and answer verification by a second model.' },
    { pt: 'Criei o motor de insights: três frentes de análise, auditoria anti-alucinação, score ponderado e lease no PostgreSQL para nunca gerar duas vezes a mesma empresa.', en: 'Created the insights engine: three analysis fronts, anti-hallucination auditing, a weighted score and a PostgreSQL lease so the same company is never generated twice.' },
    { pt: 'Levei a listagem de leads para o Elasticsearch, com 13 filtros, ordenação por score e visibilidade por papel de usuário.', en: 'Moved lead listing onto Elasticsearch, with 13 filters, score ordering and visibility by user role.' },
    { pt: 'Desenvolvi a geração e o disparo de emails, o rastreio de respostas por IMAP e o controle de prompts com campos obrigatórios validados ao salvar.', en: 'Developed email generation and delivery, reply tracking over IMAP and prompt control with required fields validated on save.' },
  ],
  outcome: {
    pt: '300 mil empresas pesquisáveis em segundos, cada uma com diagnóstico, score de oportunidade e email de abordagem a um clique do vendedor.',
    en: '300,000 companies searchable in seconds, each with a diagnosis, an opportunity score and an outreach email one click away from the seller.',
  },
  preview: {
    summary: { pt: 'Receita Federal, Reclame Aqui e Glassdoor cruzados para mostrar onde vender.', en: 'Federal registry, Reclame Aqui and Glassdoor combined to show where to sell.' },
    problem: { pt: 'Prospecção manual: horas por conta e abordagens genéricas.', en: 'Manual prospecting: hours per account and generic outreach.' },
    role: { pt: 'Crawler Glassdoor, frontend inteiro, RAG, insights, busca e emails.', en: 'Glassdoor crawler, entire frontend, RAG, insights, search and emails.' },
    outcome: { pt: '300 mil empresas em segundos, com score e email prontos.', en: '300,000 companies in seconds, with score and email ready.' },
  },
  metrics: [
    {
      value: { pt: '300 mil', en: '300k' },
      label: { pt: 'empresas pesquisáveis em segundos', en: 'companies searchable in seconds' },
      context: { pt: 'base da Receita Federal sincronizada com o Elasticsearch', en: 'federal registry data kept in sync with Elasticsearch' },
      count: { to: 300, suffix: { pt: ' mil', en: 'k' } },
      basis: 'confirmed',
    },
    {
      value: { pt: '15 min', en: '15 min' },
      label: { pt: 'para preparar a abordagem de uma conta', en: 'to prepare outreach for one account' },
      context: { pt: 'antes, cerca de 2 horas de pesquisa manual', en: 'down from about 2 hours of manual research' },
      count: { to: 15, suffix: { pt: ' min', en: ' min' } },
      basis: 'confirmed',
    },
    {
      value: { pt: '13 filtros', en: '13 filters' },
      label: { pt: 'combináveis na busca de leads', en: 'combinable in lead search' },
      context: { pt: 'região, porte, CNAE, capital, tempo de atividade, score e status', en: 'region, size, industry code, capital, years in business, score and status' },
      count: { to: 13, suffix: { pt: ' filtros', en: ' filters' } },
      basis: 'scope',
    },
    {
      value: { pt: '4 fatores', en: '4 factors' },
      label: { pt: 'no score de oportunidade de 0 a 100', en: 'in the 0–100 opportunity score' },
      context: { pt: 'dor, amplitude da oferta, fit de porte e confiança dos sinais', en: 'pain, offer breadth, size fit and signal confidence' },
      count: { to: 4, suffix: { pt: ' fatores', en: ' factors' } },
      basis: 'scope',
    },
  ],
  impact: [
    { pt: 'O vendedor monta uma lista qualificada em segundos, como indústrias de médio porte no Sul com mais de dez anos de atividade e score alto, em vez de garimpar planilhas.', en: 'Sellers build a qualified list in seconds, such as mid-sized manufacturers in the South with over ten years in business and a high score, instead of digging through spreadsheets.' },
    { pt: 'Cada conta chega com o diagnóstico pronto: onde a empresa sofre, a evidência que comprova e qual serviço da casa resolve.', en: 'Every account arrives with the diagnosis ready: where the company hurts, the evidence behind it and which of the firm’s services solves it.' },
    { pt: 'A preparação de uma abordagem caiu de cerca de duas horas de pesquisa para 15 minutos de leitura.', en: 'Preparing outreach dropped from about two hours of research to 15 minutes of reading.' },
    { pt: 'Pesquisa, funil, agenda e email no mesmo lugar: a gestão enxerga a carteira de cada SDR e nenhum contexto se perde entre ferramentas.', en: 'Research, pipeline, scheduling and email in one place: managers see each SDR’s portfolio and no context gets lost between tools.' },
  ],
  technologies: ['Go', 'Rod', 'Apache Spark', 'PostgreSQL', 'Neo4j', 'Elasticsearch', 'Redis', 'Ollama', 'LangChain', 'Groq', 'RAG', 'TypeScript', 'Fastify', 'React', 'TanStack Router', 'Docker', 'AWS', 'Prometheus', 'Grafana'],
  stackGroups: [
    { label: { pt: 'Coleta', en: 'Collection' }, items: ['Go', 'Rod', 'Java', 'Apache Spark'] },
    { label: { pt: 'Dados e busca', en: 'Data and search' }, items: ['PostgreSQL', 'Neo4j', 'Elasticsearch', 'Redis'] },
    { label: { pt: 'IA', en: 'AI' }, items: ['RAG', 'LangChain', 'Ollama', 'nomic-embed-text', 'Groq'] },
    { label: { pt: 'Produto', en: 'Product' }, items: ['TypeScript', 'Fastify', 'React 19', 'TanStack Router', 'TanStack Query', 'Tailwind CSS'] },
    { label: { pt: 'Infra', en: 'Infra' }, items: ['Docker', 'AWS EC2', 'Caddy', 'GitHub Actions', 'Prometheus', 'Grafana'] },
  ],
  components: [
    {
      title: { pt: 'Crawler Glassdoor', en: 'Glassdoor crawler' },
      purpose: { pt: 'Trazer a visão de quem opera os sistemas por dentro: avaliações de funcionários ligadas ao CNPJ.', en: 'Bring in the view of the people running the systems from the inside: employee reviews tied to the company ID.' },
      mechanism: { pt: 'Um pool de goroutines, com três workers por padrão, lê as empresas ativas do PostgreSQL. Para cada uma, o resolvedor encontra o empregador no Glassdoor cruzando nome e domínio do site, o que elimina homônimos. O interceptor captura as respostas GraphQL paginadas, até 100 avaliações por empresa, com timeout de 30 s por página e retry com backoff exponencial. O status de cada empresa fica no PostgreSQL e as avaliações vão para o Neo4j.', en: 'A goroutine pool, three workers by default, reads active companies from PostgreSQL. For each one, the resolver finds the Glassdoor employer by matching name and website domain, which rules out namesakes. The interceptor captures the paginated GraphQL responses, up to 100 reviews per company, with a 30 s page timeout and retry with exponential backoff. Each company’s status lives in PostgreSQL and the reviews go to Neo4j.' },
      stack: ['Go', 'Rod', 'PostgreSQL', 'Neo4j'],
    },
    {
      title: { pt: 'Coleta de reputação', en: 'Reputation collection' },
      purpose: { pt: 'Levar a dor do cliente final para um corpus pesquisável, sem leitura manual.', en: 'Bring the end customer’s pain into a searchable corpus, with no manual reading.' },
      mechanism: { pt: 'O crawler do Reclame Aqui, em Go com navegador headless, descobre a página da empresa, extrai as reclamações do JSON-LD e guarda até 10 por CNPJ, com 15 s entre empresas e 3 s entre reclamações. Um daemon leva o material coletado para o grafo em lotes de 50: ritmo reduzido no horário comercial, velocidade total fora dele.', en: 'The Reclame Aqui crawler, written in Go with a headless browser, finds the company page, extracts complaints from JSON-LD and keeps up to 10 per company, with 15 s between companies and 3 s between complaints. A daemon moves the collected material into the graph in batches of 50: reduced pace during business hours, full speed outside them.' },
      stack: ['Go', 'Rod', 'PostgreSQL', 'Neo4j'],
    },
    {
      title: { pt: 'Base cadastral e índice', en: 'Registry and index' },
      purpose: { pt: 'Deixar a base inteira de empresas ativas pesquisável com filtros comerciais.', en: 'Make the full base of active companies searchable with sales filters.' },
      mechanism: { pt: 'Um job Apache Spark lê os dumps da Receita, deduplica por CNPJ base, mantém só empresas ativas e grava no PostgreSQL. Um daemon de sincronização roda a cada 5 minutos: indexa o que mudou em lotes bulk e, a cada ciclo, reconcilia o conjunto completo de CNPJs entre PostgreSQL e Elasticsearch, para nenhuma empresa ficar invisível na busca.', en: 'An Apache Spark job reads the registry dumps, deduplicates by company ID, keeps only active companies and writes them to PostgreSQL. A sync daemon runs every 5 minutes: it indexes what changed in bulk batches and, on every cycle, reconciles the full set of company IDs between PostgreSQL and Elasticsearch so no company goes missing from search.' },
      stack: ['Java', 'Apache Spark', 'PostgreSQL', 'Elasticsearch'],
    },
    {
      title: { pt: 'Chunking e embeddings', en: 'Chunking and embeddings' },
      purpose: { pt: 'Transformar texto coletado em trechos recuperáveis, sem enviar dado bruto para fora.', en: 'Turn collected text into retrievable passages without sending raw data outside.' },
      mechanism: { pt: 'O texto é segmentado por sentenças em português e agrupado em chunks de até 1.000 caracteres, com uma sentença de sobreposição e hash de conteúdo para evitar duplicatas. Os vetores saem do nomic-embed-text rodando no Ollama, dentro da nossa infraestrutura, e ficam no próprio nó do Neo4j, com busca por similaridade de cosseno.', en: 'Text is segmented into Portuguese sentences and grouped into chunks of up to 1,000 characters, with one sentence of overlap and a content hash to prevent duplicates. Vectors come from nomic-embed-text running on Ollama, inside our infrastructure, and live on the Neo4j node itself, searched by cosine similarity.' },
      stack: ['TypeScript', 'Ollama', 'Neo4j'],
    },
    {
      title: { pt: 'Resumo institucional', en: 'Company profile summaries' },
      purpose: { pt: 'Entregar ao vendedor um primeiro parágrafo sobre quem é a empresa antes de qualquer pergunta.', en: 'Give sellers a first paragraph on who the company is before any question.' },
      mechanism: { pt: 'Um worker em Go encontra empresas sem resumo no grafo, ancora segmento e site no PostgreSQL, junta os dados da Receita e gera o perfil com um LLM open-weight via Groq. Cadência fixa entre empresas, backoff maior para erros 429 e nenhuma empresa marcada como enriquecida se a escrita no grafo falhar.', en: 'A Go worker finds companies without a summary in the graph, anchors industry and website in PostgreSQL, adds registry data and generates the profile with an open-weight LLM via Groq. Fixed pacing between companies, longer backoff on 429 errors and no company marked as enriched if the graph write fails.' },
      stack: ['Go', 'Groq', 'PostgreSQL', 'Neo4j'],
    },
    {
      title: { pt: 'Chat RAG', en: 'RAG chat' },
      purpose: { pt: 'Responder perguntas comerciais com trechos da própria empresa e mostrar de onde veio cada afirmação.', en: 'Answer sales questions with the company’s own passages and show where every claim came from.' },
      mechanism: { pt: 'Saudações são respondidas sem chamar o modelo. Um classificador separa pergunta sobre uma empresa de busca ampla. No primeiro caso, a recuperação traz chunks por similaridade restritos aos 8 dígitos do CNPJ base, mais resumo institucional e firmografia do PostgreSQL. No segundo, setor e UF são reconhecidos de forma determinística e viram os mesmos filtros da tela de leads. Citações sem âncora no contexto são removidas e um segundo modelo confere se a resposta está sustentada. Limite de 30 perguntas por minuto e timeout de 75 s.', en: 'Greetings are answered without calling the model. A classifier separates questions about one company from broad searches. In the first case, retrieval brings chunks by similarity scoped to the 8-digit company ID, plus the profile summary and PostgreSQL firmographics. In the second, industry and state are recognized deterministically and become the same filters as the lead screen. Citations without an anchor in the context are removed and a second model checks the answer is supported. Capped at 30 questions per minute with a 75 s timeout.' },
      stack: ['TypeScript', 'Fastify', 'LangChain', 'Neo4j', 'Elasticsearch'],
    },
    {
      title: { pt: 'Motor de insights e score', en: 'Insights engine and score' },
      purpose: { pt: 'Dizer ao vendedor onde a empresa sofre, com qual evidência, e quanto vale a pena abordá-la.', en: 'Tell sellers where the company hurts, with what evidence, and how much it is worth approaching.' },
      mechanism: { pt: 'Três frentes de análise (Arquitetura e Escalabilidade, IA e Automação, Modernização e Engenharia) rodam em paralelo. Cada uma recupera até 8 reclamações e 6 avaliações de funcionários acima do limiar de similaridade, e o modelo devolve criticidade, evidências e serviços recomendados. Evidência sem âncora é descartada; frente sem evidência não acende. O score soma dor (40%), amplitude da oferta (25%), fit de porte (20%) e confiança dos sinais (15%). Um lease com fencing token no PostgreSQL garante uma única geração por empresa entre rota individual, lote de até 200 e job em background.', en: 'Three analysis fronts (Architecture and Scalability, AI and Automation, Modernization and Engineering) run in parallel. Each retrieves up to 8 complaints and 6 employee reviews above the similarity threshold, and the model returns criticality, evidence and recommended services. Evidence without an anchor is dropped; a front without evidence does not light up. The score adds pain (40%), offer breadth (25%), size fit (20%) and signal confidence (15%). A PostgreSQL lease with a fencing token guarantees a single generation per company across the individual route, batches of up to 200 and the background job.' },
      stack: ['TypeScript', 'LangChain', 'Neo4j', 'PostgreSQL'],
    },
    {
      title: { pt: 'Workspace comercial', en: 'Sales workspace' },
      purpose: { pt: 'Levar o vendedor da lista ao email enviado sem trocar de ferramenta.', en: 'Take sellers from the list to the sent email without switching tools.' },
      mechanism: { pt: 'React 19 com TanStack Router e Query. Busca com filtros em abas e taxonomia CNAE; perfil da empresa com sócios, contatos, resumo, insights e chat; funil de cinco status com Kanban; agenda do SDR e visão do gestor; cadências multicanal; emails gerados a partir das frentes acesas, com disparo SMTP e resposta rastreada por IMAP. Os prompts do chat e de cada frente são editáveis na tela, com validação dos campos obrigatórios.', en: 'React 19 with TanStack Router and Query. Tabbed filter search with the industry taxonomy; company profile with partners, contacts, summary, insights and chat; a five-stage pipeline with Kanban; SDR scheduling and a manager view; multichannel cadences; emails generated from the lit fronts, with SMTP delivery and IMAP reply tracking. Chat and per-front prompts are editable on screen, with required fields validated.' },
      stack: ['React', 'TypeScript', 'TanStack Router', 'Fastify'],
    },
  ],
  decisions: [
    {
      title: { pt: 'Grafo para contexto, índice para busca', en: 'Graph for context, index for search' },
      rationale: { pt: 'O Neo4j conecta empresa, chunks, resumo e avaliações pelo CNPJ, com o vetor no mesmo nó: a recuperação encontra os trechos certos da empresa certa. O Elasticsearch responde 13 filtros sobre 300 mil documentos. Cada um faz o que faz melhor.', en: 'Neo4j connects company, chunks, summary and reviews by company ID, with the vector on the same node: retrieval finds the right passages for the right company. Elasticsearch answers 13 filters over 300,000 documents. Each does what it does best.' },
    },
    {
      title: { pt: 'Auditoria antes da tela', en: 'Auditing before the screen' },
      rationale: { pt: 'Toda evidência e toda citação é comparada com o contexto entregue ao modelo, por trecho literal ou sobreposição de palavras. O que não bate é removido. O vendedor só vê afirmações que consegue rastrear até a fonte.', en: 'Every piece of evidence and every citation is checked against the context given to the model, by literal passage or word overlap. Anything that does not match is removed. Sellers only see claims they can trace back to the source.' },
    },
    {
      title: { pt: 'Embeddings locais, prompts na mão do time', en: 'Local embeddings, prompts in the team’s hands' },
      rationale: { pt: 'Vetores gerados no Ollama mantêm o dado coletado dentro da infraestrutura e zeram o custo por documento. Os prompts ficam no banco, editáveis pela tela, com os placeholders obrigatórios validados ao salvar: o time ajusta tom e foco sem quebrar a geração.', en: 'Vectors generated on Ollama keep collected data inside the infrastructure and remove per-document cost. Prompts live in the database, editable on screen, with required placeholders validated on save: the team tunes tone and focus without breaking generation.' },
    },
    {
      title: { pt: 'Uma geração por empresa, mesmo sob concorrência', en: 'One generation per company, even under concurrency' },
      rationale: { pt: 'Insights saem por três caminhos: clique no perfil, lote na listagem e job em background com 10 workers e checkpoint persistente. Um lease com fencing token no PostgreSQL impede gerações e emails duplicados, e o job retoma de onde parou depois de um deploy.', en: 'Insights come from three paths: a click on the profile, a batch from the list and a background job with 10 workers and a persistent checkpoint. A PostgreSQL lease with a fencing token prevents duplicate generations and emails, and the job resumes where it stopped after a deploy.' },
    },
  ],
  tradeoffs: [
    { pt: 'Duas bases, grafo e índice, significam dois pipelines para manter. O daemon de sincronização com reconciliação completa a cada ciclo é o preço de ter busca rápida e contexto rico sem abrir mão de nenhum dos dois.', en: 'Two stores, graph and index, mean two pipelines to maintain. The sync daemon with full reconciliation on every cycle is the price of fast search and rich context without giving up either.' },
    { pt: 'Crawlers dependem do layout e da API das fontes. Cada um roda como serviço próprio, com status por CNPJ, então uma quebra afeta só aquela fonte e a coleta retoma de onde parou.', en: 'Crawlers depend on the sources’ layout and API. Each runs as its own service with per-company status, so a break only affects that source and collection resumes where it stopped.' },
    { pt: 'A auditoria de evidências às vezes descarta uma paráfrase legítima. Prefiro perder uma evidência a mostrar uma inventada para o cliente.', en: 'Evidence auditing sometimes drops a legitimate paraphrase. I would rather lose one piece of evidence than show a client an invented one.' },
  ],
  lessons: [
    { pt: 'IA comercial ganha a confiança do time quando mostra a prova. A tabela de evidências com a fonte de cada trecho valeu mais para a adoção do que qualquer troca de modelo.', en: 'Sales AI earns the team’s trust when it shows the proof. The evidence table with each passage’s source did more for adoption than any model switch.' },
    { pt: 'Escopo por CNPJ precisa de trava dupla: filtro na consulta e sanitização depois da recuperação. Misturar duas empresas num diagnóstico é o pior erro possível em prospecção.', en: 'Company scoping needs a double lock: a filter in the query and sanitization after retrieval. Mixing two companies in one diagnosis is the worst possible mistake in prospecting.' },
    { pt: 'Colocar o controle de prompts na mão do time comercial cortou pedidos de ajuste ao time técnico e deixou cada frente de análise falar a língua de quem vende.', en: 'Putting prompt control in the sales team’s hands cut tuning requests to engineering and let each analysis front speak the language of the people selling.' },
  ],
  architecture: {
    layers: [
      { id: 'fontes', label: { pt: 'Coleta', en: 'Collection' } },
      { id: 'preparo', label: { pt: 'Preparação', en: 'Preparation' } },
      { id: 'busca', label: { pt: 'Dados', en: 'Data' } },
      { id: 'inteligencia', label: { pt: 'Inteligência', en: 'Intelligence' } },
      { id: 'uso', label: { pt: 'Uso comercial', en: 'Sales use' } },
    ],
    nodes: [
      { id: 'crawler-glassdoor', layer: 'fontes', type: 'input', title: { pt: 'Crawler Glassdoor', en: 'Glassdoor crawler' }, technology: 'Go / Rod', description: { pt: 'Resolve o empregador e coleta até 100 avaliações por empresa.', en: 'Resolves the employer and collects up to 100 reviews per company.' }, detail: { pt: 'Pool de workers, match por nome e domínio, captura do GraphQL paginado e retry com backoff exponencial.', en: 'Worker pool, name and domain matching, paginated GraphQL capture and retry with exponential backoff.' } },
      { id: 'crawler-reclame', layer: 'fontes', type: 'input', title: { pt: 'Crawler Reclame Aqui', en: 'Reclame Aqui crawler' }, technology: 'Go / Rod', description: { pt: 'Extrai reclamações públicas do JSON-LD, até 10 por CNPJ.', en: 'Extracts public complaints from JSON-LD, up to 10 per company.' }, detail: { pt: 'Intervalos de 15 s entre empresas e 3 s entre reclamações; status de coleta por CNPJ.', en: '15 s between companies and 3 s between complaints; collection status per company.' } },
      { id: 'dumps', layer: 'fontes', type: 'input', title: { pt: 'Base da Receita', en: 'Federal registry' }, technology: 'Spark / PostgreSQL', description: { pt: 'Empresas, estabelecimentos e sócios limpos por um ETL em Spark.', en: 'Companies, establishments and partners cleaned by a Spark ETL.' }, detail: { pt: 'Deduplicação por CNPJ base, só empresas ativas, datas e códigos normalizados antes de chegar ao PostgreSQL.', en: 'Deduplicated by company ID, active companies only, dates and codes normalized before reaching PostgreSQL.' } },
      { id: 'embeddings', layer: 'preparo', type: 'service', title: { pt: 'Embeddings locais', en: 'Local embeddings' }, technology: 'Ollama', description: { pt: 'Chunks de até 1.000 caracteres vetorizados dentro da infraestrutura.', en: 'Chunks of up to 1,000 characters vectorized inside our infrastructure.' }, detail: { pt: 'Segmentação por sentença em português, uma sentença de sobreposição, hash de conteúdo e nomic-embed-text.', en: 'Portuguese sentence segmentation, one sentence of overlap, content hashing and nomic-embed-text.' } },
      { id: 'resumos', layer: 'preparo', type: 'service', title: { pt: 'Worker de resumos', en: 'Summary worker' }, technology: 'Go / Groq', description: { pt: 'Escreve o perfil institucional de cada empresa sem resumo.', en: 'Writes the profile of every company that lacks a summary.' }, detail: { pt: 'Ancora segmento e site no PostgreSQL, junta os dados da Receita e respeita a cadência do provedor com backoff para 429.', en: 'Anchors industry and website in PostgreSQL, adds registry data and respects the provider’s pacing with backoff on 429.' } },
      { id: 'grafo', layer: 'busca', type: 'database', title: { pt: 'Grafo de contexto', en: 'Context graph' }, technology: 'Neo4j', description: { pt: 'Empresa, reclamações, avaliações e resumo conectados pelo CNPJ.', en: 'Company, complaints, reviews and summary connected by company ID.' }, detail: { pt: 'Nós Empresa, Chunk, GlassdoorReview e Sobre, com vetor no próprio nó e similaridade de cosseno.', en: 'Empresa, Chunk, GlassdoorReview and Sobre nodes, with the vector on the node and cosine similarity.' } },
      { id: 'indice', layer: 'busca', type: 'database', title: { pt: 'Índice de busca', en: 'Search index' }, technology: 'Elasticsearch', description: { pt: '300 mil empresas pesquisáveis em segundos.', en: '300,000 companies searchable in seconds.' }, detail: { pt: 'Sincronizado com o PostgreSQL a cada 5 minutos, com reconciliação completa de CNPJs em todo ciclo.', en: 'Synced with PostgreSQL every 5 minutes, with full company ID reconciliation on every cycle.' } },
      { id: 'rag', layer: 'inteligencia', type: 'service', title: { pt: 'Chat RAG', en: 'RAG chat' }, technology: 'LangChain / Fastify', description: { pt: 'Responde com trechos daquele CNPJ e tabela de evidências.', en: 'Answers with that company’s passages and an evidence table.' }, detail: { pt: 'Classificação de intenção, auditoria de citações, verificação por um segundo modelo e limite de 30 perguntas por minuto.', en: 'Intent classification, citation auditing, verification by a second model and a 30-questions-per-minute cap.' } },
      { id: 'insights', layer: 'inteligencia', type: 'service', title: { pt: 'Motor de insights', en: 'Insights engine' }, technology: 'LangChain / PostgreSQL', description: { pt: 'Três frentes de análise e score de oportunidade de 0 a 100.', en: 'Three analysis fronts and a 0–100 opportunity score.' }, detail: { pt: 'Evidências auditadas, score com quatro fatores ponderados e lease que garante uma geração por empresa.', en: 'Audited evidence, a score with four weighted factors and a lease that guarantees one generation per company.' } },
      { id: 'pesquisa', layer: 'inteligencia', type: 'service', title: { pt: 'Busca de leads', en: 'Lead search' }, technology: 'Fastify / Redis', description: { pt: 'Traduz 13 filtros comerciais em uma consulta ao índice.', en: 'Turns 13 sales filters into a single index query.' }, detail: { pt: 'Facetas em cache no Redis, taxonomia CNAE em quatro níveis e visibilidade por papel de usuário.', en: 'Facets cached in Redis, a four-level industry taxonomy and visibility by user role.' } },
      { id: 'frontend', layer: 'uso', type: 'output', title: { pt: 'Workspace de vendas', en: 'Sales workspace' }, technology: 'React 19', description: { pt: 'Busca, perfil, insights, chat e prompts em uma interface.', en: 'Search, profile, insights, chat and prompts in one interface.' }, detail: { pt: 'TanStack Router e Query, filtros salvos, Kanban do funil e edição de prompts com validação.', en: 'TanStack Router and Query, saved filters, pipeline Kanban and validated prompt editing.' } },
      { id: 'crm', layer: 'uso', type: 'output', title: { pt: 'Prospecção e emails', en: 'Prospecting and emails' }, technology: 'Fastify / SMTP', description: { pt: 'Funil de cinco status, agenda, cadências e email de abordagem.', en: 'Five-stage pipeline, scheduling, cadences and outreach email.' }, detail: { pt: 'Email gerado a partir das frentes acesas, disparo SMTP sem envio duplicado e resposta registrada via IMAP.', en: 'Email generated from the lit fronts, SMTP delivery without duplicate sends and replies logged via IMAP.' } },
    ],
    edges: [
      { from: 'crawler-glassdoor', to: 'grafo', payload: { pt: 'Review', en: 'Review' }, kind: 'async', label: { pt: 'Avaliações', en: 'Reviews' } },
      { from: 'crawler-reclame', to: 'embeddings', payload: { pt: 'Texto', en: 'Text' }, label: { pt: 'Reclamações', en: 'Complaints' } },
      { from: 'embeddings', to: 'grafo', payload: { pt: 'Chunk', en: 'Chunk' }, kind: 'async', label: { pt: 'Chunks + vetores', en: 'Chunks + vectors' } },
      { from: 'dumps', to: 'indice', payload: { pt: 'Lote', en: 'Batch' }, kind: 'async', label: { pt: 'Sync a cada 5 min', en: 'Sync every 5 min' } },
      { from: 'dumps', to: 'resumos', payload: { pt: 'CNPJ', en: 'Tax ID' }, label: { pt: 'Dados cadastrais', en: 'Registry data' } },
      { from: 'resumos', to: 'grafo', payload: { pt: 'Resumo', en: 'Brief' }, kind: 'async', label: { pt: 'Perfil por CNPJ', en: 'Profile per company' } },
      { from: 'grafo', to: 'rag', payload: { pt: 'Chunk', en: 'Chunk' }, label: { pt: 'Contexto', en: 'Context' } },
      { from: 'grafo', to: 'insights', payload: { pt: 'Sinal', en: 'Signal' }, label: { pt: 'Sinais de dor', en: 'Pain signals' } },
      { from: 'indice', to: 'pesquisa', payload: { pt: 'Hits', en: 'Hits' }, label: { pt: 'Resultados', en: 'Results' } },
      { from: 'pesquisa', to: 'frontend', payload: { pt: 'Lista', en: 'List' }, label: { pt: 'Leads filtrados', en: 'Filtered leads' } },
      { from: 'rag', to: 'frontend', payload: { pt: 'Resp.', en: 'Answer' }, label: { pt: 'Respostas com fonte', en: 'Sourced answers' } },
      { from: 'insights', to: 'frontend', payload: { pt: 'Score', en: 'Score' }, label: { pt: 'Diagnóstico', en: 'Diagnosis' } },
      { from: 'insights', to: 'crm', payload: { pt: 'Email', en: 'Email' }, kind: 'async', label: { pt: 'Rascunho de abordagem', en: 'Outreach draft' } },
      { from: 'frontend', to: 'crm', payload: { pt: 'Lead', en: 'Lead' }, label: { pt: 'Lead em prospecção', en: 'Lead in prospecting' } },
    ],
  },
  walkthrough: [
    {
      id: 'cadastro',
      title: { pt: 'A empresa entra no índice', en: 'The company enters the index' },
      text: { pt: 'Uma indústria de médio porte chega pela base da Receita. O ETL em Spark normaliza seus estabelecimentos e, em até 5 minutos, o daemon de sincronização a coloca no Elasticsearch, ao lado de outras 300 mil empresas.', en: 'A mid-sized manufacturer arrives through the federal registry. The Spark ETL normalizes its establishments and, within 5 minutes, the sync daemon puts it in Elasticsearch alongside 300,000 other companies.' },
      nodes: ['dumps', 'indice'],
      edges: [['dumps', 'indice']],
    },
    {
      id: 'sinais',
      title: { pt: 'Os sinais públicos chegam', en: 'Public signals arrive' },
      text: { pt: 'Os crawlers trazem avaliações de funcionários e reclamações de clientes: "o sistema trava no fechamento", "pedido some entre o site e o estoque". Os trechos viram vetores no Ollama e se ligam ao CNPJ da empresa no grafo.', en: 'The crawlers bring in employee reviews and customer complaints: “the system freezes at month-end close”, “orders vanish between the website and the warehouse”. Passages become vectors in Ollama and attach to the company ID in the graph.' },
      nodes: ['crawler-glassdoor', 'crawler-reclame', 'embeddings', 'grafo'],
      edges: [['crawler-reclame', 'embeddings'], ['embeddings', 'grafo'], ['crawler-glassdoor', 'grafo']],
    },
    {
      id: 'resumo',
      title: { pt: 'Um perfil é escrito', en: 'A profile is written' },
      text: { pt: 'O worker percebe que a empresa ainda não tem resumo, junta segmento, site e dados cadastrais e grava no grafo um parágrafo sobre o que ela faz, para quem vende e como opera.', en: 'The worker notices the company has no summary yet, combines industry, website and registry data and writes a paragraph into the graph on what it does, who it sells to and how it operates.' },
      nodes: ['dumps', 'resumos', 'grafo'],
      edges: [['dumps', 'resumos'], ['resumos', 'grafo']],
    },
    {
      id: 'busca',
      title: { pt: 'O vendedor encontra', en: 'The seller finds it' },
      text: { pt: 'No workspace, o vendedor filtra indústrias de médio porte no Sul, com mais de dez anos de atividade e sem SDR responsável. A empresa aparece na lista em segundos, já com o resumo disponível.', en: 'In the workspace, the seller filters mid-sized manufacturers in the South, over ten years in business and with no assigned SDR. The company shows up in seconds, summary already available.' },
      nodes: ['indice', 'pesquisa', 'frontend'],
      edges: [['indice', 'pesquisa'], ['pesquisa', 'frontend']],
      metric: { pt: '300 mil empresas em segundos', en: '300k companies in seconds' },
    },
    {
      id: 'oportunidade',
      title: { pt: 'O diagnóstico acende', en: 'The diagnosis lights up' },
      text: { pt: 'Ao abrir o perfil, o motor de insights analisa as três frentes. Modernização e Engenharia acende como crítica, com duas reclamações e uma avaliação como evidência. O score sai alto e a empresa sobe na fila do time.', en: 'When the profile opens, the insights engine analyzes the three fronts. Modernization and Engineering lights up as critical, backed by two complaints and one review. The score comes out high and the company climbs the team’s queue.' },
      nodes: ['grafo', 'insights', 'frontend'],
      edges: [['grafo', 'insights'], ['insights', 'frontend']],
      metric: { pt: 'Score de 0 a 100', en: '0–100 score' },
    },
    {
      id: 'pergunta',
      title: { pt: 'A pergunta vira abordagem', en: 'The question becomes outreach' },
      text: { pt: 'O vendedor pergunta "quais as principais reclamações sobre o sistema?". O RAG responde com trechos daquele CNPJ e a tabela de evidências. Ele move o lead para Em prospecção e encontra o email de abordagem pronto, escrito a partir das frentes acesas.', en: 'The seller asks “what are the main complaints about the system?”. RAG answers with that company’s passages and the evidence table. They move the lead to In prospecting and find the outreach email ready, written from the lit fronts.' },
      nodes: ['grafo', 'rag', 'frontend', 'insights', 'crm'],
      edges: [['grafo', 'rag'], ['rag', 'frontend'], ['insights', 'crm'], ['frontend', 'crm']],
      metric: { pt: '30 perguntas por minuto', en: '30 questions per minute' },
    },
  ],
  confidentiality: 'pending',
};
