# Nail Pro — Landing Page

![Nail Pro — Preview](.github/assets/cover.webp)

Desafio técnico frontend voltado ao desenvolvimento de uma landing page production-grade a partir de uma referência visual de alta conversão, com foco em **fidelidade visual, responsividade contínua, acessibilidade, performance e engenharia de frontend**.

O projeto combina um acabamento visual de alto nível com uma arquitetura moderna em **Next.js 16 (App Router)** entregue como **export estático** no Cloudflare Workers: sem servidor de aplicação, sem otimizador de imagens em runtime e **zero requisições a domínios de terceiros no carregamento inicial**.

## Demonstração

- Produção: https://nailpro.leonardocamargo.dev.br/

## O desafio

A implementação foi conduzida como um problema real de engenharia frontend, com objetivos simultâneos de qualidade visual e técnica:

- implementar as **11 seções** da narrativa de conversão: Hero com oferta → Técnicas em grade → Público-alvo → Educação/Mecanismo → Módulos com abas → Depoimentos em vídeo → Benefícios → Professora → Oferta detalhada com garantia → FAQ expansível → Rodapé;
- manter comportamento responsivo contínuo de **320px a 2560px**, cobrindo mobile compacto, mobile padrão, tablet, desktop e ultrawide sem quebras de layout;
- calibrar tipografia, grids, proporções de imagem, contrastes e espaçamentos em cada breakpoint;
- servir **fontes, imagens e ícones localmente**, sem CDNs externas, sem Google Fonts em runtime e sem scripts de rastreamento de terceiros;
- garantir navegação por teclado, semântica adequada e contraste compatível com **WCAG 2.1 AA**;
- reduzir o custo do carregamento inicial (LCP/FCP) sem comprometer o design nem o comportamento interativo;
- criar testes automatizados capazes de detectar regressões de layout, responsividade, interação e acessibilidade.

## Decisões de engenharia

### Renderização e performance

- **Export estático** (`output: "export"`) publicado como static assets no Cloudflare Workers: sem compute, sem cold start e com distribuição global na edge;
- **Derivados de imagem pré-gerados localmente**: pipeline de mídia com variantes em formato moderno **AVIF** e fallbacks em **WebP**, reduzindo drasticamente o tráfego de rede (ex.: banner compacto de 21,8 KB para 9,3 KB e poster de 13,5 KB para 9,4 KB);
- **Carregamento responsivo de imagens**: o Hero utiliza elemento `<picture>` com seleção explícita de AVIF/WebP por media query de viewport, além de preloads seletivos de poster e banner direcionados à região crítica do LCP;
- **Fachada de vídeo acessível**: o vídeo do Hero e os depoimentos utilizam capas e componentes locais interativos que dispensam embeds de `iframe` de terceiros no carregamento inicial, eliminando bloqueio de thread principal e requisições externas desnecessárias;
- **Zero bibliotecas pesadas de animação**: transições e reveals controlados puramente por CSS nativo e `IntersectionObserver`, respeitando rigorosamente a preferência do usuário por `prefers-reduced-motion`;
- **Nenhum domínio de terceiro no carregamento**: garantido por contrato e verificado em testes automatizados;
- **medido no PageSpeed Insights oficial** (5 execuções espaçadas por form factor, no artefato publicado): **desktop 100** de mediana (notas 99–100, LCP 0,6s, CLS 0) e **mobile 92** de mediana (notas 91–96, LCP 2,9s, CLS 0, TBT 30ms). O LCP observado sem throttling é de ~300ms; o valor publicado pelo PSI reflete a simulação restrita sob CPU 4x e 4G lento.

### Acessibilidade

- Auditoria automatizada com **Axe Core** integrada aos testes de integração sem violações;
- Foco visível em todos os links e botões interativos com estados outline e contraste calibrado;
- FAQ baseado em Accordion acessível com suporte total a navegação por teclado (Enter, Espaço, Tab, Home, End e Setas);
- Listas semânticas estruturadas e landmarks nativos (`main`, `section`, `footer`);
- Suporte a `prefers-reduced-motion` em todas as animações e transições;
- Conteúdo essencial preservado e acessível mesmo com JavaScript desabilitado.

### Qualidade e regressão

- Testes de componentes com **Vitest** e **React Testing Library**;
- Testes E2E com **Playwright** cobrindo contratos estruturais, landmarks essenciais, âncoras `#oferta`, matriz responsiva nos viewports `320px`, `390px`, `768px`, `1440px` e `2560px` e ausência de overflow horizontal;
- Verificação contínua de código com **Biome** (linter e formatador) e **TypeScript** em modo estrito.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Linguagem:** TypeScript 7
- **Estilização:** Tailwind CSS v4
- **Componentes:** shadcn/ui & Radix UI
- **Testes Unitários:** Vitest + React Testing Library + JSDOM
- **Testes E2E & A11y:** Playwright + Axe Core
- **Padronização:** Biome
- **Deploy & Hospedagem:** Cloudflare Workers (Static Assets) + Wrangler

## Estrutura

```text
src/
├── app/                     # App Router, layout, metadata, robots, sitemap
├── components/ui/           # Primitivas shadcn/ui (Accordion, etc.)
├── features/landing-page/
│   ├── components/          # Componentes de interação (vídeo, reveal, botões)
│   ├── sections/            # Seções da landing page
│   ├── landing-content.ts   # Fonte única de dados e textos editoriais
│   └── landing-page.tsx     # Composição da página
└── styles/                  # Tokens, fontes e infraestrutura global

scripts/build/               # Servidor estático e pipeline de derivados de imagem
e2e/                         # Suíte E2E de responsividade, acessibilidade e interações
```

## Executar localmente

Requisitos: Node.js 24+ e pnpm 11+.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

A aplicação fica disponível em `http://127.0.0.1:3000`.

## Validação

```bash
pnpm run typecheck
pnpm run test:run
pnpm run check:biome
pnpm run validate
```

Como o projeto é um export estático, não existe `next start`:

```bash
pnpm run build        # gera a pasta out/ com export estático
pnpm run start        # serve out/ localmente como o Worker serve
pnpm run test:e2e     # compila e roda a suíte de testes E2E Playwright
pnpm run audit:a11y   # auditoria automatizada de acessibilidade com Axe
```

O workflow do GitHub Actions executa os gates principais em Pull Requests e pushes na branch principal.

## Deploy

```bash
wrangler deploy
```

Credenciais e secrets permanecem fora do repositório, em um ambiente local autenticado via Cloudflare API Token.

## Sobre conteúdo e ativos

O código é de autoria própria e está sob a [Licença MIT](LICENSE). Nomes, marcas, fotografias e materiais do produto pertencem aos seus respectivos titulares e aparecem aqui apenas como parte deste desafio técnico frontend independente — os detalhes de atribuição estão descritos em [`NOTICE.md`](NOTICE.md).

## Escopo do repositório público

Este repositório contém o código estritamente necessário para executar, estudar e validar a implementação técnica. Artefatos internos de laboratório, prompts de agentes, relatórios de QA e evidências de validação permanecem fora da versão pública.
