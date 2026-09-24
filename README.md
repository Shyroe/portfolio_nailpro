# Nail Pro — Landing Page

Desafio técnico frontend voltado ao desenvolvimento de uma landing page production-grade, com foco em **fidelidade visual, responsividade contínua, acessibilidade, performance e engenharia de frontend**.

O projeto combina um acabamento visual de alto padrão com uma arquitetura moderna em **Next.js 16 (App Router)** entregue como **export estático** no Cloudflare Workers: sem servidor de aplicação, sem otimizador de imagens em runtime e **zero requisições a domínios de terceiros no carregamento inicial**.

## Demonstração

- Produção: https://nailpro.leonardocamargo.dev.br/

## O desafio

A implementação foi conduzida como um problema real de engenharia frontend, com objetivos simultâneos de qualidade visual e técnica:

- implementar as seções completas na ordem da narrativa de conversão (Hero com oferta → Técnicas em grade → Público-alvo → Educação/Mecanismo → Módulos com abas → Depoimentos em vídeo → Benefícios → Professora → Oferta detalhada com garantia → FAQ expansível → Rodapé);
- manter comportamento responsivo contínuo de **320px a 2560px**, cobrindo mobile compacto, mobile padrão, tablet, desktop e ultrawide;
- calibrar alinhamentos, grids, proporções de imagem, contrastes e espaçamentos em cada breakpoint;
- servir **fontes, imagens e ícones localmente**, sem CDNs externas, sem Google Fonts em runtime e sem scripts rastreadores de terceiros;
- garantir navegação por teclado, semântica adequada e contraste compatível com **WCAG 2.1 AA**;
- reduzir o custo do carregamento inicial (LCP/FCP) sem comprometer o design nem o comportamento;
- criar testes automatizados capazes de detectar regressões de layout, responsividade, interação e acessibilidade.

## Decisões de engenharia

### Renderização e performance

- **Export estático** (`output: "export"`) publicado como static assets no Cloudflare Workers: sem compute, sem cold start e com distribuição global na edge;
- **Derivados de imagem pré-gerados localmente**: pipeline de mídia com variantes em formato moderno **AVIF** e fallbacks em **WebP**, reduzindo drasticamente o tráfego de rede (ex.: banner compacto de 21,8 KB para 9,3 KB e poster de 13,5 KB para 9,4 KB);
- **Carregamento responsivo de imagens**: o Hero utiliza elemento `<picture>` com seleção explícita de AVIF/WebP por media query de viewport, além de preloads de poster e banner direcionados à região crítica do LCP;
- **Fachada de vídeo acessível**: o vídeo do Hero e os depoimentos utilizam capas e componentes locais interativos que dispensam embeds de `iframe` de terceiros no carregamento inicial, eliminando bloqueio de thread principal e requisições externas desnecessárias;
- **Zero bibliotecas pesadas de animação**: transições e reveals controlados puramente por CSS nativo e `IntersectionObserver`, respeitando rigorosamente a preferência do usuário por `prefers-reduced-motion`.

### Resultados PageSpeed Insights (5 runs oficiais independentes)

Medição conduzida no Google PageSpeed Insights oficial sobre o artefato final publicado no domínio de produção (`nailpro.leonardocamargo.dev.br`):

#### Mobile (Moto G Power emulado / 4G lento)
*Garantia de integridade: `cacheSafe: true` (5 relatórios e timestamps únicos).*

| Run | Desempenho | LCP | FCP | TBT | CLS | Speed Index | Relatório Oficial |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **92** | 2,9s | 1,7s | 10ms | 0 | 4,5s | [Relatório 1](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/o4vx1f4f9m?form_factor=mobile) |
| **2** | **91** | 2,9s | 1,7s | 40ms | 0 | 4,7s | [Relatório 2](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/wc1pbmffk5?form_factor=mobile) |
| **3** | **94** | 2,9s | 1,7s | 40ms | 0 | 2,8s | [Relatório 3](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/4g2d9d7jxo?form_factor=mobile) |
| **4** | **96** | 2,6s | 1,7s | 0ms | 0 | 1,7s | [Relatório 4](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/beq25o3o58?form_factor=mobile) |
| **5** | **92** | 2,9s | 1,7s | 30ms | 0 | 4,5s | [Relatório 5](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/8kxooqa1yl?form_factor=mobile) |

- **Mediana Mobile:** **92** de desempenho (min 91, max 96) | LCP **2,9s** | FCP **1,7s** | TBT **30ms** | CLS **0** | A11y **97** | Melhores Práticas **100** | SEO **100**

#### Desktop (Área de trabalho emulada)
*Garantia de integridade: `cacheSafe: true` (5 relatórios e timestamps únicos).*

| Run | Desempenho | LCP | FCP | TBT | CLS | Speed Index | Relatório Oficial |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **100** | 0,7s | 0,5s | 40ms | 0 | 0,5s | [Relatório 1](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/o4vx1f4f9m?form_factor=desktop) |
| **2** | **99** | 0,6s | 0,5s | 0ms | 0 | 1,0s | [Relatório 2](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/wc1pbmffk5?form_factor=desktop) |
| **3** | **100** | 0,6s | 0,4s | 0ms | 0 | 0,7s | [Relatório 3](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/4g2d9d7jxo?form_factor=desktop) |
| **4** | **100** | 0,7s | 0,5s | 30ms | 0 | 0,5s | [Relatório 4](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/beq25o3o58?form_factor=desktop) |
| **5** | **100** | 0,6s | 0,5s | 10ms | 0 | 0,6s | [Relatório 5](https://pagespeed.web.dev/analysis/https-nailpro-leonardocamargo-dev-br/8kxooqa1yl?form_factor=desktop) |

- **Mediana Desktop:** **100** de desempenho (min 99, max 100) | LCP **0,6s** | FCP **0,5s** | TBT **10ms** | CLS **0** | A11y **100** | Melhores Práticas **100** | SEO **100**

### Acessibilidade

- Auditoria automatizada com **Axe Core** integrada aos testes de integração;
- Foco visível em todos os links e botões interativos com estados outline e contraste calibrado;
- FAQ baseado em Accordion acessível com suporte total a navegação por teclado (Enter, Espaço, Tab, Home, End e Setas);
- Suporte a `prefers-reduced-motion` em todas as animações e transições.

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

scripts/build/               # Servidor estático e geração de derivados de mídia
e2e/                         # Suíte E2E de responsividade, acessibilidade e interações
```

## Executar localmente

Requisitos: Node.js 24+ e pnpm 11+.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

Acesse em `http://127.0.0.1:3000`.

## Quality gates

```bash
pnpm run validate     # Typecheck + Testes unitários + Biome + Build de produção
pnpm run test:e2e     # Testes E2E com Playwright em Chromium
pnpm run audit:a11y   # Auditoria automatizada de acessibilidade com Axe
```

## Licença e atribuição

O código-fonte autoral deste projeto é distribuído sob a [Licença MIT](LICENSE). Imagens, nomes, marcas, identidade visual e outros materiais de demonstração são protegidos por seus respectivos titulares. Consulte [`NOTICE.md`](NOTICE.md) para detalhes de uso e atribuição.
