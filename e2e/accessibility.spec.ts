import AxeBuilder from "@axe-core/playwright";
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

test("has no automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await finishAnimations(
    page.locator('section[aria-labelledby="curriculum-title"] li'),
  );
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.effect?.getComputedTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished),
    );
  });

  // Audit the settled page. The reveal is driven by an IntersectionObserver
  // effect, so wait for the hero heading (the page's only `h1`) to finish
  // fading in instead of measuring a mid-hydration frame.
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("keeps audience icons decorative and content labeled", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const audience = page.locator('section[aria-labelledby="audience-title"]');
  await audience.scrollIntoViewIfNeeded();
  const icons = audience.locator('svg[aria-hidden="true"]');
  await expect(icons).toHaveCount(6);

  for (let index = 0; index < 6; index += 1) {
    await expect(icons.nth(index)).toHaveAttribute("aria-hidden", "true");
  }

  await expect(
    audience.getByRole("link", { name: /quero mudar de vida/i }),
  ).toHaveAttribute("href", "#oferta");
  await expect(audience.locator('img[alt="Técnicas de manicure"]')).toHaveCount(
    1,
  );
});

test("keeps curriculum tabs and cards accessible in every tab state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);

  const curriculum = page.locator(
    'section[aria-labelledby="curriculum-title"]',
  );
  await curriculum.scrollIntoViewIfNeeded();
  await finishAnimations(curriculum.locator('[role="tabpanel"]:visible li'));
  const tabs = curriculum.getByRole("tab");
  const panels = curriculum.getByRole("tabpanel");

  await expect(curriculum).toHaveAttribute(
    "aria-labelledby",
    "curriculum-title",
  );
  await expect(curriculum.locator('[role="tablist"]')).toHaveAttribute(
    "aria-labelledby",
    "curriculum-title",
  );
  await expect(tabs).toHaveCount(3);
  await expect(panels).toHaveCount(1);
  await expect(curriculum.locator('[role="tabpanel"]:visible')).toHaveCount(1);
  await expect(curriculum.locator('svg[aria-hidden="true"]')).toHaveCount(6);
  await expect(curriculum.getByRole("heading", { level: 3 })).toHaveCount(6);

  for (const tab of ["Técnicas", "Produtos", "Modelo de Negócio"]) {
    await curriculum.getByRole("tab", { name: tab }).click();
    await expect(curriculum.locator('[role="tabpanel"]:visible')).toHaveCount(
      1,
    );
    await finishAnimations(curriculum.locator('[role="tabpanel"]:visible li'));

    const results = await new AxeBuilder({ page })
      .include('section[aria-labelledby="curriculum-title"]')
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("keeps education content structured and decorative imagery hidden", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const education = page.locator('section[aria-labelledby="education-title"]');
  await education.scrollIntoViewIfNeeded();
  await expect(education).toHaveAttribute("aria-labelledby", "education-title");
  await expect(
    education.getByRole("heading", {
      name: "Por que trabalhar com alongamento?",
    }),
  ).toHaveCount(1);
  await expect(education.locator("p")).toHaveCount(6);
  await expect(
    education.locator('img[src*="why-alongamento"][alt=""]'),
  ).toHaveCount(1);
});

test("keeps testimonial cards labeled and dialog focus accessible", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const testimonials = page.locator(
    'section[aria-labelledby="testimonials-title"]',
  );
  await testimonials.scrollIntoViewIfNeeded();
  const cards = testimonials.getByRole("button", {
    name: /^Assistir depoimento [1-6]$/,
  });

  await expect(testimonials).toHaveAttribute(
    "aria-labelledby",
    "testimonials-title",
  );
  await expect(cards).toHaveCount(6);
  await expect(testimonials.locator('svg[aria-hidden="true"]')).toHaveCount(6);
  await finishAnimations(testimonials.locator("ul"));

  const results = await new AxeBuilder({ page })
    .include('section[aria-labelledby="testimonials-title"]')
    .analyze();
  expect(results.violations).toEqual([]);

  const firstCard = cards.first();
  await firstCard.focus();
  await firstCard.press("Enter");
  const dialog = page.getByRole("dialog", {
    name: /assistir depoimento 1/i,
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Fechar depoimento" }),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(firstCard).toBeFocused();
});
