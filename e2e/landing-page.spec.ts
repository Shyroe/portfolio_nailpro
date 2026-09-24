import { expect, type Locator, test } from "@playwright/test";

const finishAnimations = async (locator: Locator) => {
  await locator.evaluateAll((elements) => {
    for (const element of elements) {
      for (const animation of element.getAnimations()) {
        animation.finish();
      }
    }
  });
};

const viewports = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 2560, height: 1440 },
] as const;

const essentialSections = [
  "techniques-title",
  "audience-title",
  "education-title",
  "curriculum-title",
  "testimonials-title",
  "offer-title",
  "bonuses-title",
  "benefits-title",
  "instructor-title",
  "faq-title",
] as const;

const audienceCheckPath =
  "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-6.248-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 22.628 0 22.628.001z";

test("renders the landing structure without horizontal overflow", async ({
  page,
}) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    for (const sectionId of essentialSections) {
      await expect(
        page.locator(`section[aria-labelledby="${sectionId}"]`),
      ).toHaveCount(1);
    }
    await expect(page.locator('a[href="#oferta"]')).toHaveCount(6);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth <= 3,
      ),
    ).toBe(true);
  }

  expect(pageErrors).toEqual([]);
});

test("keeps ultrawide payment logos complete above the hero divider", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const hero = page.locator("main > section").first();
  const paymentMethods = hero.locator(
    'img[alt="Métodos de pagamento aceitos"]',
  );
  await expect(paymentMethods).toBeVisible();
  const heroBox = await hero.boundingBox();
  const paymentBox = await paymentMethods.boundingBox();
  expect(heroBox).not.toBeNull();
  expect(paymentBox).not.toBeNull();
  expect(paymentBox?.x).toBeGreaterThanOrEqual(heroBox?.x ?? 0);
  expect((paymentBox?.x ?? 0) + (paymentBox?.width ?? 0)).toBeLessThanOrEqual(
    (heroBox?.x ?? 0) + (heroBox?.width ?? 0) + 0.5,
  );
  expect((paymentBox?.y ?? 0) + (paymentBox?.height ?? 0)).toBeLessThanOrEqual(
    (heroBox?.y ?? 0) + (heroBox?.height ?? 0) + 0.5,
  );
  await expect(paymentMethods).toHaveJSProperty("naturalWidth", 400);
});

test("serves the responsive AVIF hero assets with WebP fallbacks", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const hero = page.locator("main > section").first();
  const banner = hero.locator("picture").first();
  const poster = hero.locator(
    'button[aria-label="Assistir vídeo de apresentação do curso"] picture',
  );

  await expect(banner.locator('source[type="image/avif"]')).toHaveCount(3);
  await expect(banner.locator('source[type="image/webp"]')).toHaveCount(2);
  await expect(poster.locator('source[type="image/avif"]')).toHaveCount(2);
  await expect(poster.locator('source[type="image/webp"]')).toHaveCount(1);

  await expect
    .poll(() =>
      banner
        .locator("img")
        .evaluate((image) => (image as HTMLImageElement).currentSrc),
    )
    .toMatch(/hero-banner-compact\.avif$/);
  await expect
    .poll(() =>
      poster
        .locator("img")
        .evaluate((image) => (image as HTMLImageElement).currentSrc),
    )
    .toMatch(/hero-video-compact\.avif$/);
});

test("supports curriculum tabs and FAQ keyboard interaction", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const productsTab = page.getByRole("tab", { name: "Produtos" });
  await productsTab.focus();
  await page.keyboard.press("Enter");
  await expect(productsTab).toHaveAttribute("data-state", "active");

  const faq = page.locator('section[aria-labelledby="faq-title"]');
  await faq.scrollIntoViewIfNeeded();
  const firstQuestion = page.getByRole("button", {
    name: "O acesso ao curso é vitalício?",
  });
  await firstQuestion.focus();
  await page.keyboard.press("Enter");
  await expect(firstQuestion).toHaveAttribute("data-state", "open");
  await expect(page.getByText(/área de alunas/i).first()).toBeVisible();
  await firstQuestion.hover();
  await expect(firstQuestion).toHaveCSS("text-decoration-line", "none");
});

test("matches static CTA hover and transition behavior", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const ctas = page.locator('a[href="#oferta"]');
  await expect(ctas).toHaveCount(6);

  for (const cta of await ctas.all()) {
    await cta.evaluate((element) => {
      element.scrollIntoView({ block: "center" });
    });
    const before = await cta.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        transitionDuration: styles.transitionDuration,
      };
    });

    expect(before.color).toBe("rgb(255, 255, 255)");
    expect(before.transitionDuration).toBe("0.3s");

    await cta.hover();
    await expect(cta).toHaveCSS("background-color", before.backgroundColor);
    await expect(cta).toHaveCSS("color", before.color);
  }
});

test("matches offer typography, CTA geometry, and responsive wrapping", async ({
  browser,
}) => {
  const offerViewports = [
    {
      width: 320,
      height: 640,
      priceSize: "89px",
      priceLeading: "89px",
      cashSize: "23px",
      cashLeading: "23px",
      ctaWidth: 280,
      ctaHeight: 76,
      ctaFontSize: "18px",
      ctaPadding: "20px 30px",
      sectionHeight: 1452.156,
      guaranteeWidth: 187.188,
    },
    {
      width: 390,
      height: 844,
      priceSize: "89px",
      priceLeading: "89px",
      cashSize: "23px",
      cashLeading: "23px",
      ctaWidth: 285.281,
      ctaHeight: 58,
      ctaFontSize: "18px",
      ctaPadding: "20px 30px",
      sectionHeight: 1239.375,
      guaranteeWidth: 237.594,
    },
    {
      width: 768,
      height: 1024,
      priceSize: "110px",
      priceLeading: "110px",
      cashSize: "30px",
      cashLeading: "30px",
      ctaWidth: 440.359,
      ctaHeight: 64,
      ctaFontSize: "24px",
      ctaPadding: "20px 70px",
      sectionHeight: 894.375,
      guaranteeWidth: 144.984,
    },
    {
      width: 1440,
      height: 1000,
      priceSize: "110px",
      priceLeading: "110px",
      cashSize: "30px",
      cashLeading: "30px",
      ctaWidth: 440.359,
      ctaHeight: 64,
      ctaFontSize: "24px",
      ctaPadding: "20px 70px",
      sectionHeight: 948.984,
      guaranteeWidth: 250.594,
    },
    {
      width: 2560,
      height: 1440,
      priceSize: "110px",
      priceLeading: "110px",
      cashSize: "30px",
      cashLeading: "30px",
      ctaWidth: 440.359,
      ctaHeight: 64,
      ctaFontSize: "24px",
      ctaPadding: "20px 70px",
      sectionHeight: 948.984,
      guaranteeWidth: 250.594,
    },
  ];

  for (const viewport of offerViewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    try {
      await page.goto("/#oferta", { waitUntil: "domcontentloaded" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await document.fonts.load('700 17px "Poppins CTA Medium"');
        await document.fonts.load("900 110px Poppins");
      });

      const offer = page.locator('section[aria-labelledby="offer-title"]');
      await offer.scrollIntoViewIfNeeded();
      const heading = offer.locator("h2");
      const body = offer.locator("p").nth(0);
      const price = offer.locator("p").nth(1);
      const cash = offer.locator("p").nth(2);
      const cta = offer.getByRole("link", { name: /quero comprar agora/i });
      const attention = offer.locator("p").nth(3);
      const guaranteeText = offer.locator("p").nth(4);
      const guaranteeImage = offer.locator('img[src*="guarantee"]');

      await expect(heading).toHaveCSS("font-family", /Montserrat/i);
      await expect(heading).toHaveCSS("font-size", "18px");
      await expect(heading).toHaveCSS("line-height", "18px");
      await expect(body).toHaveCSS("font-size", "17px");
      await expect(body).toHaveCSS("line-height", "25.5px");
      await expect(body).toHaveCSS("margin-bottom", "14.4px");
      await expect(body).toHaveCSS("white-space", "pre-line");
      await expect(price).toHaveCSS("font-size", viewport.priceSize);
      await expect(price).toHaveCSS("line-height", viewport.priceLeading);
      await expect(price).toHaveCSS(
        "text-shadow",
        "rgba(0, 0, 0, 0.3) 0px 25px 17px",
      );
      await expect(cash).toHaveCSS("font-size", viewport.cashSize);
      await expect(cash).toHaveCSS("line-height", viewport.cashLeading);
      await expect(offer).toHaveCSS("background-color", "rgb(64, 0, 76)");
      await expect(cta).toHaveCSS("font-size", viewport.ctaFontSize);
      await expect(cta).toHaveCSS("line-height", viewport.ctaFontSize);
      await expect(cta).toHaveCSS("border-radius", "30px");
      await expect(cta).toHaveCSS("padding", viewport.ctaPadding);
      await expect(cta).toHaveCSS("transition-duration", "0.3s");
      await expect(cta).toHaveCSS("background-color", "rgb(255, 0, 120)");
      await expect(attention).toHaveCSS("text-decoration-line", "underline");
      await expect(attention).toHaveCSS("line-height", "17px");
      await expect(guaranteeText).toHaveCSS("margin-bottom", "14.4px");

      const ctaBox = await cta.boundingBox();
      const guaranteeBox = await guaranteeImage.boundingBox();
      const sectionBox = await offer.boundingBox();
      expect(ctaBox).not.toBeNull();
      expect(guaranteeBox).not.toBeNull();
      // A transient native scrollbar can reduce the CSS viewport by ~2px.
      expect(
        Math.abs((ctaBox?.width ?? 0) - viewport.ctaWidth),
      ).toBeLessThanOrEqual(3);
      expect(ctaBox?.height).toBeCloseTo(viewport.ctaHeight, 0);
      expect(guaranteeBox?.width).toBeCloseTo(viewport.guaranteeWidth, 0);
      expect(sectionBox?.height).toBeCloseTo(viewport.sectionHeight, 0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      ).toBe(0);
    } finally {
      await context.close();
    }
  }
});

test("matches image-backed section background treatment", async ({ page }) => {
  const assertOverlay = async (overlay: Locator, image: RegExp) => {
    await expect(overlay).toHaveCount(1);
    await expect(overlay).toHaveCSS("background-image", image);
    await expect(overlay).toHaveCSS("background-size", "cover");
    await expect(overlay).toHaveCSS("background-position", "50% 50%");
    await expect(overlay).toHaveCSS("opacity", "0.5");
  };

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const techniques = page.locator(
      'section[aria-labelledby="techniques-title"]',
    );
    await assertOverlay(
      techniques.locator(':scope > [aria-hidden="true"]'),
      viewport.width < 768
        ? /derived\/marble-compact\.webp/
        : /derived\/marble\.webp/,
    );
    const curriculum = page.locator(
      'section[aria-labelledby="curriculum-title"]',
    );
    const curriculumBackground = curriculum.locator(
      'picture > img[src*="marble"]',
    );
    await expect(curriculumBackground).toHaveCount(1);
    await expect(curriculumBackground).toHaveAttribute("alt", "");
    await expect(curriculumBackground).toHaveCSS("object-fit", "cover");
    await expect(curriculumBackground).toHaveCSS("object-position", "50% 50%");
    await expect(curriculumBackground).toHaveCSS("opacity", "0.5");
    // The reference swaps to the portrait marble crop below 768px.
    const curriculumMarbleSource = curriculum.locator(
      'picture > source[media="(max-width: 767px)"]',
    );
    await expect(curriculumMarbleSource).toHaveCount(1);
    await expect(curriculumMarbleSource).toHaveAttribute(
      "srcset",
      /derived\/marble-mobile\.webp/,
    );

    const testimonials = page.locator(
      'section[aria-labelledby="testimonials-title"]',
    );
    const testimonialsBackground = testimonials.locator(
      ':scope > [aria-hidden="true"]',
    );
    await expect(testimonialsBackground).toHaveCount(1);
    await expect(testimonialsBackground).toHaveCSS(
      "background-image",
      viewport.width < 768
        ? /testimonials-background-compact/
        : /derived\/testimonials-background\.webp/,
    );
    await expect(testimonialsBackground).toHaveCSS("background-size", "cover");
    await expect(testimonialsBackground).toHaveCSS(
      "background-position",
      "50% 50%",
    );
    await expect(testimonialsBackground).toHaveCSS("opacity", "1");

    const faq = page.locator('section[aria-labelledby="faq-title"]');
    await assertOverlay(
      faq.locator(':scope > [aria-hidden="true"]'),
      /derived\/marble-secondary\.webp/,
    );
  }
});

test("matches techniques responsive composition and card geometry", async ({
  page,
}) => {
  const viewports = [
    {
      width: 320,
      height: 640,
      cardWidth: 120,
      cardHeight: 179.265625,
      sectionHeight: 1139.0625,
    },
    {
      width: 390,
      height: 844,
      cardWidth: 155,
      cardHeight: 194.625,
      sectionHeight: 1174.5,
    },
    {
      width: 768,
      height: 1024,
      cardWidth: 147,
      cardHeight: 187.625,
      sectionHeight: 863.25,
    },
    {
      width: 1440,
      height: 1000,
      cardWidth: 265,
      cardHeight: 239.25,
      sectionHeight: 966.5,
    },
    {
      width: 2560,
      height: 1440,
      cardWidth: 265,
      cardHeight: 239.25,
      sectionHeight: 966.5,
    },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    const techniques = page.locator(
      'section[aria-labelledby="techniques-title"]',
    );
    const sectionBox = await techniques.boundingBox();
    const heading = techniques.locator("h2");
    const subtitle = techniques.locator("p").first();
    const grid = techniques.locator("ul");
    const cards = techniques.locator("li");
    await finishAnimations(cards);
    const headingBox = await heading.boundingBox();
    const subtitleBox = await subtitle.boundingBox();
    const gridBox = await grid.boundingBox();
    const firstCardBox = await cards.nth(0).boundingBox();
    const secondRowCardBox = await cards
      .nth(viewport.width < 640 ? 2 : 4)
      .boundingBox();

    if (
      !sectionBox ||
      !headingBox ||
      !subtitleBox ||
      !gridBox ||
      !firstCardBox ||
      !secondRowCardBox
    ) {
      throw new Error("Techniques geometry is not measurable");
    }

    expect(sectionBox.height).toBeCloseTo(viewport.sectionHeight, 0);
    await expect(techniques).toHaveCSS("margin-top", "-130px");
    await expect(heading).toHaveCSS(
      "font-size",
      viewport.width < 768 ? "26px" : "55px",
    );
    await expect(heading).toHaveCSS(
      "line-height",
      viewport.width < 768 ? "26px" : "55px",
    );
    await expect(subtitle).toHaveCSS(
      "font-size",
      viewport.width < 768 ? "17px" : "18px",
    );
    await expect(subtitle).toHaveCSS(
      "line-height",
      viewport.width < 768 ? "17px" : "18px",
    );
    await expect(cards).toHaveCount(8);
    await expect(cards.nth(0).locator("h3")).toHaveCSS("margin-top", "14.5px");
    await expect(cards.nth(0).locator("h3")).toHaveCSS(
      "font-size",
      viewport.width < 768 ? "12px" : "15px",
    );
    await expect(cards.nth(0).locator("h3")).toHaveCSS(
      "line-height",
      viewport.width < 768 ? "14.4px" : "18px",
    );

    const topPadding = viewport.width < 768 ? 150 : 180;
    expect(headingBox.y - sectionBox.y).toBeCloseTo(topPadding, 0);
    expect(subtitleBox.y - (headingBox.y + headingBox.height)).toBeCloseTo(
      20,
      0,
    );
    expect(gridBox.y - (subtitleBox.y + subtitleBox.height)).toBeCloseTo(20, 0);
    expect(firstCardBox.y - gridBox.y).toBeCloseTo(10, 0);
    expect(firstCardBox.x - gridBox.x).toBeCloseTo(10, 0);
    expect(firstCardBox.width).toBeCloseTo(viewport.cardWidth, 0);
    expect(firstCardBox.height).toBeCloseTo(viewport.cardHeight, 0);
    // The reference equalizes the rows with explicit `1fr` tracks
    // (`repeat(4, 1fr)` below 768px, `repeat(2, 1fr)` above), so all eight
    // cards share one height instead of each row following its own content.
    // Calibrated min-heights used to fake this and drifted up to 25px in
    // between the sampled viewports.
    await expect(cards.nth(0)).toHaveCSS("min-height", "auto");
    const rowTracks = (
      await grid.evaluate((element) =>
        getComputedStyle(element).gridTemplateRows.split(" "),
      )
    ).filter(Boolean);
    expect(rowTracks).toHaveLength(viewport.width < 768 ? 4 : 2);
    expect(new Set(rowTracks).size).toBe(1);
    const cardHeights = await cards.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    );
    expect(new Set(cardHeights).size).toBe(1);
    for (const cardHeight of cardHeights) {
      expect(cardHeight).toBeCloseTo(viewport.cardHeight, 2);
    }
    expect(
      secondRowCardBox.y - (firstCardBox.y + firstCardBox.height),
    ).toBeCloseTo(20, 0);
  }
});

test("matches the curriculum tabs, cards, icons, and responsive geometry", async ({
  page,
}) => {
  const curriculum = page.locator(
    'section[aria-labelledby="curriculum-title"]',
  );
  const tabLabels = ["Técnicas", "Produtos", "Modelo de Negócio"];
  const expectedCardStates = {
    "Modelo de Negócio": {
      backgrounds: [
        "rgb(255, 255, 255)",
        "rgb(224, 0, 106)",
        "rgb(255, 255, 255)",
        "rgb(255, 255, 255)",
        "rgb(224, 0, 106)",
        "rgb(255, 255, 255)",
      ],
      descriptionColors: [
        "rgb(118, 118, 118)",
        "rgb(255, 255, 255)",
        "rgb(118, 118, 118)",
        "rgb(118, 118, 118)",
        "rgb(255, 255, 255)",
        "rgb(118, 118, 118)",
      ],
      iconColors: [
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
      ],
      titleColors: [
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
      ],
    },
    Produtos: {
      backgrounds: [
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
      ],
      descriptionColors: [
        "rgb(255, 255, 255)",
        "rgb(118, 118, 118)",
        "rgb(255, 255, 255)",
        "rgb(118, 118, 118)",
        "rgb(255, 255, 255)",
        "rgb(118, 118, 118)",
      ],
      iconColors: [
        "rgb(255, 0, 120)",
        "rgb(54, 0, 64)",
        "rgb(255, 0, 120)",
        "rgb(54, 0, 64)",
        "rgb(255, 0, 120)",
        "rgb(54, 0, 64)",
      ],
      titleColors: [
        "rgb(255, 16, 127)",
        "rgb(54, 0, 64)",
        "rgb(255, 16, 127)",
        "rgb(54, 0, 64)",
        "rgb(255, 16, 127)",
        "rgb(54, 0, 64)",
      ],
    },
    Técnicas: {
      backgrounds: [
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
        "rgb(255, 255, 255)",
        "rgb(54, 0, 64)",
      ],
      descriptionColors: [
        "rgb(118, 118, 118)",
        "rgb(255, 255, 255)",
        "rgb(118, 118, 118)",
        "rgb(255, 255, 255)",
        "rgb(118, 118, 118)",
        "rgb(255, 255, 255)",
      ],
      iconColors: [
        "rgb(54, 0, 64)",
        "rgb(255, 0, 120)",
        "rgb(54, 0, 64)",
        "rgb(255, 0, 120)",
        "rgb(54, 0, 64)",
        "rgb(255, 0, 120)",
      ],
      titleColors: [
        "rgb(54, 0, 64)",
        "rgb(255, 16, 127)",
        "rgb(54, 0, 64)",
        "rgb(255, 16, 127)",
        "rgb(54, 0, 64)",
        "rgb(255, 16, 127)",
      ],
    },
  } as const;
  const expectedViewBoxes = [
    "0 0 64 64",
    "0 0 512 512",
    "-29 0 487 487.71902",
    "0 0 512 512",
    "0 0 512 512",
    "0 0 512 512",
  ];

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await curriculum.scrollIntoViewIfNeeded();

  const tabs = curriculum.getByRole("tab");
  await finishAnimations(curriculum.locator('[role="tabpanel"]:visible li'));
  const panels = curriculum.getByRole("tabpanel");
  await expect(curriculum).toHaveCount(1);
  await expect(tabs).toHaveCount(3);
  await expect(panels).toHaveCount(1);
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await expect(curriculum.locator('[role="tabpanel"]:visible')).toHaveCount(1);

  for (let index = 0; index < tabLabels.length; index += 1) {
    const tab = tabs.nth(index);
    const tabId = await tab.getAttribute("id");
    const controls = await tab.getAttribute("aria-controls");
    expect(tabId).toBeTruthy();
    expect(controls).toBeTruthy();
    await expect(tab).toHaveAttribute(
      "aria-selected",
      index === 0 ? "true" : "false",
    );
    await expect(tab).toHaveText(tabLabels[index]);
    if (index === 0) {
      const panel = curriculum.locator(`#${controls}`);
      await expect(panel).toHaveAttribute("aria-labelledby", tabId as string);
      await expect(panel).toHaveAttribute("tabindex", "-1");
    }
  }

  const cards = curriculum.locator('[role="tabpanel"]:visible li');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator("h3")).toHaveCount(6);
  await expect
    .poll(() =>
      cards
        .first()
        .evaluate((element) => getComputedStyle(element).animationName),
    )
    .toBe("bounceIn");
  await finishAnimations(cards);
  const assertCardState = async (label: keyof typeof expectedCardStates) => {
    const state = expectedCardStates[label];
    const visibleCards = curriculum.locator('[role="tabpanel"]:visible li');
    await expect(visibleCards).toHaveCount(6);
    expect(
      await visibleCards.evaluateAll((elements) =>
        elements.map((element) => getComputedStyle(element).backgroundColor),
      ),
    ).toEqual(state.backgrounds);
    expect(
      await visibleCards
        .locator('svg[aria-hidden="true"]')
        .evaluateAll((elements) =>
          elements.map((element) => getComputedStyle(element).color),
        ),
    ).toEqual(state.iconColors);
    expect(
      await visibleCards
        .locator("h3")
        .evaluateAll((elements) =>
          elements.map((element) => getComputedStyle(element).color),
        ),
    ).toEqual(state.titleColors);
    expect(
      await visibleCards
        .locator("p")
        .evaluateAll((elements) =>
          elements.map((element) => getComputedStyle(element).color),
        ),
    ).toEqual(state.descriptionColors);
  };

  await assertCardState("Técnicas");
  expect(
    await cards.locator('svg[aria-hidden="true"]').evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          height: rect.height,
          viewBox: element.getAttribute("viewBox"),
          width: rect.width,
        };
      }),
    ),
  ).toEqual(
    expectedViewBoxes.map((viewBox) => ({ height: 58, viewBox, width: 58 })),
  );

  await expect(tabs.nth(1)).toHaveCSS("cursor", "pointer");
  await expect(tabs.nth(1)).toHaveCSS("transition-duration", "0.3s");
  await tabs.nth(1).hover();
  await expect(tabs.nth(1)).toHaveCSS("background-color", "rgb(54, 0, 64)");
  await expect(tabs.nth(1)).toHaveCSS("color", "rgb(255, 255, 255)");
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  const productsPanel = curriculum.locator('[role="tabpanel"]:visible');
  await expect(productsPanel).toHaveCount(1);
  await expect(productsPanel).toHaveAttribute(
    "aria-labelledby",
    (await tabs.nth(1).getAttribute("id")) as string,
  );
  await expect(productsPanel.locator("li")).toHaveCount(6);
  await assertCardState("Produtos");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "false");

  await tabs.nth(1).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "false");
  await page.keyboard.press("Enter");
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await assertCardState("Modelo de Negócio");
  await tabs.nth(0).focus();
  await page.keyboard.press("Space");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await assertCardState("Técnicas");

  for (const viewport of [
    { width: 320, height: 640, cardWidth: 220, ctaHeight: 72 },
    { width: 390, height: 844, cardWidth: 290, ctaHeight: 56 },
    { width: 768, height: 1024, cardWidth: 189.328125, ctaHeight: 60 },
    { width: 1440, height: 1000, cardWidth: 346.65625, ctaHeight: 60 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await curriculum.scrollIntoViewIfNeeded();
    const visibleCards = page.locator(
      'section[aria-labelledby="curriculum-title"] [role="tabpanel"]:visible li',
    );
    await visibleCards.first().scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        visibleCards
          .first()
          .evaluate((element) => getComputedStyle(element).animationName),
      )
      .toBe("bounceIn");
    await finishAnimations(visibleCards);
    const firstCard = await visibleCards.first().boundingBox();
    const ctaLocator = page.locator(
      'section[aria-labelledby="curriculum-title"] a[href="#oferta"]',
    );
    await ctaLocator.evaluate((element) => {
      const cta = element as HTMLElement;
      cta.style.animation = "none";
      cta.style.transform = "none";
    });
    const cta = await ctaLocator.boundingBox();
    expect(firstCard).not.toBeNull();
    expect(cta).not.toBeNull();
    await expect(ctaLocator).toHaveCSS("border-radius", "30px");
    await expect(ctaLocator).toHaveCSS(
      "font-size",
      viewport.width < 768 ? "16px" : "20px",
    );
    expect(firstCard?.width).toBeCloseTo(viewport.cardWidth, 1);
    expect(cta?.height).toBeCloseTo(viewport.ctaHeight, 0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    ).toBeLessThanOrEqual(3);
  }
});

test("matches bounceIn timing and replays on every tab activation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const curriculum = page.locator(
    'section[aria-labelledby="curriculum-title"]',
  );
  await curriculum.scrollIntoViewIfNeeded();
  await finishAnimations(curriculum.locator('[role="tabpanel"]:visible li'));
  const initialPanel = curriculum.locator('[role="tabpanel"]:visible');
  const initialPanelId = await initialPanel.getAttribute("id");
  const initialCard = initialPanel.locator("li").first();
  await initialCard.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      initialCard.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
    )
    .toBe("bounceIn");
  await finishAnimations(initialCard);
  const productsTab = curriculum.getByRole("tab", { name: "Produtos" });

  await productsTab.click();
  const productsPanel = curriculum.locator('[role="tabpanel"]:visible');
  await expect(productsPanel).toHaveCount(1);
  expect(await productsPanel.getAttribute("id")).not.toBe(initialPanelId);

  const firstCard = productsPanel.locator("li").first();
  await expect(firstCard).toHaveCSS("opacity", "1");
  const animationMetadata = await firstCard.evaluate((element) => {
    const animation = element.getAnimations()[0];
    const timing = animation?.effect?.getComputedTiming();
    const style = getComputedStyle(element);

    return {
      animationCount: element.getAnimations().length,
      animationName: style.animationName,
      duration: timing?.duration,
      fill: timing?.fill,
      iterations: timing?.iterations,
    };
  });

  expect(animationMetadata).toEqual({
    animationCount: 1,
    animationName: "bounceIn",
    duration: 1250,
    fill: "none",
    iterations: 1,
  });

  const samples = await firstCard.evaluate((element) => {
    const animation = element.getAnimations()[0];
    if (!animation) {
      return [];
    }

    animation.pause();
    return [0, 250, 500, 750, 1000, 1250].map((currentTime) => {
      animation.currentTime = currentTime;
      const style = getComputedStyle(element);
      const transform = new DOMMatrixReadOnly(style.transform);
      return {
        opacity: Number(style.opacity),
        scale: transform.a,
      };
    });
  });

  expect(samples).toHaveLength(6);
  const expectedScales = [0.3, 1.1, 0.9, 1.03, 0.97, 1];
  for (const [index, sample] of samples.entries()) {
    expect(sample.scale).toBeCloseTo(expectedScales[index], 2);
  }
  expect(samples[0].opacity).toBe(0);
  expect(samples[1].opacity).toBeGreaterThan(0);
  expect(samples[1].opacity).toBeLessThan(1);
  expect(samples[2].opacity).toBeGreaterThan(samples[1].opacity);
  expect(samples[2].opacity).toBeLessThan(1);
  expect(samples[3].opacity).toBeCloseTo(1, 2);
  expect(samples[4].opacity).toBeCloseTo(1, 2);
  expect(samples[5].opacity).toBeCloseTo(1, 2);

  await finishAnimations(firstCard);
  await page.evaluate(() => {
    document.documentElement.dataset.bounceStartCount = "0";
    document.addEventListener(
      "animationstart",
      (event) => {
        if (event.animationName !== "bounceIn") {
          return;
        }

        const count = Number(
          document.documentElement.dataset.bounceStartCount ?? "0",
        );
        document.documentElement.dataset.bounceStartCount = String(count + 1);
      },
      true,
    );
  });
  const expectBounceStart = async () => {
    await expect
      .poll(() =>
        page
          .locator("html")
          .evaluate((element) => element.dataset.bounceStartCount),
      )
      .not.toBe("0");
  };

  await curriculum.getByRole("tab", { name: "Técnicas" }).click();
  const replayCard = curriculum.locator('[role="tabpanel"]:visible li').first();
  await replayCard.scrollIntoViewIfNeeded();
  await expect(replayCard).toHaveCSS("opacity", "1");
  await expect(replayCard).toHaveCSS("animation-name", "bounceIn");
  await expectBounceStart();
  await finishAnimations(replayCard);

  await page.locator("html").evaluate((element) => {
    element.dataset.bounceStartCount = "0";
  });
  await productsTab.click();
  const productsAgainCard = curriculum
    .locator('[role="tabpanel"]:visible li')
    .first();
  await productsAgainCard.scrollIntoViewIfNeeded();
  await expect(productsAgainCard).toHaveCSS("opacity", "1");
  await expect(productsAgainCard).toHaveCSS("animation-name", "bounceIn");
  await expectBounceStart();
  await finishAnimations(productsAgainCard);
});

test("reveals the second module row only after it enters the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 300 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const curriculum = page.locator(
    'section[aria-labelledby="curriculum-title"]',
  );
  await curriculum.scrollIntoViewIfNeeded();
  await curriculum.getByRole("tab", { name: "Produtos" }).click();
  const panel = curriculum.locator('[role="tabpanel"]:visible');
  const firstRowCard = panel.locator("li").first();
  await firstRowCard.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      firstRowCard.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
    )
    .toBe("bounceIn");

  const secondRowCard = panel.locator("li").nth(3);
  await expect(secondRowCard).toHaveCSS("opacity", "0");
  await expect(secondRowCard).toHaveCSS("animation-name", "none");
  await secondRowCard.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      secondRowCard.evaluate((element) => ({
        animationName: getComputedStyle(element).animationName,
        opacity: getComputedStyle(element).opacity,
      })),
    )
    .toEqual({ animationName: "bounceIn", opacity: "1" });
  await finishAnimations(panel.locator("li"));
});

test("disables module card entry animation with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const curriculum = page.locator(
    'section[aria-labelledby="curriculum-title"]',
  );
  await curriculum.scrollIntoViewIfNeeded();
  const productsTab = curriculum.getByRole("tab", { name: "Produtos" });
  await productsTab.click();
  await expect(productsTab).toHaveCSS("transition-duration", "0s");
  const reducedMotionCard = curriculum
    .locator('[role="tabpanel"]:visible li')
    .first();
  await expect(reducedMotionCard).toHaveCount(1);
  await expect(reducedMotionCard).toHaveCSS("opacity", "1");
  await expect(reducedMotionCard).toHaveCSS("animation-name", "none");
  expect(
    await reducedMotionCard.evaluate((element) => element.getAnimations()),
  ).toHaveLength(0);

  const reducedMotionCtas = page.locator('a[href="#oferta"]');
  await expect(reducedMotionCtas).toHaveCount(6);
  for (const cta of await reducedMotionCtas.all()) {
    await expect(cta).toHaveCSS("animation-name", "none");
    await expect(cta).toHaveCSS("transition-duration", "0s");
  }
});

test("matches the audience section composition across reference viewports", async ({
  page,
}) => {
  const viewports = [
    {
      width: 320,
      height: 640,
      sectionHeight: 1306.859375,
      headingHeight: 70,
      iconSize: "34px",
      textSize: "17px",
      textLeading: "25.5px",
      ctaWidth: 260,
      ctaHeight: 80,
      imageWidth: 260,
      topOffset: 40,
      stacked: true,
    },
    {
      width: 390,
      height: 844,
      sectionHeight: 1100.34375,
      headingHeight: 70,
      iconSize: "34px",
      textSize: "17px",
      textLeading: "25.5px",
      ctaWidth: 330,
      ctaHeight: 60,
      imageWidth: 330,
      topOffset: 40,
      stacked: true,
    },
    {
      width: 768,
      height: 1024,
      sectionHeight: 1136.5,
      headingHeight: 220,
      iconSize: "31px",
      textSize: "19px",
      textLeading: "28.5px",
      ctaWidth: 329.546875,
      ctaHeight: 60,
      imageWidth: 298.453125,
      topOffset: 90,
      stacked: false,
    },
    {
      width: 1440,
      height: 1000,
      sectionHeight: 827,
      headingHeight: 110,
      iconSize: "31px",
      textSize: "19px",
      textLeading: "28.5px",
      ctaWidth: 576.578125,
      ctaHeight: 60,
      imageWidth: 523.421875,
      topOffset: 90,
      stacked: false,
    },
    {
      width: 2560,
      height: 1440,
      sectionHeight: 827,
      headingHeight: 110,
      iconSize: "31px",
      textSize: "19px",
      textLeading: "28.5px",
      ctaWidth: 576.578125,
      ctaHeight: 60,
      imageWidth: 523.421875,
      topOffset: 90,
      stacked: false,
    },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const audience = page.locator('section[aria-labelledby="audience-title"]');
    await expect(audience).toHaveCount(1);
    await audience.scrollIntoViewIfNeeded();
    await finishAnimations(audience.locator("*"));

    const heading = audience.locator("h2");
    await expect(heading).toHaveCSS(
      "font-size",
      viewport.width < 768 ? "35px" : "55px",
    );
    await expect(heading).toHaveCSS(
      "line-height",
      viewport.width < 768 ? "35px" : "55px",
    );

    const items = audience.locator("li");
    await expect(items).toHaveCount(6);
    await expect(items.first().locator("span").last()).toHaveCSS(
      "font-size",
      viewport.textSize,
    );
    await expect(items.first().locator("span").last()).toHaveCSS(
      "line-height",
      viewport.textLeading,
    );
    // The reference doubles the item spacing and resets it on the last row.
    await expect(items.first()).toHaveCSS("padding-bottom", "9.5px");
    await expect(items.first()).toHaveCSS("margin-bottom", "9.5px");
    await expect(items.last()).toHaveCSS("padding-bottom", "0px");
    await expect(items.last()).toHaveCSS("margin-bottom", "0px");

    const icons = audience.locator('svg[aria-hidden="true"]');
    await expect(icons).toHaveCount(6);
    for (let index = 0; index < 6; index += 1) {
      const icon = icons.nth(index);
      await expect(icon).toHaveAttribute("viewBox", "0 0 512 512");
      await expect(icon).toHaveCSS("width", viewport.iconSize);
      await expect(icon).toHaveCSS("height", viewport.iconSize);
      await expect(icon.locator("path")).toHaveAttribute(
        "d",
        audienceCheckPath,
      );
    }

    const cta = audience.getByRole("link", { name: /quero mudar de vida/i });
    await expect(cta).toHaveAttribute("href", "#oferta");
    await expect(cta).toHaveCSS("border-radius", "30px");
    await expect(cta).toHaveCSS("font-size", "20px");
    await expect(cta).toHaveCSS("padding", "20px");

    const sectionBox = await audience.boundingBox();
    const headingBox = await heading.boundingBox();
    const ctaBox = await cta.boundingBox();
    const imageBox = await audience
      .locator('img[src*="audience-collage"]')
      .boundingBox();

    if (!sectionBox || !headingBox || !ctaBox || !imageBox) {
      throw new Error("Audience geometry is not measurable");
    }

    // The reference declares the two columns as 54.9% and 50% and lets
    // flex-shrink resolve the 104.9% overflow, so these widths are the
    // resolved result rather than a 100% split. Calibrated percentages
    // (52.33/47.67) used to sit 0.03px off at 768px; the tight tolerance keeps
    // the real mechanism in place.
    expect(sectionBox.height).toBeCloseTo(viewport.sectionHeight, 2);
    expect(headingBox.height).toBeCloseTo(viewport.headingHeight, 2);
    expect(headingBox.y - sectionBox.y).toBeCloseTo(viewport.topOffset, 2);
    expect(ctaBox.width).toBeCloseTo(viewport.ctaWidth, 2);
    expect(ctaBox.height).toBeCloseTo(viewport.ctaHeight, 2);
    expect(imageBox.width).toBeCloseTo(viewport.imageWidth, 2);
    // The collage keeps the 600x587 ratio of the local file; deriving it from
    // the optimizer variant shifted the height by 0.22px at 320px.
    expect(imageBox.height).toBeCloseTo(viewport.imageWidth / (600 / 587), 1);

    if (viewport.stacked) {
      expect(imageBox.y).toBeGreaterThanOrEqual(ctaBox.y + ctaBox.height);
    } else {
      expect(imageBox.x).toBeGreaterThan(ctaBox.x + ctaBox.width);
    }
  }
});

test("matches the education section composition across reference viewports", async ({
  page,
}) => {
  const viewports = [
    {
      width: 320,
      height: 640,
      sectionHeight: 1332.34375,
      columnWidth: 280,
      columnX: 20,
      headingWidth: 260,
      headingHeight: 140,
      headingSize: "35px",
      headingLeading: "35px",
      paragraphHeights: [144, 240, 96, 72, 144, 120],
      stacked: true,
    },
    {
      width: 390,
      height: 844,
      sectionHeight: 1129.34375,
      columnWidth: 350,
      columnX: 20,
      headingWidth: 330,
      headingHeight: 105,
      headingSize: "35px",
      headingLeading: "35px",
      paragraphHeights: [120, 192, 72, 48, 120, 96],
      stacked: true,
    },
    {
      width: 768,
      height: 1024,
      sectionHeight: 1130.34375,
      columnWidth: 365.46875,
      columnX: 50,
      headingWidth: 345.46875,
      headingHeight: 220,
      headingSize: "55px",
      headingLeading: "55px",
      paragraphHeights: [120, 192, 72, 48, 96, 96],
      stacked: false,
    },
    {
      width: 1440,
      height: 1000,
      sectionHeight: 780.34375,
      columnWidth: 623.703125,
      columnX: 150,
      headingWidth: 603.703125,
      headingHeight: 110,
      headingSize: "55px",
      headingLeading: "55px",
      paragraphHeights: [72, 96, 48, 24, 72, 72],
      stacked: false,
    },
    {
      width: 2560,
      height: 1440,
      sectionHeight: 780.34375,
      columnWidth: 623.703125,
      columnX: 710,
      headingWidth: 603.703125,
      headingHeight: 110,
      headingSize: "55px",
      headingLeading: "55px",
      paragraphHeights: [72, 96, 48, 24, 72, 72],
      stacked: false,
    },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const education = page.locator(
      'section[aria-labelledby="education-title"]',
    );
    await expect(education).toHaveCount(1);
    await education.scrollIntoViewIfNeeded();
    await finishAnimations(education.locator("*"));

    const heading = education.getByRole("heading", {
      name: "Por que trabalhar com alongamento?",
    });
    await expect(heading).toHaveCount(1);
    await expect(heading).toHaveCSS("font-size", viewport.headingSize);
    await expect(heading).toHaveCSS("line-height", viewport.headingLeading);
    await expect(heading).toHaveCSS("color", "rgb(255, 0, 120)");

    const paragraphs = education.locator("p");
    await expect(paragraphs).toHaveCount(6);
    await expect(paragraphs.first()).toContainText(
      "Não é de hoje que técnicas de alongamento",
    );
    await expect(paragraphs.last()).toContainText(
      "Com unhas artificiais fica mais fácil",
    );
    await expect(paragraphs.first()).toHaveCSS("font-size", "16px");
    await expect(paragraphs.first()).toHaveCSS("line-height", "24px");
    await expect(paragraphs.first()).toHaveCSS("font-weight", "500");
    await expect(paragraphs.first()).toHaveCSS("margin-bottom", "14.4px");
    await expect(paragraphs.first()).toHaveCSS("color", "rgb(122, 122, 122)");

    const background = education.locator('img[src*="why-alongamento"]');
    await expect(background).toHaveCount(1);
    await expect(background).toHaveAttribute("alt", "");
    await expect(background).toHaveCSS("object-fit", "cover");
    await expect(background).toHaveCSS("opacity", "1");

    // The reference swaps to a dedicated portrait crop below 768px.
    const mobileBackground = education.locator(
      'picture > source[media="(max-width: 767px)"]',
    );
    await expect(mobileBackground).toHaveCount(1);
    await expect(mobileBackground).toHaveAttribute(
      "srcset",
      /derived\/why-alongamento-mobile\.webp/,
    );

    const sectionBox = await education.boundingBox();
    const headingBox = await heading.boundingBox();
    const backgroundBox = await background.boundingBox();

    if (!sectionBox || !headingBox || !backgroundBox) {
      throw new Error("Education geometry is not measurable");
    }

    expect(sectionBox.width).toBeCloseTo(viewport.width, 0);
    expect(sectionBox.height).toBeCloseTo(viewport.sectionHeight, 0);
    expect(headingBox.width).toBeCloseTo(viewport.headingWidth, 0);
    expect(headingBox.height).toBeCloseTo(viewport.headingHeight, 0);
    // The background layer covers the whole section, as the reference `cover` does.
    expect(backgroundBox.width).toBeCloseTo(viewport.width, 0);
    expect(backgroundBox.height).toBeCloseTo(viewport.sectionHeight, 0);

    // Each paragraph must wrap exactly like the reference at this breakpoint.
    const measured = await paragraphs.evaluateAll((nodes) =>
      nodes.map(
        (node) => Math.round(node.getBoundingClientRect().height * 1000) / 1000,
      ),
    );
    for (const [index, expected] of viewport.paragraphHeights.entries()) {
      expect(measured[index]).toBeCloseTo(expected, 0);
    }

    const textColumn = education.locator("h2").locator("xpath=..");
    const columnBox = await textColumn.boundingBox();
    expect(columnBox?.x).toBeCloseTo(viewport.columnX, 0);
    expect(columnBox?.width).toBeCloseTo(viewport.columnWidth, 0);

    // The reference keeps a second, content-free column over the photo area.
    const photoColumn = education.locator('div[aria-hidden="true"]');
    await expect(photoColumn).toHaveCount(1);
    const photoBox = await photoColumn.boundingBox();

    if (viewport.stacked) {
      expect(photoBox?.x).toBeCloseTo(viewport.columnX, 0);
      expect(photoBox?.width).toBeCloseTo(viewport.columnWidth, 0);
      expect(photoBox?.y).toBeGreaterThanOrEqual(
        (columnBox?.y ?? 0) + (columnBox?.height ?? 0),
      );
    } else {
      expect(photoBox?.x).toBeGreaterThanOrEqual(
        (columnBox?.x ?? 0) + (columnBox?.width ?? 0),
      );
      expect(photoBox?.height).toBeCloseTo(columnBox?.height ?? 0, 0);
    }
  }
});

test("explains hero video availability without loading third-party content", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const playArea = page.getByRole("button", {
    name: "Assistir vídeo de apresentação do curso",
  });
  await expect(playArea).toHaveCount(1);

  const icon = playArea.locator("span");
  await expect(icon).toHaveCSS("opacity", "0.8");
  await expect(icon).toHaveCSS("transition-duration", "0s");
  await expect(icon.locator("svg")).toHaveCSS("width", "49px");
  await expect(icon.locator("svg")).toHaveCSS("height", "49px");
  await playArea.hover();
  await expect(icon).toHaveCSS("opacity", "0.8");

  const box = (await playArea.boundingBox()) as {
    x: number;
    y: number;
  };
  // A área inteira continua acionável, não apenas o ícone central.
  await page.mouse.click(box.x + 24, box.y + 20);

  const unavailableState = page.locator('[data-state="unavailable"]');
  await expect(unavailableState).toBeVisible();
  await expect(page.getByText("Aula demonstrativa em breve")).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Voltar à capa do vídeo" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Voltar à capa do vídeo" }).click();
  await expect(playArea).toBeVisible();
});

test("matches the reference hero composition at responsive breakpoints", async ({
  page,
}) => {
  const viewports = [
    { width: 320, height: 640 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
    { width: 2560, height: 1440 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const hero = page.locator("main > section").first();
    const heading = hero.getByRole("heading", { level: 1 });
    const video = hero.getByRole("button", {
      name: "Assistir vídeo de apresentação do curso",
    });
    const cta = hero.getByRole("link", { name: "QUERO FAZER PARTE" });
    const payment = hero.locator('img[alt="Métodos de pagamento aceitos"]');

    await expect(video.locator("img")).toBeVisible();
    const headingBox = await heading.boundingBox();
    const videoBox = await video.boundingBox();
    const ctaBox = await cta.boundingBox();
    const paymentBox = await payment.boundingBox();
    const expected = {
      320: {
        heading: { x: 30, y: 50, width: 260, height: 310 },
        video: { x: 40, y: 390, width: 240, height: 135 },
        cta: { x: 30, y: 765, width: 260, height: 60 },
        payment: { x: 30, y: 845.359375, width: 260, height: 23.390625 },
      },
      390: {
        heading: { x: 30, y: 50, width: 330, height: 217 },
        video: { x: 40, y: 297, width: 310, height: 174.375 },
        cta: { x: 30, y: 711.375, width: 330, height: 60 },
        payment: { x: 30, y: 791.375, width: 330, height: 29.6875 },
      },
      768: {
        heading: { x: 60, y: 60, width: 357.609375, height: 245 },
        video: { x: 70, y: 335, width: 337.609375, height: 189.890625 },
        cta: { x: 60, y: 554.890625, width: 357.609375, height: 60 },
        payment: { x: 60, y: 634.890625, width: 357.609375, height: 32.171875 },
      },
      1440: {
        heading: { x: 160, y: 60, width: 624.4375, height: 140 },
        video: { x: 170, y: 230, width: 604.4375, height: 339.984375 },
        cta: { x: 160, y: 599.984375, width: 624.4375, height: 60 },
        payment: { x: 272.21875, y: 679.984375, width: 400, height: 36 },
      },
      2560: {
        heading: { x: 720, y: 60, width: 624.4375, height: 140 },
        video: { x: 730, y: 230, width: 604.4375, height: 339.984375 },
        cta: { x: 720, y: 599.984375, width: 624.4375, height: 60 },
        payment: { x: 832.21875, y: 679.984375, width: 400, height: 36 },
      },
    }[viewport.width];

    if (!expected) {
      throw new Error(`Missing hero expectations for ${viewport.width}px`);
    }

    const assertBox = (
      actual: Awaited<ReturnType<Locator["boundingBox"]>>,
      expectedBox: { x: number; y: number; width: number; height: number },
    ) => {
      expect(actual).not.toBeNull();
      expect(actual?.x).toBeCloseTo(expectedBox.x, 0);
      expect(actual?.y).toBeCloseTo(expectedBox.y, 0);
      expect(actual?.width).toBeCloseTo(expectedBox.width, 0);
      expect(actual?.height).toBeCloseTo(expectedBox.height, 0);
    };

    assertBox(headingBox, expected.heading);
    assertBox(videoBox, expected.video);
    assertBox(ctaBox, expected.cta);
    if (expected.payment) {
      assertBox(paymentBox, expected.payment);
    } else {
      expect(paymentBox).toBeNull();
    }
  }
});

test("matches testimonial composition and local video-card interaction", async ({
  page,
}) => {
  const assertCardGeometry = async (viewport: {
    width: number;
    height: number;
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const testimonials = page.locator(
      'section[aria-labelledby="testimonials-title"]',
    );
    await testimonials.evaluate((element) => {
      element.scrollIntoView({ block: "end" });
    });
    const cards = testimonials.getByRole("button", {
      name: /^Assistir depoimento [1-6]$/,
    });

    await expect(testimonials).toHaveCount(1);
    await expect(cards).toHaveCount(6);
    await expect(
      testimonials.getByRole("heading", { name: "Depoimentos" }),
    ).toHaveText("Depoimentos");
    await expect(testimonials.locator("> div > p").first()).toHaveText(
      "Veja alguns depoimentos das nossas alunas",
    );
    const background = testimonials.locator('div[aria-hidden="true"]').first();
    await expect(background).toHaveCSS("background-size", "cover");
    await expect(background).toHaveCSS("background-position", "50% 50%");
    await expect(background).toHaveCSS(
      "background-image",
      viewport.width < 768
        ? /testimonials-background-compact/
        : /derived\/testimonials-background\.webp/,
    );

    for (const card of await cards.all()) {
      const play = card.locator("span");
      await expect(card.locator("svg")).toHaveCount(1);
      await expect(card).toHaveCSS("border-radius", "10px");
      await expect(card).toHaveCSS("transition-duration", "0s");
      await expect(play).toHaveCSS("opacity", "0.8");
      await expect(play).toHaveCSS("transition-duration", "0s");
      // The reference play affordance is a 43px icon inside a 49.5px box,
      // which lifts it above the card's vertical centre.
      await expect(play).toHaveCSS("width", "43px");
      await expect(play).toHaveCSS("height", "49.5px");
      await expect(play).toHaveCSS(
        "filter",
        "drop-shadow(rgba(0, 0, 0, 0.3) 1px 0px 6px)",
      );
      await expect(card.locator("svg")).toHaveCSS("width", "43px");
      await expect(card.locator("svg")).toHaveCSS("height", "43px");
    }
    await expect(testimonials.locator("> div > p").first()).toHaveCSS(
      "line-height",
      "18px",
    );

    // Rows sit inside a 10px-inset wrapper; the reference doubles that spacing
    // above the first row and only from 768px up above the second.
    const rows = testimonials.locator("> div > div");
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toHaveCSS("margin-top", "30px");
    await expect(rows.first()).toHaveCSS("padding-left", "10px");
    await expect(rows.last()).toHaveCSS(
      "margin-top",
      viewport.width < 768 ? "0px" : "30px",
    );
    const rowList = rows.first().locator("ul");
    // Below 768px the vertical rhythm comes from a uniform row-gap instead of
    // the reference's uneven padding/margin pair on the third card.
    await expect(rowList).toHaveCSS(
      "padding",
      viewport.width < 768 ? "0px" : "10px 0px",
    );
    await expect(rowList).toHaveCSS("row-gap", "20px");
    await expect(rowList).toHaveCSS("justify-content", "space-between");
    await expect(rowList).toHaveCSS("flex-wrap", "wrap");

    const sectionBox = await testimonials.boundingBox();
    return {
      cards: await cards.evaluateAll((elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            height: rect.height,
            left: rect.left,
            top: rect.top,
            width: rect.width,
          };
        }),
      ),
      sectionHeight: sectionBox?.height,
    };
  };

  const desktopGeometry = await assertCardGeometry({
    width: 1440,
    height: 1000,
  });
  expect(desktopGeometry.cards[0].left).toBeCloseTo(160, 0);
  expect(desktopGeometry.cards[0].width).toBeCloseTo(365.875, 0);
  expect(desktopGeometry.cards[0].height).toBeCloseTo(205.797, 0);
  expect(
    desktopGeometry.cards[1].left - desktopGeometry.cards[0].left,
  ).toBeCloseTo(377.063, 0);
  expect(
    desktopGeometry.cards[3].top - desktopGeometry.cards[0].top,
  ).toBeCloseTo(275.797, 0);
  expect(desktopGeometry.sectionHeight).toBeCloseTo(804.594, 0);

  const mobileGeometry = await assertCardGeometry({ width: 390, height: 844 });
  expect(mobileGeometry.cards[0].left).toBeCloseTo(30, 0);
  expect(mobileGeometry.cards[0].width).toBeCloseTo(330, 0);
  expect(mobileGeometry.cards[0].height).toBeCloseTo(185.625, 0);
  // Deviation from the reference: it stacks the cards with no gap between the
  // first two, we keep a uniform 20px gap between every consecutive card.
  for (let index = 1; index < 6; index += 1) {
    expect(
      mobileGeometry.cards[index].top - mobileGeometry.cards[index - 1].top,
    ).toBeCloseTo(205.625, 0);
  }
  expect(mobileGeometry.cards[3].top - mobileGeometry.cards[0].top).toBeCloseTo(
    616.875,
    0,
  );
  expect(mobileGeometry.sectionHeight).toBeCloseTo(1464.75, 0);

  const mobileTestimonials = page.locator(
    'section[aria-labelledby="testimonials-title"]',
  );
  const firstCard = mobileTestimonials.getByRole("button", {
    name: "Assistir depoimento 1",
  });
  await firstCard.click();
  const dialog = page.getByRole("dialog", {
    name: /assistir depoimento 1/i,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Fechar depoimento" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(firstCard).toBeFocused();
});

const bonusTargets = [
  {
    label: "320x640",
    viewport: { width: 320, height: 640 },
    sectionHeight: 1746.844,
    sectionPaddingX: "20px",
    innerPaddingY: "30px",
    innerMaxWidth: "767px",
    innerWidth: 280,
    headingHeight: 130,
    headingFontSize: "26px",
    imageMarginBottom: "6.5px",
    contentMarginRight: "0px",
    rowDirection: "column",
    imageWidth: 120,
    imageHeights: [165.594, 165.5, 165.594],
    contentWidth: 240,
    descriptionHeight: 202.5,
    cardHeights: [471.781, 471.688, 493.375],
  },
  {
    label: "390x844",
    viewport: { width: 390, height: 844 },
    sectionHeight: 1709.109,
    sectionPaddingX: "20px",
    innerPaddingY: "30px",
    innerMaxWidth: "767px",
    innerWidth: 350,
    headingHeight: 104,
    headingFontSize: "26px",
    imageMarginBottom: "6.5px",
    contentMarginRight: "0px",
    rowDirection: "column",
    imageWidth: 155,
    imageHeights: [213.891, 213.766, 213.891],
    contentWidth: 310,
    descriptionHeight: 157.5,
    cardHeights: [475.078, 474.953, 475.078],
  },
  {
    label: "768x1024",
    viewport: { width: 768, height: 1024 },
    sectionHeight: 878.781,
    sectionPaddingX: "50px",
    innerPaddingY: "80px",
    innerMaxWidth: "1024px",
    innerWidth: 668,
    headingHeight: 102,
    headingFontSize: "34px",
    imageMarginBottom: "0px",
    contentMarginRight: "45px",
    rowDirection: "row-reverse",
    imageWidth: 76.031,
    imageHeights: [104.922, 104.859, 104.922],
    contentWidth: 506.969,
    descriptionHeight: 90,
    cardHeights: [165.594, 165.594, 165.594],
  },
  {
    label: "1440x1000",
    viewport: { width: 1440, height: 1000 },
    sectionHeight: 1037.563,
    sectionPaddingX: "50px",
    innerPaddingY: "80px",
    innerMaxWidth: "1140px",
    innerWidth: 1140,
    headingHeight: 68,
    headingFontSize: "34px",
    imageMarginBottom: "0px",
    contentMarginRight: "45px",
    rowDirection: "row-reverse",
    imageWidth: 137.609,
    imageHeights: [189.891, 189.781, 189.891],
    contentWidth: 917.391,
    descriptionHeight: 67.5,
    cardHeights: [229.891, 229.781, 229.891],
  },
  {
    label: "2560x1440",
    viewport: { width: 2560, height: 1440 },
    sectionHeight: 1037.563,
    sectionPaddingX: "50px",
    innerPaddingY: "80px",
    innerMaxWidth: "1140px",
    innerWidth: 1140,
    headingHeight: 68,
    headingFontSize: "34px",
    imageMarginBottom: "0px",
    contentMarginRight: "45px",
    rowDirection: "row-reverse",
    imageWidth: 137.609,
    imageHeights: [189.891, 189.781, 189.891],
    contentWidth: 917.391,
    descriptionHeight: 67.5,
    cardHeights: [229.891, 229.781, 229.891],
  },
] as const;

test("matches the bonus section composition across reference viewports", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const target of bonusTargets) {
    await page.setViewportSize(target.viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bonuses = page.locator('section[aria-labelledby="bonuses-title"]');
    await bonuses.scrollIntoViewIfNeeded();
    const cards = bonuses.locator("article");
    await expect(cards).toHaveCount(3);

    // Section frame: horizontal gutters only, the vertical rhythm lives on the
    // inner container exactly as in the reference.
    await expect(bonuses).toHaveCSS("padding-top", "0px");
    await expect(bonuses).toHaveCSS("padding-left", target.sectionPaddingX);
    await expect(bonuses).toHaveCSS("padding-right", target.sectionPaddingX);
    await expect(bonuses).toHaveCSS("background-color", "rgb(255, 255, 255)");

    const overlay = bonuses.locator('[aria-hidden="true"]');
    await expect(overlay).toHaveCSS("background-image", /marble/);
    await expect(overlay).toHaveCSS("background-size", "cover");
    await expect(overlay).toHaveCSS("background-position", "50% 50%");
    await expect(overlay).toHaveCSS("opacity", "0.5");

    const inner = bonuses.locator(":scope > div:not([aria-hidden])");
    await expect(inner).toHaveCSS("display", "flex");
    await expect(inner).toHaveCSS("flex-direction", "column");
    await expect(inner).toHaveCSS("gap", "40px");
    await expect(inner).toHaveCSS("padding-top", target.innerPaddingY);
    await expect(inner).toHaveCSS("padding-bottom", target.innerPaddingY);
    await expect(inner).toHaveCSS("max-width", target.innerMaxWidth);

    const heading = bonuses.locator("h2");
    await expect(heading).toHaveCSS("font-size", target.headingFontSize);
    await expect(heading).toHaveCSS("line-height", target.headingFontSize);
    await expect(heading).toHaveCSS("font-weight", "900");
    await expect(heading).toHaveCSS("text-transform", "uppercase");
    await expect(heading).toHaveCSS("text-align", "center");
    await expect(heading).toHaveCSS("color", "rgb(255, 0, 120)");

    const firstCard = cards.first();
    await expect(firstCard).toHaveCSS("padding-top", "20px");
    await expect(firstCard).toHaveCSS("padding-left", "20px");
    await expect(firstCard).toHaveCSS("border-radius", "10px");
    await expect(firstCard).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(firstCard).toHaveCSS(
      "box-shadow",
      /rgba\(0, 0, 0, 0\.19\) 0px 0px 10px 0px/,
    );

    const wrapper = firstCard.locator(":scope > div");
    await expect(wrapper).toHaveCSS("display", "flex");
    await expect(wrapper).toHaveCSS("flex-direction", target.rowDirection);
    await expect(wrapper).toHaveCSS("align-items", "center");

    const title = firstCard.locator("h3");
    await expect(title).toHaveCSS("font-size", "18px");
    await expect(title).toHaveCSS("line-height", "21.6px");
    await expect(title).toHaveCSS("font-weight", "600");
    await expect(title).toHaveCSS("text-transform", "uppercase");
    await expect(title).toHaveCSS("color", "rgb(54, 0, 64)");
    await expect(title).toHaveCSS("margin-top", "8px");
    await expect(title).toHaveCSS("margin-bottom", "6px");

    const description = firstCard.locator("p");
    await expect(description).toHaveCSS("font-size", "15px");
    await expect(description).toHaveCSS("line-height", "22.5px");
    await expect(description).toHaveCSS("font-weight", "500");
    await expect(description).toHaveCSS("color", "rgb(122, 122, 122)");

    const content = wrapper.locator(":scope > div");
    await expect(content).toHaveCSS("margin-right", target.contentMarginRight);

    const innerBox = await inner.boundingBox();
    expect(innerBox?.width).toBeCloseTo(target.innerWidth, 1);
    const headingBox = await heading.boundingBox();
    expect(headingBox?.height).toBeCloseTo(target.headingHeight, 1);

    const contentBox = await content.boundingBox();
    expect(contentBox?.width).toBeCloseTo(target.contentWidth, 1);
    const descriptionBox = await description.boundingBox();
    expect(descriptionBox?.height).toBeCloseTo(target.descriptionHeight, 1);

    const cardBoxes = [];
    for (let index = 0; index < 3; index += 1) {
      const card = cards.nth(index);
      await expect(card.locator("img")).toHaveCSS(
        "margin-bottom",
        target.imageMarginBottom,
      );
      const imageBox = await card.locator("img").boundingBox();
      expect(imageBox?.width).toBeCloseTo(target.imageWidth, 1);
      expect(imageBox?.height).toBeCloseTo(target.imageHeights[index], 1);
      cardBoxes.push(await card.boundingBox());
    }

    for (let index = 0; index < 3; index += 1) {
      expect(cardBoxes[index]?.height).toBeCloseTo(
        target.cardHeights[index],
        1,
      );
    }
    expect(
      (cardBoxes[0]?.y ?? 0) -
        ((headingBox?.y ?? 0) + (headingBox?.height ?? 0)),
    ).toBeCloseTo(40, 1);
    for (let index = 1; index < 3; index += 1) {
      expect(
        (cardBoxes[index]?.y ?? 0) -
          ((cardBoxes[index - 1]?.y ?? 0) +
            (cardBoxes[index - 1]?.height ?? 0)),
      ).toBeCloseTo(40, 1);
    }

    const sectionBox = await bonuses.boundingBox();
    expect(sectionBox?.height).toBeCloseTo(target.sectionHeight, 1);
  }
});

test("reveals the bonus cards with the reference bounceIn timing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const bonuses = page.locator('section[aria-labelledby="bonuses-title"]');
  await bonuses.scrollIntoViewIfNeeded();
  const firstCard = bonuses.locator("article").first();
  await expect(firstCard).toHaveCSS("animation-name", "bounceIn");
  await expect(firstCard).toHaveCSS("animation-duration", "1.25s");
  await expect(firstCard).toHaveCSS("animation-delay", "0s");
  await expect(firstCard).toHaveCSS("animation-fill-mode", "none");
  await expect(firstCard).toHaveCSS("animation-iteration-count", "1");
  await expect(firstCard).toHaveCSS("opacity", "1");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await bonuses.scrollIntoViewIfNeeded();
  await expect(bonuses.locator("article").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});

const benefitTargets = [
  {
    label: "320x640",
    viewport: { width: 320, height: 640 },
    sectionHeight: 1053.281,
    sectionPaddingX: "20px",
    innerWidth: 280,
    innerPaddingY: "30px",
    innerMaxWidth: "767px",
    headingSize: "35px",
    headingHeight: 70,
    subheadingSize: "23px",
    subheadingHeight: 46,
    cardWidth: 260,
    cardHeights: [217.594, 240.094, 217.594],
    cardDirection: "column",
    textHeights: [90, 112.5, 90],
    titleHeight: 21.594,
    ctaWidth: 280,
    ctaHeight: 72,
    ctaFontSize: "16px",
  },
  {
    label: "390x844",
    viewport: { width: 390, height: 844 },
    sectionHeight: 947.281,
    sectionPaddingX: "20px",
    innerWidth: 350,
    innerPaddingY: "30px",
    innerMaxWidth: "767px",
    headingSize: "35px",
    headingHeight: 70,
    subheadingSize: "23px",
    subheadingHeight: 46,
    cardWidth: 330,
    cardHeights: [195.094, 195.094, 195.094],
    cardDirection: "column",
    textHeights: [67.5, 67.5, 67.5],
    titleHeight: 21.594,
    ctaWidth: 302.469,
    ctaHeight: 56,
    ctaFontSize: "16px",
  },
  {
    label: "768x1024",
    viewport: { width: 768, height: 1024 },
    sectionHeight: 719.188,
    sectionPaddingX: "50px",
    innerWidth: 668,
    innerPaddingY: "80px",
    innerMaxWidth: "1024px",
    headingSize: "44px",
    headingHeight: 88,
    subheadingSize: "37px",
    subheadingHeight: 37,
    cardWidth: 202.67,
    cardHeights: [284.188, 284.188, 284.188],
    cardDirection: "row",
    textHeights: [135, 135, 135],
    titleHeight: 43.188,
    ctaWidth: 348.094,
    ctaHeight: 60,
    ctaFontSize: "20px",
  },
  {
    label: "1440x1000",
    viewport: { width: 1440, height: 1000 },
    sectionHeight: 586.094,
    sectionPaddingX: "50px",
    innerWidth: 1140,
    innerPaddingY: "80px",
    innerMaxWidth: "1140px",
    headingSize: "44px",
    headingHeight: 44,
    subheadingSize: "37px",
    subheadingHeight: 37,
    cardWidth: 358.391,
    cardHeights: [195.094, 195.094, 195.094],
    cardDirection: "row",
    textHeights: [67.5, 67.5, 67.5],
    titleHeight: 21.594,
    ctaWidth: 348.094,
    ctaHeight: 60,
    ctaFontSize: "20px",
  },
  {
    label: "2560x1440",
    viewport: { width: 2560, height: 1440 },
    sectionHeight: 586.094,
    sectionPaddingX: "50px",
    innerWidth: 1140,
    innerPaddingY: "80px",
    innerMaxWidth: "1140px",
    headingSize: "44px",
    headingHeight: 44,
    subheadingSize: "37px",
    subheadingHeight: 37,
    cardWidth: 358.391,
    cardHeights: [195.094, 195.094, 195.094],
    cardDirection: "row",
    textHeights: [67.5, 67.5, 67.5],
    titleHeight: 21.594,
    ctaWidth: 348.094,
    ctaHeight: 60,
    ctaFontSize: "20px",
  },
] as const;

const benefitCardBackgrounds = [
  "rgb(64, 0, 76)",
  "rgb(255, 255, 255)",
  "rgb(255, 0, 120)",
] as const;
const benefitCardForegrounds = [
  "rgb(255, 255, 255)",
  "rgb(54, 0, 64)",
  "rgb(255, 255, 255)",
] as const;
const benefitCardDescriptionColors = [
  "rgb(255, 255, 255)",
  "rgb(122, 122, 122)",
  "rgb(255, 255, 255)",
] as const;

test("matches the benefits section composition across reference viewports", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const target of benefitTargets) {
    await page.setViewportSize(target.viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const benefits = page.locator('section[aria-labelledby="benefits-title"]');
    await benefits.scrollIntoViewIfNeeded();
    const cards = benefits.locator("li");
    await expect(cards).toHaveCount(3);

    await expect(benefits).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(benefits).toHaveCSS("padding-top", "0px");
    await expect(benefits).toHaveCSS("padding-left", target.sectionPaddingX);
    await expect(benefits).toHaveCSS("padding-right", target.sectionPaddingX);

    const inner = benefits.locator(":scope > div").first();
    await expect(inner).toHaveCSS("display", "flex");
    await expect(inner).toHaveCSS("flex-direction", "column");
    await expect(inner).toHaveCSS("padding-top", target.innerPaddingY);
    await expect(inner).toHaveCSS("padding-bottom", target.innerPaddingY);
    await expect(inner).toHaveCSS("max-width", target.innerMaxWidth);

    const headings = benefits.locator("h2");
    await expect(headings).toHaveCount(2);
    await expect(headings.nth(0)).toHaveCSS("font-size", target.headingSize);
    await expect(headings.nth(0)).toHaveCSS("line-height", target.headingSize);
    await expect(headings.nth(0)).toHaveCSS("font-weight", "900");
    await expect(headings.nth(0)).toHaveCSS("color", "rgb(255, 0, 120)");
    await expect(headings.nth(0)).toHaveCSS("text-align", "center");
    await expect(headings.nth(0)).toHaveCSS("text-transform", "none");
    await expect(headings.nth(1)).toHaveCSS("font-size", target.subheadingSize);
    await expect(headings.nth(1)).toHaveCSS(
      "line-height",
      target.subheadingSize,
    );
    await expect(headings.nth(1)).toHaveCSS("color", "rgb(54, 0, 64)");

    const list = benefits.locator("ul");
    await expect(list).toHaveCSS("display", "flex");
    await expect(list).toHaveCSS("flex-direction", target.cardDirection);
    await expect(list).toHaveCSS("gap", "20px");
    await expect(list).toHaveCSS("padding-top", "10px");
    await expect(list).toHaveCSS("padding-bottom", "10px");
    await expect(list).toHaveCSS("margin-top", "40px");
    await expect(list).toHaveCSS("margin-left", "10px");
    await expect(list).toHaveCSS("margin-right", "10px");

    const cta = benefits.getByRole("link", { name: /quero mudar de vida/i });
    await expect(cta).toHaveCSS("display", "inline-block");
    await expect(cta).toHaveCSS("border-radius", "30px");
    await expect(cta).toHaveCSS("padding-top", "20px");
    await expect(cta).toHaveCSS("padding-left", "60px");
    await expect(cta).toHaveCSS("padding-right", "60px");
    await expect(cta).toHaveCSS("font-size", target.ctaFontSize);
    await expect(cta).toHaveCSS("line-height", target.ctaFontSize);
    await expect(cta).toHaveCSS("font-weight", "500");
    await expect(cta).toHaveCSS("background-color", "rgb(255, 0, 120)");

    const innerBox = await inner.boundingBox();
    expect(innerBox?.width).toBeCloseTo(target.innerWidth, 1);
    const headingBox = await headings.nth(0).boundingBox();
    expect(headingBox?.height).toBeCloseTo(target.headingHeight, 1);
    const subheadingBox = await headings.nth(1).boundingBox();
    expect(subheadingBox?.height).toBeCloseTo(target.subheadingHeight, 1);

    const titleHeight = target.titleHeight;
    for (let index = 0; index < 3; index += 1) {
      const card = cards.nth(index);
      await expect(card).toHaveCSS("padding-top", "20px");
      await expect(card).toHaveCSS("padding-left", "20px");
      await expect(card).toHaveCSS("border-radius", "10px");
      await expect(card).toHaveCSS(
        "background-color",
        benefitCardBackgrounds[index],
      );
      await expect(card).toHaveCSS(
        "box-shadow",
        /rgba\(0, 0, 0, 0\.19\) 0px 0px 10px 0px/,
      );

      const icon = card.locator("svg");
      await expect(icon).toHaveCSS("color", benefitCardForegrounds[index]);
      await expect(icon).toHaveCSS("width", "58px");
      await expect(icon).toHaveCSS("height", "58px");

      const title = card.locator("h3");
      await expect(title).toHaveCSS("font-size", "18px");
      await expect(title).toHaveCSS("line-height", "21.6px");
      await expect(title).toHaveCSS("font-weight", "600");
      await expect(title).toHaveCSS("text-transform", "uppercase");
      await expect(title).toHaveCSS("margin-top", "8px");
      await expect(title).toHaveCSS("margin-bottom", "0px");
      await expect(title).toHaveCSS("color", benefitCardForegrounds[index]);

      const description = card.locator("p");
      await expect(description).toHaveCSS("font-size", "15px");
      await expect(description).toHaveCSS("line-height", "22.5px");
      await expect(description).toHaveCSS("font-weight", "500");
      await expect(description).toHaveCSS(
        "color",
        benefitCardDescriptionColors[index],
      );

      const cardBox = await card.boundingBox();
      expect(cardBox?.width).toBeCloseTo(target.cardWidth, 0);
      expect(cardBox?.height).toBeCloseTo(target.cardHeights[index], 1);
      const descriptionBox = await description.boundingBox();
      expect(descriptionBox?.height).toBeCloseTo(target.textHeights[index], 1);
      const titleBox = await title.boundingBox();
      expect(titleBox?.height).toBeCloseTo(titleHeight, 1);
    }

    const ctaBox = await cta.boundingBox();
    expect(ctaBox?.width).toBeCloseTo(target.ctaWidth, 1);
    expect(ctaBox?.height).toBeCloseTo(target.ctaHeight, 1);

    const sectionBox = await benefits.boundingBox();
    expect(sectionBox?.height).toBeCloseTo(target.sectionHeight, 1);
  }
});

test("keeps the benefits call to action still, matching the inert reference rule", async ({
  page,
}) => {
  // The reference declares `.devagar { animation: pulse 2s infinite }` on this
  // button, but never ships `@keyframes pulse`, so nothing actually animates
  // (`getAnimations()` is empty and the computed transform stays `none`).
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const benefits = page.locator('section[aria-labelledby="benefits-title"]');
  await benefits.scrollIntoViewIfNeeded();
  const cta = benefits.getByRole("link", { name: /quero mudar de vida/i });
  await expect(cta).toHaveCSS("animation-name", "none");
  // Only CSS animations count here: the button's own 300ms `transition-all`
  // briefly transitions `opacity` when the reveal un-hides the section.
  const runningAnimations = await cta.evaluate((element) =>
    element
      .getAnimations()
      .filter((animation) => Object.hasOwn(animation, "animationName"))
      .map(
        (animation) =>
          (animation as unknown as { animationName: string }).animationName,
      ),
  );
  expect(runningAnimations).toEqual([]);
});

test("matches conversion, support sections, and FAQ multi-open behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const offer = page.locator('section[aria-labelledby="offer-title"]');
  await expect(
    offer.locator('img[alt="Garantia de reembolso em até 7 dias"]'),
  ).toHaveCount(1);
  await expect(
    offer.locator('img[alt="Métodos de pagamento aceitos"]'),
  ).toHaveCount(1);

  const bonuses = page.locator('section[aria-labelledby="bonuses-title"]');
  await bonuses.scrollIntoViewIfNeeded();
  await expect(bonuses.locator("article")).toHaveCount(3);
  const bonusBackground = bonuses.locator('[aria-hidden="true"]');
  await expect(bonusBackground).toHaveCSS("background-image", /marble/);
  await expect(bonusBackground).toHaveCSS("opacity", "0.5");
  await expect(bonuses.locator("article").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );

  const benefits = page.locator('section[aria-labelledby="benefits-title"]');
  await benefits.scrollIntoViewIfNeeded();
  await expect(benefits).toHaveCSS("background-color", "rgb(255, 255, 255)");
  const benefitHeadings = benefits.locator("h2");
  await expect(benefitHeadings).toHaveCount(2);
  await expect(benefitHeadings.nth(0)).toHaveCSS("font-size", "44px");
  await expect(benefitHeadings.nth(0)).toHaveCSS("line-height", "44px");
  await expect(benefitHeadings.nth(1)).toHaveCSS("font-size", "37px");
  await expect(benefitHeadings.nth(1)).toHaveCSS("line-height", "37px");
  const benefitCards = benefits.locator("li");
  await expect(benefitCards).toHaveCount(3);
  await expect(benefits.locator("h3")).toHaveCount(3);
  await expect(benefitCards.locator("svg")).toHaveCount(3);
  await expect(benefitCards.nth(0).locator("svg")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
  const benefitsCta = benefits.getByRole("link", {
    name: /quero mudar de vida/i,
  });
  await expect(benefitsCta).toHaveCSS("width", "348.094px");
  await expect(benefitsCta).toHaveCSS("font-size", "20px");
  await expect(benefitsCta).toHaveCSS("font-weight", "500");
  await expect(benefitsCta).toHaveCSS("line-height", "20px");
  await expect(benefitsCta).toHaveCSS("padding-left", "60px");
  await expect(benefitsCta).toHaveCSS("padding-right", "60px");
  await expect(benefitCards.nth(0)).toHaveCSS(
    "background-color",
    "rgb(64, 0, 76)",
  );
  await expect(benefitCards.nth(1)).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await expect(benefitCards.nth(2)).toHaveCSS(
    "background-color",
    "rgb(255, 0, 120)",
  );

  const instructor = page.locator(
    'section[aria-labelledby="instructor-title"]',
  );
  await instructor.scrollIntoViewIfNeeded();
  await expect(instructor).toHaveAttribute("id", "quemsou");
  await expect(instructor).toHaveCSS("isolation", "isolate");
  await expect(instructor).toHaveCSS("overflow", "hidden");
  const instructorBackground = instructor.locator(
    "[data-instructor-background]",
  );
  await expect(instructorBackground).toHaveAttribute("aria-hidden", "true");
  await expect(instructorBackground).toHaveCSS(
    "background-image",
    /instructor-background/,
  );
  await expect(instructorBackground).toHaveCSS(
    "background-position",
    "68% 0px",
  );
  await expect(instructorBackground).toHaveCSS("background-size", "cover");
  const instructorOverlay = instructor.locator("[data-instructor-overlay]");
  await expect(instructorOverlay).toHaveAttribute("aria-hidden", "true");
  await expect(instructorOverlay).toHaveCSS(
    "background-image",
    /linear-gradient/,
  );
  await expect(instructor).toHaveCSS("background-color", "rgb(255, 240, 248)");
  const instructorInner = instructor.locator("[data-instructor-inner]");
  await expect(instructorInner).toHaveCSS("flex-wrap", "nowrap");
  await expect(instructor.locator("h2")).toHaveCSS("font-size", "55px");
  await expect(instructor.locator("h2")).toHaveCSS("line-height", "55px");
  await expect(instructor.locator('img[src*="signature"]')).toHaveCount(1);
  await expect(
    instructor.locator('img[alt="Professora do curso Nail Art"]'),
  ).toHaveCount(1);
  const contentOrder = await instructor
    .locator("h2, img, p")
    .evaluateAll((elements) =>
      elements.map((element) => {
        if (element.matches('img[src*="signature"]')) return "signature";
        if (element.matches("p")) return "bio";
        return element.tagName.toLowerCase();
      }),
    );
  expect(contentOrder.indexOf("signature")).toBeLessThan(
    contentOrder.indexOf("bio"),
  );

  const faq = page.locator('section[aria-labelledby="faq-title"]');
  await faq.scrollIntoViewIfNeeded();
  await expect(faq).toHaveCSS("padding-left", "50px");
  await expect(faq).toHaveCSS("padding-right", "50px");
  await expect(faq).toHaveCSS("padding-top", "0px");
  await expect(faq).toHaveCSS("padding-bottom", "0px");
  const faqBackground = faq.locator(':scope > [aria-hidden="true"]');
  await expect(faqBackground).toHaveCSS("background-image", /marble-secondary/);
  await expect(faqBackground).toHaveCSS("opacity", "0.5");
  const faqInner = faq.locator(":scope > div").nth(1);
  await expect(faqInner).toHaveCSS("gap", "20px");
  await expect(faqInner).toHaveCSS("padding-top", "80px");
  await expect(faqInner).toHaveCSS("padding-bottom", "180px");
  await expect(faq.locator("h2").first()).toHaveCSS("font-size", "55px");
  await expect(faq.locator("h2").first()).toHaveCSS("line-height", "55px");
  await expect(faq.locator("p").first()).toHaveCSS("font-size", "18px");
  await expect(faq.locator("p").first()).toHaveCSS("line-height", "18px");
  const questions = faq.getByRole("button");
  await expect(questions).toHaveCount(5);
  await expect(questions.first()).toHaveCSS("height", "59px");
  await expect(questions.first()).toHaveCSS("padding", "20px");
  await expect(questions.first()).toHaveCSS("font-size", "19px");
  await expect(questions.first()).toHaveCSS("line-height", "19px");
  await expect(questions.first().locator("svg").first()).toHaveCSS(
    "width",
    "15px",
  );
  await expect(questions.first().locator("svg").first()).toHaveCSS(
    "height",
    "15px",
  );
  await questions.nth(0).click();
  await questions.nth(1).click();
  await expect(questions.nth(0)).toHaveAttribute("data-state", "open");
  await expect(questions.nth(1)).toHaveAttribute("data-state", "open");

  const footer = page.locator("footer");
  await expect(footer).toHaveCSS("margin-top", "-130px");
  await expect(footer).toHaveCSS("background-image", /footer-background/);
  await expect(footer).toHaveCSS("background-position", "50% 0%");
  await expect(footer.locator('img[alt="Nail Art"]')).toHaveCount(1);
  await expect(
    footer.getByRole("link", { name: /quero mudar de vida/i }),
  ).toHaveCount(1);
  await expect(footer.locator("p").first()).toContainText("Nenhuma informação");
});

test("stacks benefits cards and preserves mobile gutters", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const benefits = page.locator('section[aria-labelledby="benefits-title"]');
  await benefits.scrollIntoViewIfNeeded();
  const cards = benefits.locator("li");
  await expect(cards).toHaveCount(3);

  const firstCard = await cards.nth(0).boundingBox();
  const secondCard = await cards.nth(1).boundingBox();
  expect(firstCard?.x).toBeCloseTo(30, 0);
  expect(firstCard?.width).toBeCloseTo(330, 0);
  expect(secondCard?.x).toBeCloseTo(30, 0);
  expect(secondCard?.y).toBeGreaterThan(firstCard?.y ?? 0);
});

test("never scales a reference image past its intrinsic cap between breakpoints", async ({
  page,
}) => {
  // Elementor leaves these images at their own intrinsic width, so between the
  // sampled viewports the container is wider than the image. Forcing `w-full`
  // pushed them past their cap and inflated whole sections (104px on the
  // audience section at 767px before the fix).
  const cases = [
    {
      name: "audience collage",
      selector: 'img[src*="audience-collage"]',
      cap: 600,
      ratio: 600 / 587,
    },
    {
      name: "instructor portrait",
      selector: 'img[alt="Professora do curso Nail Art"]',
      cap: 600,
      ratio: 1200 / 1678,
    },
  ] as const;

  for (const width of [640, 700, 744, 767, 900, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    for (const testCase of cases) {
      const image = page.locator(testCase.selector).first();
      await image.scrollIntoViewIfNeeded();
      // Layout box, not the painted box: the instructor portrait carries
      // alignment transforms that inflate its bounding rect.
      const { width, height, containerWidth } = await image.evaluate(
        (element) => {
          const style = getComputedStyle(element);
          const parent = element.parentElement;
          const parentStyle = parent ? getComputedStyle(parent) : null;
          return {
            width: Number.parseFloat(style.width),
            height: Number.parseFloat(style.height),
            containerWidth: parent
              ? parent.clientWidth -
                Number.parseFloat(parentStyle?.paddingLeft ?? "0") -
                Number.parseFloat(parentStyle?.paddingRight ?? "0")
              : 0,
          };
        },
      );
      const expected = Math.min(containerWidth, testCase.cap);
      expect(width).toBeCloseTo(expected, 0);
      if (containerWidth > testCase.cap) {
        // The cap must actually be binding in this band, which is the case the
        // earlier `w-full` implementation got wrong.
        expect(width).toBeCloseTo(testCase.cap, 0);
      }
      expect(width / height).toBeCloseTo(testCase.ratio, 1);
    }
  }

  // The offer guarantee and the footer logo carry the same intrinsic cap.
  await page.setViewportSize({ width: 767, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const guarantee = page.locator(
    'img[alt="Garantia de reembolso em até 7 dias"]',
  );
  await guarantee.scrollIntoViewIfNeeded();
  const guaranteeWidth = await guarantee.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).width),
  );
  expect(guaranteeWidth).toBeCloseTo(450, 0);

  const logo = page.locator('img[alt="Nail Art"]');
  await logo.scrollIntoViewIfNeeded();
  const logoWidth = await logo.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).width),
  );
  expect(logoWidth).toBeCloseTo(392, 0);
});
