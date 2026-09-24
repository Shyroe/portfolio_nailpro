const faqAnswers = [
  "Sim. Após a confirmação da compra, você recebe acesso à área de alunas para assistir às aulas no seu ritmo, pelo celular ou computador. O conteúdo fica disponível para revisão, então você pode pausar, voltar às demonstrações e praticar cada etapa antes de atender. A sequência vai do preparo da unha natural à aplicação, ao acabamento e à manutenção, para você estudar com calma e consultar sempre que surgir uma dúvida na mesa.",
  "Sim. A oferta pode ser parcelada no cartão; o boleto é uma opção de pagamento à vista quando disponível na plataforma. As condições e formas liberadas aparecem na tela segura de checkout.",
  "Você contará com um canal de suporte para enviar perguntas sobre as aulas e compartilhar sua evolução. A orientação ajuda a revisar preparação, aplicação, acabamento, manutenção e rotina de atendimento.",
  "Você terá 7 dias após a compra para conhecer o treinamento. Se decidir que ele não é adequado para você, poderá solicitar o reembolso dentro desse prazo, conforme as regras da plataforma.",
  "Sim. Ao concluir as etapas propostas, você poderá emitir um certificado de conclusão do treinamento. Ele registra sua formação e pode acompanhar a apresentação dos seus serviços.",
] as const;

const moduleContent = [
  {
    label: "Técnicas",
    items: [
      [
        "Preparação segura",
        "Higienize, prepare e proteja a unha natural para iniciar cada atendimento com segurança.",
      ],
      [
        "Estrutura e curvatura",
        "Construa ponto de tensão, espessura e curvatura para um alongamento fino e resistente.",
      ],
      [
        "Fibra de vidro",
        "Domine o encaixe da fibra, a camada de gel e o acabamento para diferentes formatos.",
      ],
      [
        "Gel na tip",
        "Aplique tips com alinhamento, adesão e acabamento natural, sem marcas ou excesso de produto.",
      ],
      [
        "Molde e formatos",
        "Adapte molde e técnica para unhas planas, côncavas, roídas e formatos personalizados.",
      ],
      [
        "Manutenção e nail art",
        "Faça manutenção, remoção e decorações como francesinha e baby boomer com precisão.",
      ],
    ],
  },
  {
    label: "Produtos",
    items: [
      [
        "Kit essencial",
        "Monte uma mesa funcional com cabine, brocas, lixas e ferramentas que entram na rotina.",
      ],
      [
        "Géis e preparadores",
        "Entenda função, consistência e ordem de uso de desidratador, primer, base e gel.",
      ],
      [
        "Fibra, tips e moldes",
        "Compare suportes de alongamento e escolha a melhor opção para cada cliente.",
      ],
      [
        "Biossegurança",
        "Crie um protocolo de higienização, descarte e organização que transmite profissionalismo.",
      ],
      [
        "Custo por atendimento",
        "Calcule o consumo de produto para definir preço, margem e reposição sem prejuízo.",
      ],
      [
        "Fornecedores e estoque",
        "Organize compras, validade e estoque mínimo para evitar desperdício e falta de material.",
      ],
    ],
  },
  {
    label: "Modelo de Negócio",
    items: [
      [
        "Posicionamento",
        "Defina seu diferencial e apresente um serviço de unhas fácil de reconhecer e indicar.",
      ],
      [
        "Precificação",
        "Monte uma tabela considerando tempo, custos e margem para cobrar com clareza.",
      ],
      [
        "Experiência da cliente",
        "Organize agenda, ficha de atendimento e orientações pós-procedimento para gerar confiança.",
      ],
      [
        "Portfólio que vende",
        "Fotografe resultados e mostre detalhes que valorizam a qualidade do seu trabalho.",
      ],
      [
        "Divulgação local",
        "Use redes sociais, indicações e parcerias para atrair clientes da sua região.",
      ],
      [
        "Agenda sustentável",
        "Planeje metas, retornos e rotina financeira para crescer sem perder qualidade.",
      ],
    ],
  },
] as const;

export const landingContent = {
  ctaLabel: "Quero mudar de vida",
  heroVideo: {
    posterUrl: "/media/nailpro/derived/hero-video.webp",
    posterCompactUrl: "/media/nailpro/derived/hero-video-compact.webp",
    posterAvifUrl: "/media/nailpro/derived/hero-video.avif",
    posterCompactAvifUrl: "/media/nailpro/derived/hero-video-compact.avif",
    unavailableTitle: "Aula demonstrativa em breve",
    unavailableBody:
      "Em breve, você poderá acompanhar uma demonstração de preparação, estrutura e acabamento do método Nail Pro.",
  },
  techniques: [
    ["Cascata\nde Glitter", "/media/nailpro/derived/technique-glitter.webp"],
    ["Francesa\ncom Fitilho", "/media/nailpro/derived/technique-fitilho.webp"],
    [
      "Decoração Babyboomer",
      "/media/nailpro/derived/technique-babyboomer.webp",
    ],
    [
      "Banho de Gel (Cristalização)",
      "/media/nailpro/derived/technique-crystal.webp",
    ],
    [
      "Alongamento\nFibra de Vidro",
      "/media/nailpro/derived/technique-fibra.webp",
    ],
    ["Alongamento\nGel na Tip", "/media/nailpro/derived/technique-tip.webp"],
    [
      "Alongamento Gel Moldado",
      "/media/nailpro/derived/technique-moldado.webp",
    ],
    ["Decoração\nnas Unhas", "/media/nailpro/derived/technique-decoracao.webp"],
  ],
  audience: [
    "Quer começar nas unhas mas não sabe por onde e precisa de uma direção clara do caminho do sucesso.",
    "Já é Nail Designer mas ainda não está satisfeita com seus resultados e precisa virar o jogo.",
    "Quer conquistar seu espaço, ser reconhecida e valorizada.",
    "Quer viver de unhas e alcançar sua independência financeira.",
    "Quer realizar seus sonhos e ser feliz fazendo unhas magnificas.",
    "Não quer ser apenas boa no que faz, quer ser IMPECAVEL.",
  ],
  educationBody: [
    "Não é de hoje que técnicas de alongamento de unhas estão em alta e fazem sucesso, já que oferecem inúmeros benefícios para quem é fã de unhas bonitas.",
    "Existem diversas técnicas de alongamento de unhas, entre elas: unhas de acrigel, unhas de acrílico e unhas de fibra de vidro. Todas elas são um muito aceitas e procuradas, principalmente por questões estéticas, pois elas deixam as mãos e as unhas com mais bonitas e bem cuidadas.",
    "Os alongamentos também podem ajudar a se livrar de um vício que muitas pessoas enfrentam: roer unhas.",
    "É claro que um dos grandes benefícios dessas técnicas é estético.",
    "Se as suas unhas são fracas e quebradiças, os alongamentos são uma alternativa, pois elas te ajudam a conquistar unhas mais resistentes, longas e bonitas.",
    "Além disso, os alongamentos também ajudam com o vício de roer as unhas. Com unhas artificiais fica mais fácil de se policiar e largar esse hábito.",
  ],
  faq: [
    ["O acesso ao curso é vitalício?", faqAnswers[0]],
    ["Dá para parcelar no boleto?", faqAnswers[1]],
    ["E se eu tiver dúvidas? Tem suporte?", faqAnswers[2]],
    ["E se por algum motivo eu não gostar do curso?", faqAnswers[3]],
    ["O curso terá certificado?", faqAnswers[4]],
  ],
  modules: moduleContent.map(({ label, items }) => ({
    label,
    items: items.map(([title, description]) => ({ title, description })),
  })),
  testimonials: {
    heading: "Depoimentos",
    subtitle: "Veja alguns depoimentos das nossas alunas",
    posterUrl: "/media/nailpro/derived/hero-video.webp",
    items: [
      { id: "ana", label: "Assistir depoimento 1" },
      { id: "beatriz", label: "Assistir depoimento 2" },
      { id: "carla", label: "Assistir depoimento 3" },
      { id: "dani", label: "Assistir depoimento 4" },
      { id: "elisa", label: "Assistir depoimento 5" },
      { id: "fernanda", label: "Assistir depoimento 6" },
    ],
  },
  offer: {
    heading: "Você deve estar se perguntando:\nquanto vai custar tudo isso?",
    body: "Você vai levar esse curso mega completo, e a oportunidade de mudar de vida, e criar um negócio\nque fatura mais de 10 mil reais por mês e conquistar sua liberdade financeira, pela bagatela de:",
    price: "12x de 47,14",
    cash: "ou R$ 499 à vista",
    ctaLabel: "Quero comprar agora",
    attention: "Atenção, as vagas são limitadas!",
    guaranteeImage: "/media/nailpro/guarantee.png",
    guaranteeText:
      "Fique tranquila! Se não gostar do conteúdo nós devolveremos cada centavo! Se por algum motivo você não gostar do treinamento poderá solicitar reembolso total do valor do curso a qualquer momento (dentro do prazo de 7 dias após a compra).",
    paymentMethodsImage: "/media/nailpro/payment-methods.webp",
  },
  bonuses: {
    heading:
      "E ainda tem mais! Olha só o que você\nvai levar completamente grátis.",
    items: [
      {
        title: "Bônus 1 - Como abrir um CNPJ MEI",
        description:
          "Guia direto ao ponto para formalizar seu atendimento como MEI: entenda as obrigações do regime, organize seus documentos e mantenha tudo em dia sem depender de contador para as dúvidas mais simples do dia a dia do seu negócio.",
        image: "/media/nailpro/bonus-mei.png",
        imageHeight: 552,
        imageWidth: 400,
      },
      {
        title: "Bônus 2 - Grupo VIP no Telegram",
        description:
          "Comunidade ativa para trocar experiências, tirar dúvidas e acompanhar a evolução de outras alunas. Compartilhe resultados, peça opiniões sobre técnicas e encontre apoio para os desafios do início da carreira, com foco em conteúdo útil.",
        image: "/media/nailpro/bonus-telegram.webp",
        imageHeight: 1233,
        imageWidth: 894,
      },
      {
        title: "Bônus 3 - Lista dos melhores fornecedores",
        description:
          "Seleção organizada de fornecedores de gel, fibra de vidro, cabine e acessórios, com faixas de preço e observações sobre prazo de entrega. Use a lista para montar seu primeiro pedido com segurança e evitar gastos desnecessários antes de atender.",
        image: "/media/nailpro/bonus-suppliers.png",
        imageHeight: 552,
        imageWidth: 400,
      },
    ],
  },
  benefits: [
    {
      title: "Básico ao avançado",
      description:
        "Passo a passo simples e didático, não importa se você já possui ou não conhecimento na área.",
    },
    {
      title: "Aulas didáticas",
      description:
        "Aulas muito didáticas, qualquer pessoa consegue aprender e colocar em prática o conteúdo ensinado.",
    },
    {
      title: "Mercado em alta",
      description:
        "Você estará pronta para atuar no mercado que mais tem crescido no mundo e se destacar.",
    },
  ],
  instructor: {
    label: "CONHEÇA SUA PROFESSORA",
    bio: [
      "Trabalho no mercado de unhas a oito anos , iniciei minha carreira atendendo clientes na garagem de casa.",
      "Já ministrei cursos para mais de 5 mil alunas ensinando técnicas básicas a avançadas que garantem renda média de R$ 400 por dia e mais de R$ 10 mil por mês.",
      "Conheço as dificuldades de aumentar a renda como manicure, procurei me capacitar, inclusive fora do Brasil com técnicas internacionais, para ampliar minha atuação no universo das unhas e assim conquistar minha independência financeira.",
      "Hoje meu maior objetivo é levar minha experiência adquirida nos últimos anos para outras pessoas, para que elas possam ampliar seus horizontes, oferecer novos serviços e assim ampliar sua renda.",
    ],
    portrait: "/media/nailpro/derived/instructor-portrait.webp",
  },
  footer: {
    disclaimer:
      "“Nenhuma informação contida neste produto deve ser interpretada como uma afirmação da obtenção de resultados. Qualquer referência ao desempenho passado ou potencial de uma estratégia abordada no conteúdo não é, e não deve ser interpretada como uma recomendação ou como garantia de qualquer resultado específico.”",
    copyright:
      "Nail Design - Copyright © {year} - Todos os direitos reservados",
  },
} as const;
