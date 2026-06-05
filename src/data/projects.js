export const projects = [
  {
    id: "[PROJ_01]",
    slug: "VortekZero",
    icon: "Globe",
    title: "Vortek Zero Portfolio",
    desc: "Ambiente de comando pessoal. Interface imersiva com visualizações 3D e telemetria live.",
    longDesc: "Portfólio interativo que funciona como um terminal de comando pessoal. Construído com React e Three.js, apresenta uma experiência imersiva com visualizações 3D, animações de partículas, janelas arrastáveis e uma interface inspirada em sistemas de controle.",
    tags: ["React", "Three.js", "Vite", "CSS", "GSAP"],
    status: "STABLE",
    url: "/project/VortekZero",
    features: [
      "Renderização 3D com Three.js e React Three Fiber",
      "Sistema de partículas interativo com parallax",
      "Tema escuro com estética de terminal e boot sequence",
      "Janelas arrastáveis com física suave",
      "Seção de contato com protocolo de uplink seguro",
      "Scroll reveal animado com Intersection Observer",
    ],
    secret: {
      type: "images",
      folder: "/vortekcardphotos",
      centerLogo: "/vortekcardphotos/Logo.png",
      files: [
        { name: "fotovorket1.png", isScreenshot: true },
        { name: "fotovortek2.png", isScreenshot: true }
      ]
    }
  },
  {
    id: "[PROJ_02]",
    slug: "LunaOS",
    icon: "Bot",
    title: "Luna AI Agent",
    desc: "Agente inteligente autônomo para automatização de tarefas e processamento de linguagem natural.",
    longDesc: "Luna é um agente de IA autônomo projetado para processar linguagem natural e executar automações complexas. O sistema utiliza diversas APIs de IA, tendo como principal a Gemini API, além de possuir um modo local executando LLMs Qwen. Luna integra-se a ferramentas como Google e n8n, sendo capaz de acessar a web, pesquisar e navegar via análise direta da estrutura DOM.",
    tags: ["Python", "Gemini API", "n8n", "Qwen LLM", "Docker"],
    status: "IN_PROCESS",
    url: "/project/LunaOS",
    features: [
      "Orquestração híbrida de IA (Gemini API & Qwen local)",
      "Automação de fluxos complexos integrados com n8n",
      "Acesso à web, pesquisa e navegação inteligente",
      "Análise e manipulação de estrutura DOM em tempo real",
      "Integração profunda com ferramentas e APIs Google",
      "Execução assíncrona com filas de processos de background",
    ],
    secret: {
      type: "images",
      folder: "/Lunaaicardphotos",
      centerLogo: "/Lunaaicardphotos/logo.png",
      files: [
        { name: "lunaphoto1.png", isScreenshot: true },
        { name: "lunaphoto2.png", isScreenshot: true }
      ]
    }
  },
  {
    id: "[PROJ_03]",
    slug: "Luzes-com-palmas",
    icon: "Clapperboard",
    title: "Luzes com Palmas",
    desc: "Automatização residencial com detecção de padrões sonoros via Arduino e processamento de áudio.",
    longDesc: "Sistema inovador de automatização residencial que utiliza processamento de áudio em tempo real para controlar iluminação através de palmas. Combina hardware Arduino com algoritmos de detecção de padrões sonoros e filtros adaptativos.",
    tags: ["Arduino", "IoT", "Sensors", "Processing", "C++"],
    status: "FINISHED",
    url: "/project/Luzes-com-palmas",
    features: [
      "Detecção de padrões sonoros em tempo real",
      "Controle de iluminação via Arduino",
      "Processamento de sinal com filtros adaptativos",
      "Baixo consumo de energia",
      "Fácil instalação e configuração",
    ],
    secret: {
      type: "icons",
      left: "Clapperboard",
      right: "Lightbulb",
      extra: "Laptop"
    }
  },
  {
    id: "[PROJ_04]",
    slug: "TermBrowse",
    icon: "Terminal",
    title: "TermBrowse (TUI Browser)",
    desc: "Navegador web baseado em terminal (TUI) com pesquisa integrada e comunicação de APIs em tempo real.",
    longDesc: "Um navegador minimalista executado diretamente no terminal (TUI). Desenvolvido para exercitar o design de interfaces de terminal ricas e a integração de chamadas assíncronas de APIs externas. Permite buscar informações e ler conteúdos web com renderização de texto limpa e otimizada.",
    tags: ["Python", "TUI", "APIs", "Terminal", "Rich"],
    status: "STABLE",
    url: "/project/TermBrowse",
    features: [
      "Interface baseada em terminal (TUI) interativa e responsiva",
      "Pesquisa web integrada com consulta assíncrona de APIs",
      "Renderização e formatação automática de texto leve no terminal",
      "Navegação por abas virtuais e histórico de busca no terminal",
      "Execução portátil por comando simples no ambiente Linux/macOS",
    ],
    secret: {
      type: "images",
      folder: "/termbrowsecardphotos",
      centerLogo: "/logo.png",
      files: [
        { name: "termbrowse1.png", isScreenshot: true }
      ]
    }
  },
  {
    id: "[PROJ_05]",
    slug: "GameImpact",
    icon: "Gamepad2",
    title: "GameImpact",
    desc: "Site de pesquisa sobre o impacto dos jogos eletrônicos no desenvolvimento infantil em São Paulo.",
    longDesc: "Site informativo completo desenvolvido como trabalho de conclusão de ano para um grupo de pesquisa acadêmica. Apresenta dados estatísticos brasileiros sobre a influência dos jogos eletrônicos no desenvolvimento cognitivo e social de crianças, com gráficos interativos, FAQ, recomendações para pais e plano de pesquisa detalhado. Projeto entregue com avaliação 5 estrelas pelo cliente.",
    tags: ["HTML", "CSS", "JavaScript", "UI/UX", "Netlify"],
    status: "FINISHED",
    url: "/project/GameImpact",
    externalUrl: "https://gameimpact-oficial.netlify.app",
    features: [
      "Design responsivo com estética dark mode e gradientes",
      "Gráficos estatísticos interativos com dados reais brasileiros",
      "Seções de benefícios, riscos e recomendações para pais",
      "FAQ completo e plano de pesquisa acadêmica",
      "Navegação fluida com menu fixo e scroll suave",
      "Deploy em produção no Netlify",
    ],
    secret: {
      type: "images",
      folder: "/gameimpactcardphotos",
      centerLogo: "/logo.png",
      files: [
        { name: "gameimpact1.png", isScreenshot: true },
        { name: "gameimpact2.png", isScreenshot: true },
        { name: "gameimpact3.png", isScreenshot: true }
      ]
    }
  },
  {
    id: "[PROJ_06]",
    slug: "NebulaMusic",
    icon: "Music",
    title: "Nebula Music Player",
    desc: "Player de música local inspirado no compartilhamento P2P. Importe músicas de qualquer fonte e ouça offline.",
    longDesc: "Um player de música minimalista e funcional criado como estudo prático de front-end e armazenamento local (localStorage/IndexedDB). Inspirado na filosofia de compartilhamento descentralizado, o Nebula permite importar arquivos de áudio de qualquer fonte, organizá-los em playlists e ouvir tudo localmente no navegador.",
    tags: ["HTML", "CSS", "JavaScript", "LocalStorage", "Netlify"],
    status: "FINISHED",
    url: "/project/NebulaMusic",
    externalUrl: "https://nebulamusic.netlify.app",
    features: [
      "Player de áudio completo com controles (play, pause, next, prev)",
      "Importação de arquivos de música locais via drag & drop",
      "Sistema de playlists com armazenamento local persistente",
      "Interface dark mode inspirada em players modernos",
      "Toggle de visualização de vídeo quando disponível",
      "Deploy em produção no Netlify",
    ],
    secret: {
      type: "images",
      folder: "/nebulacardphotos",
      centerLogo: "/logo.png",
      files: [
        { name: "nebula1.png", isScreenshot: true }
      ]
    }
  }
];
