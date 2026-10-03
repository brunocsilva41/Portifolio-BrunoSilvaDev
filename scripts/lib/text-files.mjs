// sitemap.xml, robots.txt, llms.txt e llms-full.txt gerados a partir de CASES + PROFILE.

const pick = (value, lang) => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value[lang] || value.pt || '';
};

const xml = value => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* ---------- sitemap ---------- */

export function sitemapXml(entries, lastmod) {
  const urls = entries.map(({ loc, alternates }) => `  <url>
    <loc>${xml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${xml(alternates.pt)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${xml(alternates.en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(alternates.xDefault)}"/>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

/* ---------- robots ---------- */

export const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot',
];

export function robotsTxt(siteUrl) {
  const block = agent => `User-agent: ${agent}\nAllow: /\nDisallow: /case.html\n`;
  return [
    '# Conteúdo público: buscadores e assistentes de IA são bem-vindos.',
    block('*'),
    ...AI_BOTS.map(block),
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');
}

/* ---------- llms ---------- */

// Campos de texto omitidos do llms por case ('*' vale para todos).
const TEXT_PLACEHOLDERS = { '*': [] };

function skipField(slug, field) {
  return TEXT_PLACEHOLDERS['*'].includes(field) || (TEXT_PLACEHOLDERS[slug] || []).includes(field);
}

const realMetrics = item => (item.metrics || []).filter(metric => !metric.placeholder && metric.basis !== 'placeholder');

const LABELS = {
  pt: {
    about: 'Sobre', cases: 'Estudos de caso', work: 'Como eu trabalho', contact: 'Contato',
    capabilities: 'Competências', experience: 'Experiência', education: 'Formação', other: 'Outras versões',
    client: 'Cliente', period: 'Período', role: 'Papel', stack: 'Tecnologias', url: 'URL',
    context: 'Contexto do negócio', problem: 'Desafio', solution: 'Solução', deliverables: 'Entregas',
    responsibilities: 'O que eu fiz', metrics: 'Números', decisions: 'Decisões técnicas', tradeoffs: 'Trade-offs',
    lessons: 'Aprendizados', estimated: 'estimativa', illustrative: 'exemplo visual',
  },
  en: {
    about: 'About', cases: 'Case studies', work: 'How I work', contact: 'Contact',
    capabilities: 'Capabilities', experience: 'Experience', education: 'Education', other: 'Other versions',
    client: 'Client', period: 'Period', role: 'Role', stack: 'Technologies', url: 'URL',
    context: 'Business context', problem: 'Challenge', solution: 'Solution', deliverables: 'Deliverables',
    responsibilities: 'What I did', metrics: 'Numbers', decisions: 'Technical decisions', tradeoffs: 'Trade-offs',
    lessons: 'Lessons', estimated: 'estimate', illustrative: 'visual example',
  },
};

// Sem rotular formato de contratação (decisão do autor).
const OPEN_TO = {
  pt: 'Aberto a projetos, consultoria e posições em times de produto.',
  en: 'Open to projects, consulting and roles on product teams.',
};

function companyLine(profile, lang) {
  const company = profile.company;
  if (!company?.name) return '';
  const id = company.taxID ? (lang === 'pt' ? ` · CNPJ ${company.taxID}` : ` · Brazilian company ID (CNPJ) ${company.taxID}`) : '';
  return `- ${lang === 'pt' ? 'Empresa' : 'Company'}: ${company.name}${id}`;
}

function approachLines(profile, lang) {
  const approach = profile.approach;
  if (!approach) return [];
  const steps = (approach.steps || []).map(step => {
    const title = pick(step.title, lang);
    const text = pick(step.text, lang);
    return title && text ? `- **${title}** — ${text}` : (title || text ? `- ${title || text}` : '');
  }).filter(Boolean);
  return [pick(approach.intro, lang), '', ...steps].filter((line, index, all) => line || (index > 0 && all[index - 1]));
}

function contactLines(profile, lang = 'pt') {
  const contact = profile.contact || {};
  return [
    OPEN_TO[lang],
    companyLine(profile, lang),
    contact.email && `- E-mail: ${contact.email}`,
    contact.linkedin && `- LinkedIn: ${contact.linkedin}`,
    contact.github && `- GitHub: ${contact.github}`,
    contact.phone && `- ${lang === 'pt' ? 'Telefone' : 'Phone'}: ${contact.phone}`,
  ].filter(Boolean);
}

export function llmsTxt({ profile, cases, meta, url, serviceText }) {
  const lines = [
    `# ${profile.name}`,
    '',
    `> ${meta.home.pt.description}`,
    '',
    `${pick(profile.role, 'pt')} · ${pick(profile.location, 'pt')}.`,
    `${pick(profile.lede, 'pt')}`,
    '',
    '## Páginas',
    `- [Início](${url({ page: 'home', lang: 'pt' })}): ${meta.home.pt.description}`,
    `- [Estudos de caso](${url({ page: 'cases', lang: 'pt' })}): ${meta.cases.pt.description}`,
    '',
    `## ${LABELS.pt.cases}`,
    ...cases.map(item => `- [${pick(item.title, 'pt')}](${url({ page: 'case', lang: 'pt', slug: item.slug })}): ${meta.case[item.slug].pt.description}`),
    '',
    `## ${LABELS.pt.work}`,
    ...(approachLines(profile, 'pt').length ? approachLines(profile, 'pt') : [serviceText.pt]),
    '',
    `## ${LABELS.pt.contact}`,
    ...contactLines(profile),
    '',
    '## English',
    `- [Home](${url({ page: 'home', lang: 'en' })}): ${meta.home.en.description}`,
    `- [Case studies](${url({ page: 'cases', lang: 'en' })}): ${meta.cases.en.description}`,
    ...cases.map(item => `- [${pick(item.title, 'en')}](${url({ page: 'case', lang: 'en', slug: item.slug })}): ${meta.case[item.slug].en.description}`),
    '',
    '## Optional',
    `- [llms-full.txt](${url({ file: '/llms-full.txt' })}): conteúdo completo dos estudos de caso em português e inglês / full case study content in Portuguese and English`,
    '',
  ];
  return lines.join('\n');
}

function caseMarkdown(item, lang, { url, categories }) {
  const L = LABELS[lang];
  const out = [];
  const title = pick(item.title, lang);
  out.push(`### ${title}`, '');
  const pitch = pick(item.pitch, lang);
  if (pitch) out.push(`> ${pitch}`, '');
  out.push(`- ${L.url}: ${url({ page: 'case', lang, slug: item.slug })}`);
  const category = pick(categories[item.category], lang);
  if (category) out.push(`- ${lang === 'pt' ? 'Área' : 'Area'}: ${category}`);
  if (pick(item.client, lang)) out.push(`- ${L.client}: ${pick(item.client, lang)}`);
  if (!skipField(item.slug, 'period') && pick(item.period, lang)) out.push(`- ${L.period}: ${pick(item.period, lang)}`);
  if (pick(item.roleTitle, lang)) out.push(`- ${L.role}: ${pick(item.roleTitle, lang)}`);
  if (item.technologies?.length) out.push(`- ${L.stack}: ${item.technologies.join(', ')}`);
  out.push('');
  if (pick(item.summary, lang)) out.push(pick(item.summary, lang), '');

  const section = (heading, body) => {
    if (body) out.push(`#### ${heading}`, '', body, '');
  };
  const list = (heading, entries) => {
    const filtered = entries.filter(Boolean);
    if (filtered.length) out.push(`#### ${heading}`, '', ...filtered.map(entry => `- ${entry}`), '');
  };

  if (!skipField(item.slug, 'businessContext')) section(L.context, pick(item.businessContext, lang));
  section(L.problem, pick(item.problem, lang));
  list(L.problem + ' · ' + (lang === 'pt' ? 'pontos' : 'points'), (item.challengePoints || []).map(point => `**${pick(point.title, lang)}** — ${pick(point.text, lang)}`));
  section(L.solution, pick(item.solution, lang));
  list(L.deliverables, (item.deliverables || []).map(entry => `**${pick(entry.title, lang)}** — ${pick(entry.text, lang)}`));
  section(L.role, pick(item.role, lang));
  list(L.responsibilities, (item.responsibilities || []).map(entry => pick(entry, lang)));
  list(L.metrics, realMetrics(item).map(metric => {
    const status = metric.basis === 'estimated' ? ` (${L.estimated})` : metric.basis === 'illustrative' ? ` (${L.illustrative})` : '';
    const context = pick(metric.context, lang);
    return `${pick(metric.value, lang)} ${pick(metric.label, lang)}${status}${context ? ` — ${context}` : ''}`;
  }));
  list(L.decisions, (item.decisions || []).map(entry => {
    const head = pick(entry.title, lang);
    const why = pick(entry.rationale, lang);
    return head && why ? `**${head}** — ${why}` : head || why;
  }));
  list(L.tradeoffs, (item.tradeoffs || []).map(entry => pick(entry, lang)));
  list(L.lessons, (item.lessons || []).map(entry => pick(entry, lang)));
  return out.join('\n');
}

function profileMarkdown(lang, { profile, experience, education, url, serviceText }) {
  const L = LABELS[lang];
  const out = [
    `## ${L.about}`,
    '',
    `${pick(profile.role, lang)} · ${pick(profile.location, lang)}.`,
    '',
    pick(profile.lede, lang),
    '',
    pick(profile.trajectoryIntro, lang),
    '',
    `- ${L.url}: ${url({ page: 'home', lang })}`,
    `- ${lang === 'pt' ? 'Índice de cases' : 'Case index'}: ${url({ page: 'cases', lang })}`,
    '',
    `## ${L.capabilities}`,
    '',
  ];
  for (const cap of profile.capabilities || []) {
    out.push(`### ${pick(cap.title, lang)}`, '', pick(cap.text, lang), '');
    if (cap.stack?.length) out.push(`${L.stack}: ${cap.stack.join(', ')}`, '');
  }
  out.push(`## ${L.experience}`, '');
  for (const job of experience || []) {
    out.push(`### ${pick(job.role, lang)} · ${job.company} (${pick(job.period, lang)})`, '');
    if (pick(job.summary, lang)) out.push(pick(job.summary, lang), '');
    out.push(...(job.bullets || []).map(bullet => `- ${pick(bullet, lang)}`), '');
  }
  if (education) {
    out.push(`## ${L.education}`, '', `- ${pick(education.degree, lang)} · ${pick(education.school, lang)} (${pick(education.period, lang)})`, '');
  }
  out.push(`## ${L.work}`, '');
  const approach = approachLines(profile, lang);
  out.push(...(approach.length ? approach : [serviceText[lang]]), '');
  out.push(`## ${L.contact}`, '', ...contactLines(profile, lang), '');
  return out.join('\n');
}

export function llmsFullTxt({ profile, experience, education, cases, categories, meta, url, serviceText }) {
  const parts = [`# ${profile.name}`, '', `> ${meta.home.pt.description}`, '', `> ${meta.home.en.description}`, ''];
  for (const lang of ['pt', 'en']) {
    parts.push(`# ${lang === 'pt' ? 'Português' : 'English'}`, '');
    parts.push(profileMarkdown(lang, { profile, experience, education, url, serviceText }));
    parts.push(`## ${LABELS[lang].cases}`, '');
    for (const item of cases) parts.push(caseMarkdown(item, lang, { url, categories }));
  }
  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
