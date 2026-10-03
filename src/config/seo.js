/*
 * SEO compartilhado entre o runtime (título/descrição) e o prerender (head completo, JSON-LD,
 * sitemap, llms). Módulo puro: sem DOM e sem `process` direto, roda no navegador e no Node.
 *
 * SITE_URL: domínio canônico sem barra final.
 *   - Prerender (Node): variável de ambiente SITE_URL, ex.: `SITE_URL=https://brunosilva.dev npm run build`.
 *   - Bundle do navegador: o vite.config.js injeta o mesmo valor em `import.meta.env.SITE_URL`.
 *   - Sem variável: domínio padrão da Vercel abaixo.
 */

import { PROFILE } from '../data/profile.js';
import { EDUCATION } from '../data/experience.js';
import { CASE_CATEGORIES, CASE_DOMAINS } from '../data/case-view-model.js';

const DEFAULT_SITE_URL = 'https://portfolio-bruno-gamma-six.vercel.app';

function readSiteUrl() {
  let value = '';
  try { value = globalThis.process?.env?.SITE_URL || ''; } catch { value = ''; }
  if (!value) {
    try { value = import.meta.env?.SITE_URL || ''; } catch { value = ''; }
  }
  value = String(value || DEFAULT_SITE_URL).trim();
  if (!/^https?:\/\/[^/]+/i.test(value)) value = DEFAULT_SITE_URL;
  return value.replace(/\/+$/, '');
}

export const SITE_URL = readSiteUrl();
export const SITE_NAME = 'Bruno Silva';
export const LANGS = ['pt', 'en'];
export const HTML_LANG = { pt: 'pt-BR', en: 'en' };
export const OG_LOCALE = { pt: 'pt_BR', en: 'en_US' };
export const THEME_COLOR = '#0B0E11';
export const OG_SIZE = { width: 1200, height: 630 };

const pick = (value, lang) => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value[lang] || value.pt || '';
};

const normLang = lang => (lang === 'en' ? 'en' : 'pt');

/* ---------- Copy editorial (títulos 50–60, descrições 140–160 caracteres) ---------- */

const PAGE_COPY = {
  home: {
    pt: {
      title: 'Bruno Silva · Engenheiro de software full stack em São Paulo',
      description: 'Engenheiro de software full stack em São Paulo: automação fiscal integrada ao ERP Linx, app de SST, gestão de academias e IA aplicada, do problema ao produto.',
      ogAlt: 'Bruno Silva, engenheiro de software full stack em São Paulo',
    },
    en: {
      title: 'Bruno Silva · Full Stack Software Engineer in São Paulo',
      description: 'Full stack software engineer in São Paulo, Brazil: Linx ERP tax automation, a workplace safety app, gym management and applied AI, from problem to production.',
      ogAlt: 'Bruno Silva, full stack software engineer in São Paulo, Brazil',
    },
  },
  cases: {
    pt: {
      title: 'Estudos de caso em ERP, fiscal, SST e IA · Bruno Silva',
      description: 'Estudos de caso de sistemas em produção: automação fiscal integrada ao ERP Linx, app de segurança do trabalho, prospecção com IA e RAG e sistema para academia.',
      ogAlt: 'Estudos de caso de Bruno Silva: ERP, fiscal, segurança do trabalho e IA',
    },
    en: {
      title: 'Case Studies: ERP, Tax, Safety and Applied AI · Bruno Silva',
      description: 'Case studies of production systems: tax automation integrated with Linx ERP, a workplace safety app, AI prospecting with RAG and a gym management platform.',
      ogAlt: 'Bruno Silva case studies: ERP, tax, workplace safety and AI',
    },
  },
  notfound: {
    pt: {
      title: 'Página não encontrada · Bruno Silva, engenheiro full stack',
      description: 'O endereço acessado não existe ou mudou. Veja os estudos de caso de Bruno Silva, engenheiro de software full stack em São Paulo, ou volte para o início do site.',
      ogAlt: 'Bruno Silva, engenheiro de software full stack',
    },
    en: {
      title: 'Page not found · Bruno Silva, full stack software engineer',
      description: 'This address does not exist or has moved. Browse the case studies by Bruno Silva, a full stack software engineer in São Paulo, or go back to the home page.',
      ogAlt: 'Bruno Silva, full stack software engineer',
    },
  },
};

const CASE_COPY = {
  steuer: {
    pt: {
      title: 'Steuer: NF-e, CT-e e NFS-e direto no ERP Linx · Bruno Silva',
      description: 'Como o Steuer capta NF-e, CT-e e NFS-e de cada CNPJ, confere com o pedido e lança no ERP Linx on-premise por WireGuard, com 90% das entradas sem digitação.',
    },
    en: {
      title: 'Steuer: Tax Invoice Automation for Linx ERP · Bruno Silva',
      description: 'How Steuer captures NF-e, CT-e and NFS-e per company, matches them to orders and posts them to on-premise Linx ERP over WireGuard, 90% with no manual keying.',
    },
  },
  kippis: {
    pt: {
      title: 'Kippis: app de segurança do trabalho e EPIs · Bruno Silva',
      description: 'Kippis é um app de segurança do trabalho para SST em campo: APR, permissões de trabalho, treinamentos, EPIs validados no CA-EPI e alertas antes do vencimento.',
    },
    en: {
      title: 'Kippis: Workplace Safety and PPE Mobile App · Bruno Silva',
      description: 'Kippis is a workplace safety app for field teams: risk analyses, work permits, training, PPE checked against CA-EPI and alerts before deadlines expire.',
    },
  },
  leadspector: {
    pt: {
      title: 'LeadSpector: prospecção com IA aplicada e RAG · Bruno Silva',
      description: 'LeadSpector cruza dados da Receita Federal, Reclame Aqui e Glassdoor de 300 mil empresas e usa RAG com Neo4j para sugerir a abordagem certa, citando a fonte.',
    },
    en: {
      title: 'LeadSpector: AI Sales Prospecting with RAG · Bruno Silva',
      description: 'LeadSpector crosses federal registry, Reclame Aqui and Glassdoor data on 300,000 companies and uses RAG with Neo4j to suggest the right pitch, citing sources.',
    },
  },
  gymos: {
    pt: {
      title: 'GymOS: sistema para academia com duas unidades · Bruno Silva',
      description: 'GymOS é um sistema para academia sob medida: matrícula, cobrança recorrente, check-in e treinos de duas unidades numa plataforma Next.js, NestJS e PostgreSQL.',
    },
    en: {
      title: 'GymOS: Gym Management, Billing and Check-in · Bruno Silva',
      description: 'GymOS is custom gym management software: enrollment, recurring billing, check-in and workouts for two locations on one Next.js, NestJS and PostgreSQL platform.',
    },
  },
};

const SUFFIX = ' · ' + SITE_NAME;

function clip(text, max) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:·—-]+$/, '') + '…';
}

// Fallback para cases novos sem copy editorial: título + pitch, descrição a partir do resumo.
function caseCopy(item, lang) {
  const editorial = CASE_COPY[item?.slug]?.[lang];
  if (editorial) return editorial;
  const name = pick(item?.title, lang) || item?.slug || '';
  const pitch = pick(item?.pitch, lang) || pick(item?.preview?.summary, lang);
  return {
    title: clip(pitch ? `${name}: ${pitch.replace(/\.$/, '')}` : name, 60 - SUFFIX.length) + SUFFIX,
    description: clip(pick(item?.summary, lang) || pitch, 160),
  };
}

/* ---------- URLs ---------- */

export function pagePath({ page = 'home', lang = 'pt', slug } = {}) {
  const prefix = normLang(lang) === 'en' ? '/en' : '';
  if (page === 'cases') return `${prefix}/cases`;
  if (page === 'case') return `${prefix}/cases/${encodeURIComponent(slug || '')}`;
  if (page === 'notfound') return '/404';
  return prefix || '/';
}

export const absoluteUrl = path => (path === '/' ? SITE_URL + '/' : SITE_URL + path);

export function ogImagePath({ page = 'home', lang = 'pt', item } = {}) {
  const key = page === 'case' && item?.slug ? item.slug : 'default';
  return `/og/${key}${normLang(lang) === 'en' ? '-en' : ''}.png`;
}

/* ---------- Meta por página ---------- */

export function pageMeta({ page = 'home', lang = 'pt', item } = {}) {
  lang = normLang(lang);
  const isCase = page === 'case' && item;
  const kind = isCase ? 'case' : (PAGE_COPY[page] ? page : 'notfound');
  const copy = isCase ? caseCopy(item, lang) : PAGE_COPY[kind][lang];
  const slug = isCase ? item.slug : undefined;
  const indexable = kind !== 'notfound';
  const path = pagePath({ page: kind, lang, slug });

  const ogAlt = isCase
    ? `${pick(item.title, lang)} · ${pick(item.pitch, lang) || pick(item.preview?.summary, lang)}`.replace(/\s·\s$/, '')
    : copy.ogAlt;

  return {
    title: copy.title,
    description: copy.description,
    path,
    canonical: indexable ? absoluteUrl(path) : null,
    alternates: indexable
      ? {
          pt: absoluteUrl(pagePath({ page: kind, lang: 'pt', slug })),
          en: absoluteUrl(pagePath({ page: kind, lang: 'en', slug })),
          xDefault: absoluteUrl(pagePath({ page: kind, lang: 'pt', slug })),
        }
      : null,
    ogImage: SITE_URL + ogImagePath({ page: kind, lang, item }),
    ogImageAlt: ogAlt,
    ogType: isCase ? 'article' : 'website',
    robots: indexable ? 'index,follow,max-image-preview:large' : 'noindex,follow',
    lang,
    htmlLang: HTML_LANG[lang],
    ogLocale: OG_LOCALE[lang],
    ogLocaleAlternate: OG_LOCALE[lang === 'pt' ? 'en' : 'pt'],
  };
}

/* ---------- JSON-LD ---------- */

const ID = {
  person: SITE_URL + '/#person',
  website: SITE_URL + '/#website',
  service: SITE_URL + '/#service',
};

function unique(values) {
  const seen = new Set();
  return values.filter(value => {
    const key = String(value).toLowerCase();
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'São Paulo',
  addressRegion: 'SP',
  addressCountry: 'BR',
};

function knowsAbout(lang, cases) {
  const domains = cases.flatMap(item => item.domains || []).map(id => pick(CASE_DOMAINS[id], lang));
  const capabilities = (PROFILE.capabilities || []).map(cap => pick(cap.title, lang));
  const stacks = (PROFILE.capabilities || []).flatMap(cap => cap.stack || []);
  const technologies = cases.flatMap(item => item.technologies || []);
  return unique([...capabilities, ...domains, ...technologies, ...stacks]);
}

function personNode(lang, cases) {
  const contact = PROFILE.contact || {};
  return {
    '@type': 'Person',
    '@id': ID.person,
    name: PROFILE.name,
    url: absoluteUrl(pagePath({ page: 'home', lang })),
    image: SITE_URL + ogImagePath({ page: 'home', lang }),
    jobTitle: pick(PROFILE.role, lang),
    description: PAGE_COPY.home[lang].description,
    email: contact.email ? 'mailto:' + contact.email : undefined,
    address: ADDRESS,
    homeLocation: { '@type': 'City', name: 'São Paulo' },
    nationality: { '@type': 'Country', name: lang === 'pt' ? 'Brasil' : 'Brazil' },
    knowsLanguage: ['pt-BR', 'en'],
    alumniOf: EDUCATION?.school ? { '@type': 'CollegeOrUniversity', name: pick(EDUCATION.school, lang) } : undefined,
    knowsAbout: knowsAbout(lang, cases),
    worksFor: PROFILE.company ? { '@id': ID.service } : undefined,
    sameAs: [contact.linkedin, contact.github].filter(Boolean),
  };
}

function websiteNode(lang) {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: SITE_URL + '/',
    name: SITE_NAME,
    description: PAGE_COPY.home[lang].description,
    inLanguage: ['pt-BR', 'en'],
    publisher: { '@id': ID.person },
    author: { '@id': ID.person },
  };
}

// Oferta única e genérica (sem rotular formato de contratação).
export const SERVICE_TEXT = {
  pt: 'Desenvolvimento de software sob medida, do discovery ao produto em produção: integrações, automação, apps e IA aplicada.',
  en: 'Custom software development, from discovery to a product running in production: integrations, automation, apps and applied AI.',
};

// Empresa (PROFILE.company): ProfessionalService é subtipo de Organization e aceita legalName/taxID.
function serviceNode(lang) {
  const contact = PROFILE.contact || {};
  const company = PROFILE.company || null;
  const country = { '@type': 'Country', name: lang === 'pt' ? 'Brasil' : 'Brazil' };
  return {
    '@type': 'ProfessionalService',
    '@id': ID.service,
    name: company?.name || (lang === 'pt' ? 'Bruno Silva · Engenharia de software full stack' : 'Bruno Silva · Full stack software engineering'),
    legalName: company?.legalName,
    taxID: company?.taxID,
    url: absoluteUrl(pagePath({ page: 'home', lang })),
    image: SITE_URL + ogImagePath({ page: 'home', lang }),
    description: pick(PROFILE.approach?.intro, lang) || SERVICE_TEXT[lang],
    email: contact.email,
    telephone: contact.phone,
    address: ADDRESS,
    areaServed: [{ '@type': 'City', name: 'São Paulo' }, country],
    availableLanguage: ['pt-BR', 'en'],
    founder: { '@id': ID.person },
    sameAs: [contact.linkedin, contact.github].filter(Boolean),
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: lang === 'pt' ? 'Desenvolvimento de software sob medida' : 'Custom software development',
        description: SERVICE_TEXT[lang],
        provider: { '@id': ID.service },
        areaServed: country,
      },
    },
  };
}

function breadcrumbNode(url, items) {
  return {
    '@type': 'BreadcrumbList',
    '@id': url + '#breadcrumb',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.url,
    })),
  };
}

const LABELS = {
  pt: { home: 'Início', cases: 'Cases' },
  en: { home: 'Home', cases: 'Cases' },
};

// Remove chaves undefined/null/'' e arrays vazios para um JSON-LD limpo.
function prune(value) {
  if (Array.isArray(value)) return value.map(prune).filter(entry => entry !== undefined);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, entry] of Object.entries(value)) {
      const cleaned = prune(entry);
      if (cleaned === undefined || cleaned === null || cleaned === '') continue;
      if (Array.isArray(cleaned) && !cleaned.length) continue;
      out[key] = cleaned;
    }
    return out;
  }
  return value;
}

export function jsonLd({ page = 'home', lang = 'pt', item, cases = [] } = {}) {
  lang = normLang(lang);
  const meta = pageMeta({ page, lang, item });
  const list = Array.isArray(cases) ? cases : [];
  const graph = [websiteNode(lang), personNode(lang, list), serviceNode(lang)];
  const homeUrl = absoluteUrl(pagePath({ page: 'home', lang }));
  const casesUrl = absoluteUrl(pagePath({ page: 'cases', lang }));
  const url = meta.canonical;

  if (page === 'home') {
    graph.push({
      '@type': 'WebPage',
      '@id': url + '#webpage',
      url,
      name: meta.title,
      description: meta.description,
      inLanguage: meta.htmlLang,
      isPartOf: { '@id': ID.website },
      about: { '@id': ID.person },
      mainEntity: { '@id': ID.person },
      primaryImageOfPage: { '@type': 'ImageObject', url: meta.ogImage, width: OG_SIZE.width, height: OG_SIZE.height },
    });
  } else if (page === 'cases') {
    graph.push({
      '@type': 'CollectionPage',
      '@id': url + '#webpage',
      url,
      name: meta.title,
      description: meta.description,
      inLanguage: meta.htmlLang,
      isPartOf: { '@id': ID.website },
      author: { '@id': ID.person },
      breadcrumb: { '@id': url + '#breadcrumb' },
      mainEntity: {
        '@type': 'ItemList',
        '@id': url + '#list',
        numberOfItems: list.length,
        itemListElement: list.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(pagePath({ page: 'case', lang, slug: entry.slug })),
          name: pick(entry.title, lang),
        })),
      },
    });
    graph.push(breadcrumbNode(url, [
      { name: LABELS[lang].home, url: homeUrl },
      { name: LABELS[lang].cases, url: casesUrl },
    ]));
  } else if (page === 'case' && item) {
    const name = pick(item.title, lang);
    const pitch = pick(item.pitch, lang);
    graph.push({
      '@type': 'WebPage',
      '@id': url + '#webpage',
      url,
      name: meta.title,
      description: meta.description,
      inLanguage: meta.htmlLang,
      isPartOf: { '@id': ID.website },
      breadcrumb: { '@id': url + '#breadcrumb' },
      primaryImageOfPage: { '@type': 'ImageObject', url: meta.ogImage, width: OG_SIZE.width, height: OG_SIZE.height },
    });
    graph.push({
      '@type': 'Article',
      '@id': url + '#article',
      headline: clip(pitch ? `${name}: ${pitch.replace(/\.$/, '')}` : name, 110),
      name,
      description: meta.description,
      abstract: pick(item.summary, lang),
      inLanguage: meta.htmlLang,
      url,
      mainEntityOfPage: { '@id': url + '#webpage' },
      isPartOf: { '@id': ID.website },
      author: { '@id': ID.person },
      publisher: { '@id': ID.person },
      image: { '@type': 'ImageObject', url: meta.ogImage, width: OG_SIZE.width, height: OG_SIZE.height },
      articleSection: pick(CASE_CATEGORIES[item.category], lang),
      about: (item.domains || []).map(id => ({ '@type': 'Thing', name: pick(CASE_DOMAINS[id], lang) })).filter(entry => entry.name),
      keywords: (item.technologies || []).join(', '),
    });
    graph.push(breadcrumbNode(url, [
      { name: LABELS[lang].home, url: homeUrl },
      { name: LABELS[lang].cases, url: casesUrl },
      { name, url },
    ]));
  }

  return prune({ '@context': 'https://schema.org', '@graph': graph });
}
