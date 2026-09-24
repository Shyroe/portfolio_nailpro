import { expect, test } from "@playwright/test";

const faqViewports = [
  { name: "compact-320", width: 320, height: 640 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "ultrawide-2560", width: 2560, height: 1440 },
] as const;

test("matches FAQ and footer composition across reference viewports", async ({
  page,
}) => {
  for (const viewport of faqViewports) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const faq = page.locator('section[aria-labelledby="faq-title"]');
    const faqInner = faq.locator(":scope > div").nth(1);
    const questions = faq.getByRole("button");
    const items = faq.locator('[data-slot="accordion-item"]');
    const footer = page.locator("footer");

    await faq.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    const mobile = viewport.width < 768;
    await expect(faq).toHaveCSS("padding-left", mobile ? "20px" : "50px");
    await expect(faq).toHaveCSS("padding-right", mobile ? "20px" : "50px");
    await expect(faq).toHaveCSS("padding-top", "0px");
    await expect(faq).toHaveCSS("padding-bottom", "0px");
    await expect(faqInner).toHaveCSS("gap", "20px");
    await expect(faqInner).toHaveCSS("padding-top", mobile ? "30px" : "80px");
    await expect(faqInner).toHaveCSS(
      "padding-bottom",
      mobile ? "130px" : "180px",
    );

    const faqTitle = faq.locator("h2").first();
    const faqSubtitle = faq.locator("p").first();
    await expect(faqTitle).toHaveCSS("font-size", "55px");
    await expect(faqTitle).toHaveCSS("line-height", "55px");
    await expect(faqSubtitle).toHaveCSS("font-size", "18px");
    await expect(faqSubtitle).toHaveCSS("line-height", "18px");
    await expect(faqSubtitle).toHaveCSS("font-weight", "600");

    await expect(questions).toHaveCount(5);
    await expect(items).toHaveCount(5);
    await expect(questions.first()).toHaveCSS(
      "height",
      viewport.width === 320 ? "78px" : "59px",
    );
    await expect(questions.first()).toHaveCSS("padding", "20px");
    await expect(questions.first()).toHaveCSS("font-size", "19px");
    await expect(questions.first()).toHaveCSS("line-height", "19px");
    // The reference floats the caret and keeps the title inline, so wrapped
    // titles only clear the icon on their first line.
    const caret = questions.first().locator('[data-slot="accordion-icon"]');
    await expect(questions.first()).toHaveCSS("display", "block");
    await expect(caret).toHaveCSS("float", "left");
    await expect(caret).toHaveCSS("width", "15px");
    await expect(questions.first().locator("svg").first()).toHaveCSS(
      "width",
      "15px",
    );
    await expect(questions.first().locator("svg").first()).toHaveCSS(
      "height",
      "15px",
    );
    await expect(questions.first().locator("svg").first()).toHaveCSS(
      "margin-left",
      "-5px",
    );

    const itemHeights = await items.evaluateAll((elements) =>
      elements.map((element) =>
        Math.round(element.getBoundingClientRect().height),
      ),
    );
    // A bar is one or two 19px lines plus its 20px padding.
    expect(itemHeights.every((height) => height === 59 || height === 78)).toBe(
      true,
    );
    if (viewport.width === 320) {
      expect(itemHeights).toEqual([78, 78, 78, 78, 78]);
    }
    if (viewport.width === 390) {
      expect(itemHeights).toEqual([59, 59, 78, 78, 59]);
    }
    if (viewport.width >= 768) {
      expect(itemHeights).toEqual([59, 59, 59, 59, 59]);
    }

    await faq.screenshot({
      path: `ref/current-project/implementation-captures/faq-section/${viewport.name}.png`,
    });

    await expect(questions.first()).toHaveCSS("cursor", "pointer");
    const openContent = faq.locator('[data-slot="accordion-content"]').first();
    await questions.first().click();
    const openingAnimation = await openContent.evaluate((element) => {
      const animation = element.getAnimations()[0];
      return {
        duration: animation?.effect?.getComputedTiming().duration,
        name: (animation as CSSAnimation | undefined)?.animationName,
        playState: animation?.playState,
      };
    });
    expect(openingAnimation).toMatchObject({
      duration: 400,
      name: "accordion-down",
      playState: "running",
    });
    await expect(questions.first()).toHaveAttribute("data-state", "open");
    await expect(questions.first()).toHaveAttribute("aria-expanded", "true");
    await expect(openContent).toBeVisible();
    await page.waitForTimeout(450);
    const openContentInner = openContent.locator(":scope > div");
    await expect(openContentInner).toHaveCSS(
      "padding",
      mobile ? "12px 10px" : "15px",
    );
    await expect(openContentInner.locator("p").first()).toHaveCSS(
      "margin-bottom",
      "14.4px",
    );
    await expect(items.first()).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(questions.first().locator("svg").nth(1)).toHaveCSS(
      "color",
      "rgb(255, 0, 120)",
    );
    const openFirstItem = await items.first().boundingBox();
    if (viewport.width === 390) {
      expect(openFirstItem?.height).toBeCloseTo(344.89, 0);
    }
    if (viewport.width >= 1440) {
      expect(openFirstItem?.height).toBeCloseTo(193.39, 0);
    }

    await expect(footer).toHaveCSS("margin-top", "-130px");
    await expect(footer).toHaveCSS(
      "background-image",
      mobile ? /footer-rodape/ : /footer-background/,
    );
    await expect(footer).toHaveCSS("background-position", "50% 0%");
    const footerLogo = footer.locator('img[alt="Nail Art"]');
    const footerCta = footer.getByRole("link", {
      name: /quero mudar de vida/i,
    });
    await expect(footerLogo).toHaveCount(1);
    await expect(footerCta).toHaveCSS("font-size", mobile ? "16px" : "20px");
    const footerCtaBox = await footerCta.boundingBox();
    const expectedCtaWidth =
      viewport.width === 320 ? 280 : mobile ? 302.47 : 348.09;
    const expectedCtaHeight = viewport.width === 320 ? 72 : mobile ? 56 : 60;
    expect(footerCtaBox?.width).toBeCloseTo(expectedCtaWidth, 0);
    expect(footerCtaBox?.height).toBeCloseTo(expectedCtaHeight, 0);
    const footerLogoBox = await footerLogo.boundingBox();
    const footerInnerWidth = Math.min(
      1140,
      viewport.width - (mobile ? 40 : 100),
    );
    expect(footerLogoBox?.width).toBeCloseTo(
      footerInnerWidth * (mobile ? 0.66 : 0.22),
      0,
    );
    await expect(footer.locator("p").first()).toHaveCSS("font-size", "17px");
    await expect(footer.locator("p").first()).toHaveCSS(
      "line-height",
      "25.5px",
    );
    await expect(footer.locator("p").last()).toContainText(
      String(new Date().getFullYear()),
    );

    await faq.screenshot({
      path: `ref/current-project/implementation-captures/faq-section/${viewport.name}-open.png`,
    });
    await footer.screenshot({
      path: `ref/current-project/implementation-captures/faq-section/${viewport.name}-footer.png`,
    });
  }
});

test("disables FAQ motion when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const faq = page.locator('section[aria-labelledby="faq-title"]');
  await faq.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const trigger = faq.getByRole("button").first();
  const content = faq.locator('[data-slot="accordion-content"]').first();
  await trigger.click();
  await expect(content).toHaveAttribute("data-state", "open");
  await expect(content).toHaveCSS("animation-name", "none");
});
