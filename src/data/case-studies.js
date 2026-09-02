export const CASE_STUDIES = {
  gestaoFiscal: {
    name: { pt: 'Gestão Fiscal', en: 'Tax Management' },
    subtitle: {
      pt: 'SaaS de Gestão de Documentos Fiscais (NF-e/NFS-e/CT-e)',
      en: 'Tax Document Management SaaS (Brazilian NF-e/NFS-e/CT-e)',
    },
    color: '#f97373',
    problem: {
      pt: 'Empresas precisam emitir, captar e gerenciar documentos fiscais eletrônicos (NF-e/NFS-e/CT-e) e integrá-los a ERPs como o Linx, cuja entrada normalmente é manual.',
      en: 'Companies need to issue, capture and manage electronic tax documents (NF-e/NFS-e/CT-e) and integrate them with ERPs like Linx, where data entry is normally manual.',
    },
    solution: [
      { pt: 'Captação automática de notas fiscais', en: 'Automatic invoice capture' },
      { pt: 'Visualização e download do XML e PDF', en: 'XML and PDF viewing and download' },
      { pt: 'Automação de validação e inserção automática da nota no ERP Linx', en: 'Automated validation and insertion of invoices into the Linx ERP' },
      { pt: 'VPN para comunicação com o on-premise do cliente que usa o Linx (servidor próprio de cada empresa)', en: "VPN connecting to each client's on-premise Linx server" },
    ],
    components: [
      {
        name: { pt: 'Backend de Processamento', en: 'Processing Backend' },
        stack: 'Bun · Fastify 5 · Prisma · MySQL 8 · RabbitMQ · AWS S3 · Zod · n8n',
        desc: {
          pt: 'APIs de captação, validação e gestão de documentos fiscais, com filas assíncronas, PDF/XML e armazenamento S3.',
          en: 'APIs for capturing, validating and managing tax documents, with async queues, PDF/XML handling and S3 storage.',
        },
      },
      {
        name: { pt: 'Painel Administrativo', en: 'Admin Panel' },
        stack: 'Laravel 8 · PHP 8.2 · Blade · MySQL',
        desc: {
          pt: 'Backoffice de gestão fiscal, faturamento, usuários e visualização/download de documentos.',
          en: 'Back office for tax management, billing, users and document viewing/download.',
        },
      },
      {
        name: { pt: 'Integração ERP Linx', en: 'Linx ERP Integration' },
        stack: { pt: 'Automação de validação e inserção de notas', en: 'Automated invoice validation and insertion' },
        desc: {
          pt: 'Automatiza a inserção de notas fiscais no ERP Linx, eliminando o processo manual.',
          en: 'Automates invoice insertion into the Linx ERP, eliminating the manual process.',
        },
      },
      {
        name: { pt: 'Agente de Conectividade (VPN)', en: 'Connectivity Agent (VPN)' },
        stack: 'C# .NET · Windows Service · WireGuard',
        desc: {
          pt: 'Mantém túnel seguro até o on-premise do cliente que usa o Linx, viabilizando a comunicação.',
          en: "Maintains a secure tunnel to the client's on-premise Linx server, enabling communication.",
        },
      },
      {
        name: { pt: 'Ferramenta de Deploy', en: 'Deployment Tool' },
        stack: 'C# .NET 8 · WPF · Installer · GitHub Actions',
        desc: {
          pt: 'Instalador Windows automatizado para provisionamento em máquinas de clientes.',
          en: 'Automated Windows installer for provisioning on client machines.',
        },
      },
    ],
    domainChallenges: [
      { pt: 'Legislação e webservices SEFAZ com certificados digitais A1/A3', en: 'Brazilian tax law and SEFAZ webservices with A1/A3 digital certificates' },
      { pt: 'Captação e validação automáticas de notas em alta escala', en: 'Automatic invoice capture and validation at scale' },
      { pt: 'Integração com ERP Linx, que opera on-premise por cliente', en: 'Integration with the Linx ERP, which runs on-premise per client' },
      { pt: 'Comunicação segura com ambientes on-premise via VPN', en: 'Secure communication with on-premise environments over VPN' },
    ],
    engineeringHighlights: [
      { pt: 'Arquitetura em camadas (controllers → services → models → integrations)', en: 'Layered architecture (controllers → services → models → integrations)' },
      { pt: 'Type-safety com Zod + Fastify type provider', en: 'Type safety with Zod + Fastify type provider' },
      { pt: 'Processamento assíncrono com filas (RabbitMQ) e automação (n8n)', en: 'Asynchronous processing with queues (RabbitMQ) and automation (n8n)' },
      { pt: 'Deploy automatizado Windows (WPF) com CI/CD', en: 'Automated Windows deployment (WPF) with CI/CD' },
    ],
    impact: {
      pt: 'SaaS de gestão de documentos fiscais em produção, integrado a ERPs do mercado, com volume considerável de notas captadas e processadas automaticamente.',
      en: 'Tax document management SaaS in production, integrated with market ERPs, automatically capturing and processing a considerable volume of invoices.',
    },
    confidential: true,
  },
  landingWebinar: {
    name: { pt: 'Landing Page Webinar', en: 'Webinar Landing Page' },
    subtitle: {
      pt: 'Landing de Captura de Leads para Webinar',
      en: 'Lead Capture Landing Page for a Webinar',
    },
    color: '#ff6b9d',
    problem: {
      pt: 'Capturar inscrições/leads para eventos e webinars de forma simples e rápida.',
      en: 'Capture sign-ups and leads for events and webinars quickly and simply.',
    },
    solution: [
      { pt: 'Landing page otimizada para inscrição em webinar', en: 'Landing page optimized for webinar sign-ups' },
      { pt: 'Captura de leads e conversão de visitantes em inscritos', en: 'Lead capture converting visitors into registrants' },
    ],
    components: [
      {
        name: { pt: 'Landing Page', en: 'Landing Page' },
        stack: 'React · TypeScript · Vercel',
        desc: {
          pt: 'Página responsiva para captação de inscrições em webinar.',
          en: 'Responsive page for capturing webinar registrations.',
        },
      },
    ],
    domainChallenges: [
      { pt: 'Conversão e experiência mobile', en: 'Conversion and mobile experience' },
    ],
    engineeringHighlights: [
      { pt: 'Deploy contínuo na Vercel', en: 'Continuous deployment on Vercel' },
      { pt: 'Performance otimizada com lazy loading', en: 'Performance optimized with lazy loading' },
    ],
    impact: {
      pt: 'Landing page de campanha para captação de inscrições em webinars.',
      en: 'Campaign landing page for capturing webinar registrations.',
    },
    confidential: true,
  },
};
