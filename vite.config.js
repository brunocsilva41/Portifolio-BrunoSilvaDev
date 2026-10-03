import { existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import { outFileForRoute, templateForPath } from './scripts/lib/routes.mjs';

// Rotas limpas em dev/preview: a URL no navegador não muda (getLang e o slug leem o pathname).
function rewriteUrl(req, resolveFile) {
  const [pathname, query = ''] = (req.url || '/').split('?');
  const template = templateForPath(pathname);
  if (!template) return;
  const file = resolveFile ? resolveFile(pathname, template) : template;
  req.url = '/' + file + (query ? '?' + query : '');
}

function cleanRoutes() {
  let outDir = 'dist';
  return {
    name: 'portfolio-clean-routes',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewriteUrl(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        // Depois do prerender existe dist/<rota>.html; sem ele, cai no template.
        rewriteUrl(req, (pathname, template) => {
          const clean = pathname.replace(/\/+$/, '') || '/';
          const prerendered = outFileForRoute(clean);
          return existsSync(path.join(outDir, prerendered)) ? prerendered : template;
        });
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [cleanRoutes()],
  // Mesmo domínio canônico no bundle e no prerender (src/config/seo.js).
  define: {
    'import.meta.env.SITE_URL': JSON.stringify(process.env.SITE_URL || ''),
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        space: 'space.html',
        cases: 'cases.html',
        case: 'case.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
        },
      },
    },
    chunkSizeWarningLimit: 300,
  },
});
