/*
 * Modelo editorial dos estudos de caso: normaliza as definições de ./cases/*.js para a UI,
 * o prerender e os arquivos de SEO (JSON-LD, llms.txt).
 *
 * Todo o conteúdo dos cases é definido pelo autor como real (decisão de 2026-10-03).
 * architecture.edges[].payload descreve o tipo de dado que trafega em cada conexão.
 */

import steuer from './cases/steuer.js';
import kippis from './cases/kippis.js';
import leadspector from './cases/leadspector.js';
import gymos from './cases/gymos.js';

const caseDefinitions = [steuer, kippis, leadspector, gymos];

// accent: identidade de domínio usada pelo CSS ([data-accent]) — fiscal = coral, ops = verde, ai = violeta
const ACCENTS = ['fiscal', 'ops', 'ai', 'fitness', 'neutral'];

// basis: origem do número exibido.
// confirmed = dado do autor; scope = contagem vinda do próprio sistema;
// estimated = estimativa; illustrative = exemplo visual; placeholder = legado (tratado como dado sem rótulo).
const METRIC_BASES = ['confirmed', 'scope', 'estimated', 'illustrative', 'placeholder'];

// Métricas 'illustrative' existem só para validar a composição e saem com o rótulo "Exemplo visual".
// Mude para false para escondê-las de todas as telas.
export const SHOW_ILLUSTRATIVE_METRICS = true;

function localized(value) {
  if (value && typeof value === 'object') return { pt: value.pt || '', en: value.en || value.pt || '' };
  return { pt: typeof value === 'string' ? value : '', en: typeof value === 'string' ? value : '' };
}

function hasText(value) {
  return Boolean(value && (value.pt || value.en));
}

function cleanList(values) {
  return Array.isArray(values) ? values.filter(value => typeof value === 'string' && value.trim()) : [];
}

function cleanLocalizedList(values) {
  return Array.isArray(values)
    ? values.map(localized).filter(hasText)
    : [];
}

function cleanTitledList(values, textKey = 'text') {
  return Array.isArray(values) ? values
    .filter(value => value && typeof value === 'object')
    .map(value => ({ title: localized(value.title), [textKey]: localized(value[textKey]) }))
    .filter(value => hasText(value.title)) : [];
}

function cleanDecisions(values) {
  return Array.isArray(values) ? values
    .map(value => {
      // Aceita o formato antigo (texto localizado) e o atual ({ title, rationale }).
      if (value && typeof value === 'object' && ('title' in value || 'rationale' in value)) {
        return { title: localized(value.title), rationale: localized(value.rationale) };
      }
      return { title: localized(value), rationale: localized('') };
    })
    .filter(value => hasText(value.title) || hasText(value.rationale)) : [];
}

function cleanCount(count) {
  if (!count || typeof count !== 'object' || !Number.isFinite(Number(count.to))) return null;
  return {
    to: Number(count.to),
    prefix: typeof count.prefix === 'string' ? count.prefix : '',
    suffix: localized(count.suffix),
    decimals: Number.isInteger(count.decimals) && count.decimals > 0 ? count.decimals : 0,
  };
}

function cleanMetrics(values) {
  return Array.isArray(values) ? values
    .filter(metric => metric && typeof metric === 'object' && (caseText(metric.value, 'pt') || caseText(metric.value, 'en')))
    .filter(metric => SHOW_ILLUSTRATIVE_METRICS || !(metric.illustrative === true || metric.basis === 'illustrative'))
    .map(metric => {
      const illustrative = metric.illustrative === true || metric.basis === 'illustrative';
      const estimated = !illustrative && (metric.estimated === true || metric.basis === 'estimated');
      const placeholder = metric.placeholder === true || metric.basis === 'placeholder';
      const basis = illustrative ? 'illustrative'
        : estimated ? 'estimated'
        : (METRIC_BASES.includes(metric.basis) ? metric.basis : (placeholder ? 'placeholder' : 'scope'));
      return {
        value: localized(metric.value),
        label: localized(metric.label),
        context: localized(metric.context),
        count: cleanCount(metric.count),
        basis,
        placeholder,
        estimated,
        illustrative,
      };
    }) : [];
}

function cleanComponents(values) {
  return Array.isArray(values) ? values
    .filter(value => value && typeof value === 'object')
    .map(value => ({
      title: localized(value.title),
      purpose: localized(value.purpose),
      mechanism: localized(value.mechanism),
      stack: cleanList(value.stack),
    }))
    .filter(value => hasText(value.title)) : [];
}

function cleanStackGroups(values) {
  return Array.isArray(values) ? values
    .filter(value => value && typeof value === 'object')
    .map(value => ({ label: localized(value.label), items: cleanList(value.items) }))
    .filter(value => hasText(value.label) && value.items.length) : [];
}

function cleanArchitecture(architecture) {
  const layers = Array.isArray(architecture?.layers) ? architecture.layers.filter(layer => layer && layer.id) : [];
  const nodes = Array.isArray(architecture?.nodes) ? architecture.nodes
    .filter(node => node && node.id)
    .map(node => ({ ...node, description: localized(node.description), detail: localized(node.detail) })) : [];
  const ids = new Set(nodes.map(node => node.id));
  const edges = Array.isArray(architecture?.edges)
    ? architecture.edges
      .filter(edge => edge && ids.has(edge.from) && ids.has(edge.to))
      // payload: rótulo curto (≤ 6 caracteres) do dado que trafega na conexão; null quando ausente.
      .map(edge => ({ ...edge, payload: hasText(localized(edge.payload)) ? localized(edge.payload) : null }))
    : [];
  return { layers, nodes, edges };
}

function cleanWalkthrough(values, architecture) {
  const ids = new Set(architecture.nodes.map(node => node.id));
  const edgeKeys = new Set(architecture.edges.map(edge => edge.from + '>' + edge.to));
  return Array.isArray(values) ? values
    .filter(step => step && typeof step === 'object')
    .map((step, index) => ({
      id: typeof step.id === 'string' && step.id ? step.id : 'step-' + (index + 1),
      title: localized(step.title),
      text: localized(step.text),
      nodes: cleanList(step.nodes).filter(id => ids.has(id)),
      edges: Array.isArray(step.edges)
        ? step.edges.filter(pair => Array.isArray(pair) && edgeKeys.has(pair[0] + '>' + pair[1]))
        : [],
      metric: hasText(localized(step.metric)) ? localized(step.metric) : null,
    }))
    .filter(step => hasText(step.title)) : [];
}

function normalizeCase(slug, additions = {}) {
  const confidentialityNote = additions.confidentiality === 'pending'
    ? {
        pt: 'Dados de clientes preservados.',
        en: 'Client data kept private.',
      }
    : { pt: '', en: '' };
  const architecture = cleanArchitecture(additions.architecture);

  return {
    slug,
    aliases: cleanList(additions.aliases),
    order: Number.isFinite(additions.order) ? additions.order : 99,
    number: String(Number.isFinite(additions.order) ? additions.order : 0).padStart(2, '0'),
    accent: ACCENTS.includes(additions.accent) ? additions.accent : 'neutral',
    title: localized(additions.title),
    category: additions.category || '',
    domains: cleanList(additions.domains),
    pitch: localized(additions.pitch),
    summary: localized(additions.summary),
    client: localized(additions.client),
    period: localized(additions.period),
    team: localized(additions.team),
    roleTitle: localized(additions.roleTitle),
    context: localized(additions.context),
    businessContext: localized(additions.businessContext),
    problem: localized(additions.problem),
    challengePoints: cleanTitledList(additions.challengePoints),
    solution: localized(additions.solution),
    deliverables: cleanTitledList(additions.deliverables),
    role: localized(additions.role),
    responsibilities: cleanLocalizedList(additions.responsibilities),
    outcome: localized(additions.outcome),
    preview: {
      summary: localized(additions.preview?.summary),
      problem: localized(additions.preview?.problem),
      role: localized(additions.preview?.role),
      outcome: localized(additions.preview?.outcome),
    },
    metrics: cleanMetrics(additions.metrics),
    impact: cleanLocalizedList(additions.impact),
    technologies: cleanList(additions.technologies),
    stackGroups: cleanStackGroups(additions.stackGroups),
    components: cleanComponents(additions.components),
    decisions: cleanDecisions(additions.decisions),
    tradeoffs: cleanLocalizedList(additions.tradeoffs),
    lessons: cleanLocalizedList(additions.lessons),
    architecture,
    walkthrough: cleanWalkthrough(additions.walkthrough, architecture),
    evidence: Array.isArray(additions.evidence) ? additions.evidence : [],
    confidentiality: {
      level: additions.confidentiality || '',
      note: confidentialityNote,
    },
  };
}

export const CASES = caseDefinitions
  .map(({ slug, ...additions }) => normalizeCase(slug, additions))
  .sort((a, b) => a.order - b.order);

export function getCaseBySlug(slug) {
  if (!slug) return null;
  return CASES.find(item => item.slug === slug || item.aliases.includes(slug)) || null;
}

export function getAdjacentCase(slug) {
  const index = CASES.findIndex(item => item.slug === slug);
  if (index < 0 || CASES.length < 2) return null;
  return CASES[(index + 1) % CASES.length];
}

export function caseUrl(item) {
  return '/cases/' + encodeURIComponent(item.slug);
}

export function caseText(value, lang = 'pt') {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value[lang] || value.pt || '';
}

const TECHNOLOGY_LABELS = {
  'Aplicativo mobile': { pt: 'Aplicativo mobile', en: 'Mobile app' },
  'Documentos fiscais': { pt: 'Documentos fiscais', en: 'Tax documents' },
};

export function caseTechnologyText(value, lang = 'pt') {
  return caseText(TECHNOLOGY_LABELS[value], lang) || value;
}

export const CASE_CATEGORIES = {
  fiscal: { pt: 'Fiscal e ERP', en: 'Tax and ERP' },
  operacoes: { pt: 'Operações e SST', en: 'Operations and safety' },
  'inteligencia-comercial': { pt: 'IA e inteligência comercial', en: 'AI and sales intelligence' },
  academias: { pt: 'Gestão de academias', en: 'Gym management' },
};

export const CASE_DOMAINS = {
  'documentos-fiscais': { pt: 'Documentos fiscais', en: 'Tax documents' },
  'integracao-erp': { pt: 'Integração ERP', en: 'ERP integration' },
  'seguranca-do-trabalho': { pt: 'Segurança do trabalho', en: 'Workplace safety' },
  'gestao-de-pessoas': { pt: 'Gestão de pessoas', en: 'People operations' },
  prospeccao: { pt: 'Prospecção', en: 'Prospecting' },
  'busca-empresarial': { pt: 'Busca empresarial', en: 'Company search' },
  'gestao-de-alunos': { pt: 'Gestão de alunos', en: 'Member management' },
  'cobranca-recorrente': { pt: 'Cobrança recorrente', en: 'Recurring billing' },
  'multiunidade': { pt: 'Operação multiunidade', en: 'Multi-location operations' },
};

const METRIC_STATUS = {
  estimated: { pt: 'Estimativa', en: 'Estimate' },
  illustrative: { pt: 'Exemplo visual', en: 'Visual example' },
};

// Só métricas estimadas/ilustrativas têm rótulo. Confirmadas, de escopo e placeholders retornam ''
// — nesse caso o renderer não cria o elemento .metric__status.
export function metricStatusText(metric, lang = 'pt') {
  return caseText(METRIC_STATUS[metric?.basis], lang);
}

export function isProvisionalMetric(metric) {
  return Boolean(metric && (metric.estimated || metric.illustrative));
}

// Métrica de destaque do case: a primeira da lista (a ordem editorial já põe a principal no topo).
export function leadMetric(item) {
  const metrics = item?.metrics || [];
  return metrics.find(m => !isProvisionalMetric(m)) || metrics[0] || null;
}

// As n primeiras métricas são as "métricas-chave" exibidas em destaque.
export function keyMetrics(item, n = 3) {
  return (item?.metrics || []).slice(0, Math.max(0, n));
}
