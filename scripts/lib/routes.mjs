// Mapa rota → template, compartilhado pelo vite.config.js (dev/preview), pelo prerender e pelo
// servidor local de verificação. Sem dependências: o vite.config.js importa este arquivo.

const SLUG = '[a-z0-9][a-z0-9-]*';
const CASE_RE = new RegExp(`^(?:/en)?/cases/(${SLUG})/?$`);

/** Template (arquivo em dist/ ou na raiz em dev) que renderiza um pathname limpo, ou null. */
export function templateForPath(pathname) {
  const path = String(pathname || '/');
  if (path === '/en' || path === '/en/') return 'index.html';
  if (path === '/cases' || path === '/cases/' || path === '/en/cases' || path === '/en/cases/') return 'cases.html';
  if (CASE_RE.test(path)) return 'case.html';
  if (path === '/space' || path === '/space/') return 'space.html';
  return null;
}

/** Slug de um pathname /cases/<slug> ou /en/cases/<slug>. */
export function slugFromPath(pathname) {
  const match = CASE_RE.exec(String(pathname || ''));
  return match ? match[1] : '';
}

/** Arquivo gerado em dist/ para uma rota limpa (convenção cleanUrls da Vercel). */
export function outFileForRoute(route) {
  if (route === '/') return 'index.html';
  if (route === '/en') return 'en/index.html';
  return route.replace(/^\//, '') + '.html';
}

/**
 * Rotas prerenderizadas. `pagePath` vem de src/config/seo.js (injetado para manter este
 * arquivo livre de imports do app).
 */
export function buildRoutes({ cases, pagePath }) {
  const routes = [];
  for (const lang of ['pt', 'en']) {
    routes.push({ page: 'home', lang, template: 'index.html' });
    routes.push({ page: 'cases', lang, template: 'cases.html' });
    for (const item of cases) routes.push({ page: 'case', lang, slug: item.slug, item, template: 'case.html' });
  }
  for (const route of routes) {
    route.path = pagePath({ page: route.page, lang: route.lang, slug: route.slug });
    route.out = outFileForRoute(route.path);
    // ?slug= mantém compatibilidade com o runtime que ainda lê o slug da query.
    route.loadPath = route.page === 'case' ? `${route.path}?slug=${encodeURIComponent(route.slug)}` : route.path;
    route.indexable = true;
  }
  // 404: case inexistente renderiza o estado de erro do template de case.
  routes.push({
    page: 'notfound',
    lang: 'pt',
    template: 'case.html',
    path: '/404',
    out: '404.html',
    loadPath: '/cases/nao-encontrado?slug=nao-encontrado',
    indexable: false,
  });
  return routes;
}
