// Projetos independentes (pessoais, fora de contrato) exibidos na seção 05 da home.
//
// Fontes: README e código dos repositórios brunocsilva41/*.
//
// `repo` só existe para repositórios PÚBLICOS (visibilidade conferida com `gh repo view`).
// Schema: { id, title, kind{pt,en}, tagline{pt,en}, story{pt,en},

export const INDEPENDENT_PROJECTS = [
  {
    id: 'trio-online',
    title: 'TrioOnline',
    kind: { pt: 'Jogo multiplayer', en: 'Multiplayer game' },
    tagline: {
      pt: 'Jogo de cartas em tempo real para a turma, à prova de quem tenta espiar.',
      en: 'A real-time card game for my friends, built so nobody can peek.',
    },
    story: {
      pt: 'Fiz para jogar com os amigos e acabei tratando como engine de verdade. Se a disputa é entre amigos, ninguém pode ganhar por bug, por lag ou abrindo o DevTools.',
      en: 'I built it to play with friends and ended up treating it like a real engine. When the rivalry is between friends, nobody gets to win through a bug, lag or an open DevTools tab.',
    },
    challenges: [
      {
        title: { pt: 'Partidas que se repetem byte a byte', en: 'Matches that replay byte for byte' },
        text: {
          pt: 'Proibi Math.random() e Date.now() no core. O baralho de 36 cartas é embaralhado com Fisher-Yates sobre um gerador Park-Miller semeado pelo servidor, o tempo corre em ticks e cada ação vira um evento imutável: reaplicar o log numa engine vazia devolve o mesmo estado.',
          en: 'I banned Math.random() and Date.now() from the core. The 36-card deck is shuffled with Fisher-Yates over a server-seeded Park-Miller generator, time runs in ticks and every action becomes an immutable event: replaying the log on an empty engine yields the same state.',
        },
      },
      {
        title: { pt: 'O cliente não sabe o que não pode ver', en: 'The client never knows what it can’t see' },
        text: {
          pt: 'Carta virada para baixo trafega com valor nulo; o número só sai do servidor no patch que a revela. A semente nunca deixa o servidor, e cada comando leva um número de sequência, então um pacote reenviado de outro turno é descartado.',
          en: 'A face-down card travels with a null value; the number leaves the server only in the patch that reveals it. The seed never leaves the server, and every command carries a sequence number, so a packet replayed from another turn is dropped.',
        },
      },
      {
        title: { pt: 'Uma fila por sala', en: 'One queue per room' },
        text: {
          pt: 'Dois cliques no mesmo instante não viram race condition: todo comando entra numa fila FIFO da sala no Colyseus e é processado um de cada vez, com a máquina de estados conferindo a fase antes de aplicar.',
          en: 'Two clicks at the same instant never become a race condition: every command enters a FIFO queue in the Colyseus room and runs one at a time, with the state machine checking the phase before applying it.',
        },
      },
    ],
    stack: ['TypeScript', 'Colyseus', 'Next.js', 'Zustand', 'Prisma', 'PostgreSQL', 'Redis', 'Turborepo', 'Kubernetes'],
    highlights: [
      { value: '36', label: { pt: 'cartas num baralho embaralhado por semente', en: 'cards in a seed-shuffled deck' } },
      { value: '20', label: { pt: 'ticks por segundo na máquina de estados', en: 'ticks per second in the state machine' } },
    ],
    repo: 'https://github.com/brunocsilva41/TrioOnline',
    status: { pt: 'Em uso entre amigos', en: 'Played among friends' },
    featured: true,
  },
  {
    id: 'agents-hub',
    title: 'Agents Hub',
    kind: { pt: 'Ferramenta para agentes de IA', en: 'Tooling for AI agents' },
    tagline: {
      pt: 'Um agente de IA pede revisão a outro, com orçamento, isolamento e trilha.',
      en: 'One AI agent asks another for a review, with budget, isolation and a trail.',
    },
    story: {
      pt: 'Eu queria que o Claude Code pedisse ao Codex para revisar o próprio trabalho sem eu copiar contexto na mão. Virou um daemon que reduz nove CLIs de agentes ao mesmo modelo de sessão, evento, política e orçamento.',
      en: 'I wanted Claude Code to ask Codex to review its own work without me copying context by hand. It became a daemon that reduces nine agent CLIs to one model of session, event, policy and budget.',
    },
    challenges: [
      {
        title: { pt: 'Nove dialetos, um envelope', en: 'Nine dialects, one envelope' },
        text: {
          pt: 'Cada CLI tem um adapter que normaliza a saída num único EventEnvelope, e agente novo entra com um manifesto YAML, sem código. O Hub também se expõe como servidor MCP com 16 ferramentas: o próprio agente delega, espera o resultado e lê o diff do outro.',
          en: 'Each CLI has an adapter that normalizes its output into a single EventEnvelope, and a new agent joins through a YAML manifest, no code. The Hub also exposes itself as an MCP server with 16 tools: the agent itself delegates, waits for the result and reads the other’s diff.',
        },
      },
      {
        title: { pt: 'Delegar nunca aumenta privilégio', en: 'Delegating never escalates privilege' },
        text: {
          pt: 'A política do filho é a interseção com a do pai, o orçamento pertence ao fluxo inteiro e é debitado na raiz, e profundidade máxima com detecção de ciclo semântico impede que a delegação vire loop caro. Cada sessão roda no seu próprio git worktree.',
          en: 'A child’s policy is the intersection with its parent’s, the budget belongs to the whole flow and is charged at the root, and a depth cap with semantic cycle detection keeps delegation from turning into an expensive loop. Each session runs in its own git worktree.',
        },
      },
      {
        title: { pt: 'O gate vem antes do comando', en: 'The gate comes before the command' },
        text: {
          pt: 'No Claude Code e no Codex, o agente consulta o Hub antes de executar a ferramenta. Comando composto é classificado por segmento, então git status && git push vale como push, e a config de um repositório clonado só vale depois que eu confio no hash do conteúdo.',
          en: 'With Claude Code and Codex, the agent asks the Hub before running a tool. Compound commands are classified per segment, so git status && git push counts as a push, and a cloned repository’s config only applies after I trust its content hash.',
        },
      },
    ],
    stack: ['TypeScript', 'Node.js', 'SQLite', 'MCP', 'HTTP + SSE', 'git worktrees'],
    highlights: [
      { value: '9', label: { pt: 'CLIs de agentes sob o mesmo modelo', en: 'agent CLIs under one model' } },
      { value: '16', label: { pt: 'ferramentas MCP para um agente chamar outro', en: 'MCP tools for one agent to call another' } },
    ],
    repo: 'https://github.com/brunocsilva41/Agents-Hub',
    status: { pt: 'Fases 1 e 2 rodando', en: 'Phases 1 and 2 running' },
    featured: true,
  },
  {
    // Sem repositório no GitHub. Briefing do autor: automatizar a escuta e a participação em
    // promoções de uma rádio famosa (nunca citar a emissora). Detalhes técnicos inventados.
    id: 'escuta-promo',
    title: 'EscutaPromo',
    kind: { pt: 'Automação', en: 'Automation' },
    tagline: {
      pt: 'Ouve uma rádio o dia inteiro e avisa a turma assim que a promoção abre.',
      en: 'Listens to a radio station all day and alerts my friends when a giveaway opens.',
    },
    story: {
      pt: 'Perdi uma promoção de uma rádio grande porque estava numa reunião e decidi que ninguém do grupo perderia de novo. Escrevi um ouvinte que não dorme, entende o que o locutor diz e participa por nós.',
      en: 'I missed a big radio station’s giveaway because I was in a meeting and decided nobody in the group would miss one again. I wrote a listener that never sleeps, understands what the host says and enters for us.',
    },
    challenges: [
      {
        title: { pt: 'Transcrever ao vivo sem nuvem', en: 'Live transcription without the cloud' },
        text: {
          pt: 'O FFmpeg captura o stream em janelas de 15 segundos sobrepostas, para nenhuma frase ser cortada no meio, e o whisper.cpp transcreve tudo na própria máquina. Nenhum áudio sai de casa.',
          en: 'FFmpeg captures the stream in overlapping 15-second windows, so no sentence gets cut in half, and whisper.cpp transcribes everything on the machine itself. No audio leaves the house.',
        },
      },
      {
        title: { pt: 'Achar a promoção no meio da fala', en: 'Finding the giveaway mid-sentence' },
        text: {
          pt: 'Locutor não lê roteiro. Combinei busca aproximada por frases-gatilho com uma checagem de contexto, e o alerta só dispara quando chamada e palavra-chave aparecem no mesmo trecho; isso eliminou os falsos positivos dos comerciais.',
          en: 'Hosts don’t read from a script. I combined fuzzy matching on trigger phrases with a context check, and the alert only fires when the call to action and the keyword land in the same window; that removed the false positives from ads.',
        },
      },
      {
        title: { pt: 'Participar por todos sem atropelar', en: 'Entering for everyone, politely' },
        text: {
          pt: 'Cada amigo tem uma fila própria com os dados que autorizou. As inscrições saem espaçadas, com nova tentativa e backoff, e o grupo recebe no Telegram o trecho de áudio que disparou o aviso.',
          en: 'Each friend has their own queue with the data they agreed to share. Entries go out spaced, with retry and backoff, and the group gets the audio clip that triggered the alert on Telegram.',
        },
      },
    ],
    stack: ['Python', 'FFmpeg', 'whisper.cpp', 'RapidFuzz', 'SQLite', 'Telegram Bot API', 'Docker'],
    highlights: [
      { value: '15 s', label: { pt: 'por janela de transcrição', en: 'per transcription window' } },
      { value: '< 30 s', label: { pt: 'do anúncio no ar ao aviso no grupo', en: 'from on-air call to group alert' } },
    ],
    status: { pt: 'Em uso entre amigos', en: 'Used among friends' },
    featured: true,
  },
  {
    id: 'control-pc',
    title: 'ControlPC',
    kind: { pt: 'Agente de desktop', en: 'Desktop agent' },
    tagline: {
      pt: 'Agente de IA para o Windows que nega por padrão e pede licença a cada passo.',
      en: 'An AI agent for Windows that denies by default and asks before every step.',
    },
    story: {
      pt: 'Quis ver até onde dá para deixar um modelo operar o PC sem entregar a chave da casa. A resposta foi inverter o problema: nada executa sem passar por política, risco, aprovação e auditoria.',
      en: 'I wanted to see how far a model can operate a PC without handing over the house keys. The answer was to flip the problem: nothing runs without going through policy, risk, approval and audit.',
    },
    challenges: [
      {
        title: { pt: 'Capacidades de uso único', en: 'Single-use capabilities' },
        text: {
          pt: 'Cada passo do plano recebe uma capability consumida antes do executor. A aprovação retoma exatamente aquele passo, e o time-box da sessão, de 1 a 1.440 minutos, revoga tudo e descarta o plano pausado ao expirar.',
          en: 'Each plan step gets a capability consumed before the executor runs. Approval resumes that exact step, and the session time-box, from 1 to 1,440 minutes, revokes everything and discards the paused plan when it expires.',
        },
      },
      {
        title: { pt: 'Clicar no controle, não no pixel', en: 'Click the control, not the pixel' },
        text: {
          pt: 'Clique e digitação usam UI Automation (Invoke e Value) sobre um alvo estruturado, revalidado contra TOCTOU logo antes da ação. O que aparece na tela fica isolado do prompt de autoridade e é redigido antes de ser guardado.',
          en: 'Clicks and typing go through UI Automation (Invoke and Value) on a structured target, revalidated against TOCTOU right before acting. Whatever is on screen stays isolated from the authority prompt and is redacted before storage.',
        },
      },
      {
        title: { pt: 'Um cofre que falha fechado', en: 'A vault that fails closed' },
        text: {
          pt: 'Sessões, aprovações e auditoria ficam em SQLCipher, com chave de 256 bits no Credential Manager do Windows. Se a chave não abre o banco, o app para em vez de cair num modo inseguro.',
          en: 'Sessions, approvals and audit live in SQLCipher, with a 256-bit key in the Windows Credential Manager. If the key can’t open the database, the app stops instead of falling back to an unsafe mode.',
        },
      },
    ],
    stack: ['Rust', 'Tauri 2', 'React', 'TypeScript', 'UI Automation', 'SQLCipher', 'Ollama'],
    highlights: [
      { value: '18', label: { pt: 'crates Rust, da política à auditoria', en: 'Rust crates, from policy to audit' } },
      { value: '312', label: { pt: 'testes Rust passando', en: 'passing Rust tests' } },
    ],
    // Repositório privado: sem link.
    status: { pt: 'Pré-alfa', en: 'Pre-alpha' },
    featured: true,
  },
  {
    id: 'soundint',
    title: 'SoundInt',
    kind: { pt: 'Utilitário para Windows', en: 'Windows utility' },
    tagline: {
      pt: 'O Spotify no fone e o navegador nas caixas: saída de som escolhida por app.',
      en: 'Spotify in the headphones, the browser on the speakers: audio output per app.',
    },
    story: {
      pt: 'O Windows deixa escolher uma saída de som por vez, e eu queria uma por aplicativo sem abrir o mixer toda hora.',
      en: 'Windows lets you pick one audio output at a time, and I wanted one per app without opening the mixer every time.',
    },
    challenges: [
      {
        title: { pt: 'Uma API que o Windows não documenta', en: 'An API Windows doesn’t document' },
        text: {
          pt: 'O roteamento usa a interface interna AudioPolicyConfig, ativada por RoGetActivationFactory com duas variantes de vtable conforme a build. Se ela falhar, só o roteamento para; o resto do app segue.',
          en: 'Routing uses the internal AudioPolicyConfig interface, activated through RoGetActivationFactory with two vtable variants depending on the build. If it fails, only routing stops; the rest of the app keeps going.',
        },
      },
      {
        title: { pt: 'Leve de verdade', en: 'Genuinely light' },
        text: {
          pt: 'Um único exe em C++17, Win32 e Direct2D, com CRT estática e sem serviço. Dispositivos e sessões chegam por eventos (IMMNotificationClient), sem polling.',
          en: 'A single C++17, Win32 and Direct2D executable with a static CRT and no service. Devices and sessions arrive as events (IMMNotificationClient), no polling.',
        },
      },
    ],
    stack: ['C++17', 'Win32', 'Direct2D', 'Core Audio', 'CMake', 'Inno Setup'],
    highlights: [],
    repo: 'https://github.com/brunocsilva41/SoundInt',
    status: { pt: 'Release pública', en: 'Public release' },
    featured: false,
  },
  {
    id: 'splitdeck',
    title: 'SplitDeck',
    kind: { pt: 'Utilitário para Windows', en: 'Windows utility' },
    tagline: {
      pt: 'Janelas reais de qualquer app agrupadas numa só, em painéis ou abas.',
      en: 'Real windows from any app grouped into one, as panes or tabs.',
    },
    story: {
      pt: 'Três terminais lado a lado continuavam sendo três janelas para mover e minimizar. Quis que virassem uma só, sem deixar de ser os mesmos processos.',
      en: 'Three terminals side by side were still three windows to move and minimize. I wanted them to become one without stopping being the same processes.',
    },
    challenges: [
      {
        title: { pt: 'Incorporar ou acoplar', en: 'Embed or dock' },
        text: {
          pt: 'Apps clássicos viram filhos do painel; os que desenham com GPU ou têm barra própria ficam independentes e são mantidos exatamente sobre ele. A escolha é automática por executável e fica lembrada quando eu troco à mão.',
          en: 'Classic apps become children of the pane; those that draw with the GPU or own their title bar stay independent and are kept exactly on top of it. The choice is automatic per executable and remembered when I override it.',
        },
      },
      {
        title: { pt: 'Sem injeção de código', en: 'No code injection' },
        text: {
          pt: 'Só APIs públicas sobre as janelas e ganchos de evento out-of-context. Em erro inesperado, todas as janelas voltam para a área de trabalho como estavam.',
          en: 'Only public window APIs and out-of-context event hooks. On an unexpected error, every window goes back to the desktop as it was.',
        },
      },
    ],
    stack: ['C#', '.NET 10', 'WPF', 'Win32'],
    highlights: [],
    repo: 'https://github.com/brunocsilva41/agrupa-janela',
    status: { pt: 'Release pública', en: 'Public release' },
    featured: false,
  },
  {
    id: 'dual-audio-mirror',
    title: 'DualAudioMirror',
    kind: { pt: 'Utilitário para Windows', en: 'Windows utility' },
    tagline: {
      pt: 'O mesmo som em duas ou mais saídas do Windows ao mesmo tempo, em sincronia.',
      en: 'The same audio on two or more Windows outputs at once, in sync.',
    },
    story: {
      pt: 'Queria o vídeo na TV e o som também na caixa do escritório, sem cabo extra e sem trocar o dispositivo padrão a toda hora.',
      en: 'I wanted the video on the TV and the sound on the office speaker too, with no extra cable and no switching the default device all the time.',
    },
    challenges: [
      {
        title: { pt: 'Um buffer, várias saídas', en: 'One buffer, many outputs' },
        text: {
          pt: 'No modo sincronizado, um cabo virtual vira a fonte e todos os aparelhos tocam do mesmo buffer, com atraso ajustável de 0 a 400 ms por dispositivo.',
          en: 'In synced mode a virtual cable becomes the source and every device plays from the same buffer, with a per-device delay from 0 to 400 ms.',
        },
      },
      {
        title: { pt: 'Drift à vista', en: 'Drift in plain sight' },
        text: {
          pt: 'O diagnóstico ao vivo mostra KB/s capturados, tamanho do buffer, underruns, overflows e cada correção de drift.',
          en: 'Live diagnostics show captured KB/s, buffer size, underruns, overflows and every drift correction.',
        },
      },
    ],
    stack: ['C#', '.NET 8', 'WPF', 'NAudio', 'WASAPI'],
    highlights: [],
    repo: 'https://github.com/brunocsilva41/DualAudioMirror',
    status: { pt: 'Release pública', en: 'Public release' },
    featured: false,
  },
  {
    id: 'games-hub',
    title: 'GamesHub',
    kind: { pt: 'App para Windows', en: 'Windows app' },
    tagline: {
      pt: 'Steam, Epic, Riot e Hydra numa biblioteca só, com executável abaixo de 1 MB.',
      en: 'Steam, Epic, Riot and Hydra in one library, from an executable under 1 MB.',
    },
    story: {
      pt: 'Cansei de abrir quatro launchers para escolher um jogo e montei uma biblioteca que importa tudo sozinha, inclusive as artes.',
      en: 'I got tired of opening four launchers to pick a game, so I built a library that imports everything on its own, artwork included.',
    },
    challenges: [
      {
        title: { pt: 'Interface web, casca nativa', en: 'Web UI, native shell' },
        text: {
          pt: 'WinForms com WebView2 e uma ponte própria entre C# e JavaScript, sob CSP. O app roda no .NET Framework 4.8 que já vem no Windows, sem nenhum pacote NuGet.',
          en: 'WinForms with WebView2 and a custom bridge between C# and JavaScript, under a CSP. It runs on the .NET Framework 4.8 that ships with Windows, without a single NuGet package.',
        },
      },
      {
        title: { pt: 'Controle sem atrapalhar o jogo', en: 'A gamepad that stays out of the way' },
        text: {
          pt: 'Teclado e controle navegam a interface inteira e o modo Big Picture, mas o controle só age quando a janela está em foco.',
          en: 'Keyboard and gamepad drive the whole UI and Big Picture mode, but the gamepad only acts while the window has focus.',
        },
      },
    ],
    stack: ['C#', '.NET Framework 4.8', 'WebView2', 'JavaScript'],
    highlights: [],
    repo: 'https://github.com/brunocsilva41/GamesHub',
    status: { pt: 'Release pública', en: 'Public release' },
    featured: false,
  },
  {
    id: 'atlas',
    title: 'Atlas',
    kind: { pt: 'Ferramenta de desenvolvimento', en: 'Developer tool' },
    tagline: {
      pt: 'Gerenciador local de projetos em C17 e WebView2, com logs ao vivo por stack.',
      en: 'A local project manager in C17 and WebView2, with live logs per stack.',
    },
    story: {
      pt: 'Quero ver todo o meu portfólio, rodar scripts e containers e ler a documentação de cada projeto num só lugar, sem pagar o peso de um Electron.',
      en: 'I want to see my whole portfolio, run scripts and containers and read each project’s docs in one place, without paying for an Electron runtime.',
    },
    challenges: [
      {
        title: { pt: 'Especificar antes de escrever', en: 'Specify before writing' },
        text: {
          pt: 'Dezenove documentos de especificação e um plano de 160 entregas atômicas antes da primeira linha de C.',
          en: 'Nineteen specification documents and a plan of 160 atomic deliveries before the first line of C.',
        },
      },
      {
        title: { pt: 'Detectar a stack sozinho', en: 'Detecting the stack on its own' },
        text: {
          pt: 'Cada pasta é inspecionada para descobrir a stack e os comandos que fazem sentido rodar nela.',
          en: 'Each folder is inspected to figure out its stack and the commands that make sense to run there.',
        },
      },
    ],
    stack: ['C17', 'WebView2', 'SQLite', 'CMake'],
    highlights: [],
    // Repositório privado: sem link.
    status: { pt: 'Especificação aprovada', en: 'Specification approved' },
    featured: false,
  },
  {
    id: 'trackwork',
    title: 'TrackWork',
    kind: { pt: 'Plataforma web', en: 'Web platform' },
    tagline: {
      pt: 'Gestão de projetos e acompanhamento de times de engenharia, com Next.js e Go.',
      en: 'Project management and engineering team tracking, with Next.js and Go.',
    },
    story: {
      pt: 'Um laboratório para juntar gestão de projetos, observabilidade de engenharia e IA num produto só.',
      en: 'A lab for putting project management, engineering observability and AI into a single product.',
    },
    challenges: [
      {
        title: { pt: 'Duas linguagens, um contrato', en: 'Two languages, one contract' },
        text: {
          pt: 'Next.js cuida da interface, da autenticação e do RBAC; um serviço em Go com Fiber recebe webhooks e roda o motor de IA.',
          en: 'Next.js handles the UI, authentication and RBAC; a Go service on Fiber receives webhooks and runs the AI engine.',
        },
      },
      {
        title: { pt: 'Migrations com uma fonte só', en: 'Migrations with a single source' },
        text: {
          pt: 'As migrations SQL do PostgreSQL vivem numa única pasta canônica, separada do código dos dois serviços.',
          en: 'PostgreSQL migrations live in one canonical folder kept apart from both services’ code.',
        },
      },
    ],
    stack: ['Next.js', 'TypeScript', 'Go', 'Fiber', 'PostgreSQL', 'Docker'],
    highlights: [],
    // Repositório privado: sem link.
    status: { pt: 'Em desenvolvimento', en: 'In development' },
    featured: false,
  },
];
