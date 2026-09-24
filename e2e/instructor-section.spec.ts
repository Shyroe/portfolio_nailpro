import { expect, test } from "@playwright/test";

const instructorTargets = [
  {
    name: "compact-320",
    viewport: { width: 320, height: 640 },
    sectionHeight: 1552.453,
    sectionPaddingX: "20px",
    innerPaddingTop: "30px",
    innerPaddingBottom: "50px",
    innerWidth: 280,
    innerMaxWidth: "767px",
    copyWidth: 280,
    portraitColumnWidth: 280,
    titleSize: "35px",
    titleHeight: 105,
    titleAlign: "center",
    signatureWidth: 169,
    signatureCentered: true,
    bioHeight: 867.563,
    paragraphHeights: [135, 189, 270, 216],
    portraitWidth: 260,
    portraitHeight: 363.563,
  },
  {
    name: "mobile-390",
    viewport: { width: 390, height: 844 },
    // Deliberate deviation: the reference caps the signature widget at 65px on
    // mobile, so the 71.5px signature overlaps the first bio line by 6.5px.
    // Ours lets the widget size to the image, adding those 6.5px here.
    sectionHeight: 1441.5,
    sectionPaddingX: "20px",
    innerPaddingTop: "30px",
    innerPaddingBottom: "50px",
    innerWidth: 350,
    innerMaxWidth: "767px",
    copyWidth: 350,
    portraitColumnWidth: 350,
    titleSize: "35px",
    titleHeight: 70,
    titleAlign: "center",
    signatureWidth: 214.5,
    signatureCentered: true,
    bioHeight: 678.563,
    paragraphHeights: [108, 135, 216, 162],
    portraitWidth: 330,
    portraitHeight: 461.438,
  },
  {
    name: "tablet-768",
    viewport: { width: 768, height: 1024 },
    sectionHeight: 1136.563,
    sectionPaddingX: "50px",
    innerPaddingTop: "80px",
    innerPaddingBottom: "80px",
    innerWidth: 668,
    innerMaxWidth: "1024px",
    copyWidth: 365.469,
    portraitColumnWidth: 302.531,
    titleSize: "55px",
    titleHeight: 165,
    titleAlign: "start",
    signatureWidth: 300,
    signatureCentered: false,
    bioHeight: 651.563,
    paragraphHeights: [108, 135, 189, 162],
    portraitWidth: 282.531,
    portraitHeight: 395.063,
  },
  {
    name: "desktop-1440",
    viewport: { width: 1440, height: 1000 },
    sectionHeight: 873.984,
    sectionPaddingX: "50px",
    innerPaddingTop: "80px",
    innerPaddingBottom: "80px",
    innerWidth: 1140,
    innerMaxWidth: "1140px",
    copyWidth: 623.703,
    portraitColumnWidth: 516.297,
    titleSize: "55px",
    titleHeight: 110,
    titleAlign: "start",
    signatureWidth: 300,
    signatureCentered: false,
    bioHeight: 408.563,
    paragraphHeights: [54, 81, 108, 108],
    portraitWidth: 496.297,
    portraitHeight: 693.984,
  },
  {
    name: "ultrawide-2560",
    viewport: { width: 2560, height: 1440 },
    sectionHeight: 873.984,
    sectionPaddingX: "50px",
    innerPaddingTop: "80px",
    innerPaddingBottom: "80px",
    innerWidth: 1140,
    innerMaxWidth: "1140px",
    copyWidth: 623.703,
    portraitColumnWidth: 516.297,
    titleSize: "55px",
    titleHeight: 110,
    titleAlign: "start",
    signatureWidth: 300,
    signatureCentered: false,
    bioHeight: 408.563,
    paragraphHeights: [54, 81, 108, 108],
    portraitWidth: 496.297,
    portraitHeight: 693.984,
  },
] as const;

test("matches instructor composition across reference viewports", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const target of instructorTargets) {
    await page.setViewportSize(target.viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const instructor = page.locator(
      'section[aria-labelledby="instructor-title"]',
    );
    const instructorInner = instructor.locator("[data-instructor-inner]");
    const copyColumn = instructor.locator("[data-instructor-copy]");
    const portraitColumn = instructor.locator(
      "[data-instructor-portrait-column]",
    );
    const backgroundMedia = instructor.locator("[data-instructor-background]");
    const overlay = instructor.locator("[data-instructor-overlay]");
    const title = instructor.locator("h2");
    const signature = instructor.locator(
      'img[src*="signature-livia-montelume"]',
    );
    const portrait = instructor.locator(
      'img[alt="Professora do curso Nail Art"]',
    );

    await instructor.evaluate((element) => {
      element.scrollIntoView({ block: "start", inline: "nearest" });
    });
    await page.waitForTimeout(1200);

    await expect(instructor).toBeVisible();
    await expect(instructor).toHaveAttribute("id", "quemsou");
    await expect(instructor).toHaveCSS("isolation", "isolate");
    await expect(instructor).toHaveCSS("overflow", "hidden");
    await expect(instructor).toHaveCSS(
      "background-color",
      "rgb(255, 240, 248)",
    );
    // The section carries only the horizontal gutters; the vertical rhythm
    // lives on the inner container, exactly as in the reference.
    await expect(instructor).toHaveCSS("padding-top", "0px");
    await expect(instructor).toHaveCSS("padding-left", target.sectionPaddingX);
    await expect(instructor).toHaveCSS("padding-right", target.sectionPaddingX);
    await expect(instructorInner).toHaveCSS("gap", "0px");
    await expect(instructorInner).toHaveCSS(
      "padding-top",
      target.innerPaddingTop,
    );
    await expect(instructorInner).toHaveCSS(
      "padding-bottom",
      target.innerPaddingBottom,
    );
    await expect(instructorInner).toHaveCSS("max-width", target.innerMaxWidth);

    await expect(backgroundMedia).toHaveAttribute("aria-hidden", "true");
    await expect(backgroundMedia).toHaveCSS(
      "background-image",
      /instructor-background/,
    );
    await expect(backgroundMedia).toHaveCSS("background-size", "cover");
    await expect(overlay).toHaveAttribute("aria-hidden", "true");
    await expect(overlay).toHaveCSS("background-image", /linear-gradient/);

    await expect(title).toHaveText("CONHEÇA SUA PROFESSORA");
    await expect(title).toHaveCSS("font-size", target.titleSize);
    await expect(title).toHaveCSS("line-height", target.titleSize);
    await expect(title).toHaveCSS("font-weight", "900");
    await expect(title).toHaveCSS("text-align", target.titleAlign);
    await expect(title).toHaveCSS("text-transform", "none");
    await expect(title).toHaveCSS("color", "rgb(255, 0, 120)");

    const paragraphs = instructor.locator("p");
    await expect(paragraphs).toHaveCount(4);
    for (let index = 0; index < 4; index += 1) {
      const paragraph = paragraphs.nth(index);
      await expect(paragraph).toHaveCSS("font-size", "18px");
      await expect(paragraph).toHaveCSS("font-weight", "500");
      await expect(paragraph).toHaveCSS("line-height", "27px");
      await expect(paragraph).toHaveCSS("color", "rgb(95, 91, 91)");
      await expect(paragraph).toHaveCSS("margin-top", "0px");
      // The reference keeps the 14.4px bottom margin on every paragraph,
      // including the last one.
      await expect(paragraph).toHaveCSS("margin-bottom", "14.4px");
    }

    await expect(portrait).toHaveAttribute("width", "1200");
    await expect(portrait).toHaveAttribute("height", "1678");
    // The static export ships pre-generated derivatives instead of the Next
    // image optimizer, so the browser receives a single 2x WebP (no
    // `srcset`/`sizes` pair) and `w-full max-w-[600px]` is what caps the
    // portrait at 600 CSS pixels.
    await expect(portrait).toHaveAttribute(
      "src",
      "/media/nailpro/derived/instructor-portrait.webp",
    );
    expect(await portrait.getAttribute("srcset")).toBeNull();

    const sectionBox = await instructor.boundingBox();
    expect(sectionBox?.x).toBe(0);
    expect(sectionBox?.width).toBe(target.viewport.width);
    expect(sectionBox?.height).toBeCloseTo(target.sectionHeight, 1);

    const innerBox = await instructorInner.boundingBox();
    expect(innerBox?.width).toBeCloseTo(target.innerWidth, 1);
    const titleBox = await title.boundingBox();
    expect(titleBox?.height).toBeCloseTo(target.titleHeight, 1);

    const copyBox = await copyColumn.boundingBox();
    const portraitBox = await portraitColumn.boundingBox();
    expect(copyBox?.width).toBeCloseTo(target.copyWidth, 1);
    expect(portraitBox?.width).toBeCloseTo(target.portraitColumnWidth, 1);
    if (target.viewport.width >= 768) {
      // Side by side from 768px up; stacked (wrapped) below that.
      expect(copyBox?.y).toBeCloseTo(portraitBox?.y ?? 0, 1);
    }

    await expect(copyColumn).toHaveCSS("padding-left", "10px");
    await expect(copyColumn).toHaveCSS("padding-top", "10px");
    await expect(copyColumn).toHaveCSS("gap", "20px");

    const signatureBox = await signature.boundingBox();
    expect(signatureBox?.width).toBeCloseTo(target.signatureWidth, 1);
    if (target.signatureCentered) {
      const copyContentCenter = (copyBox?.x ?? 0) + (copyBox?.width ?? 0) / 2;
      expect(
        (signatureBox?.x ?? 0) + (signatureBox?.width ?? 0) / 2,
      ).toBeCloseTo(copyContentCenter, 1);
    } else {
      expect(signatureBox?.x).toBeCloseTo((copyBox?.x ?? 0) + 10, 1);
    }

    // The signature widget sizes to the image (the reference's 65px mobile
    // cap is a defect that made the name overlap the bio text).
    const signatureWidget = signature.locator("..");
    const signatureWidgetBox = await signatureWidget.boundingBox();
    expect(signatureWidgetBox?.height).toBeCloseTo(
      target.signatureWidth * (100 / 300),
      1,
    );
    const bioBox = await instructor.locator("p").first().boundingBox();
    expect(bioBox?.y).toBeCloseTo(
      (signatureWidgetBox?.y ?? 0) + (signatureWidgetBox?.height ?? 0) + 20,
      1,
    );
    const bioContainer = await page.evaluate(() => {
      const section = document.querySelector(
        'section[aria-labelledby="instructor-title"]',
      );
      const node = section?.querySelector(
        "[data-instructor-copy] > div:last-child",
      );
      return node ? node.getBoundingClientRect().height : 0;
    });
    expect(bioContainer).toBeCloseTo(target.bioHeight, 1);

    for (let index = 0; index < 4; index += 1) {
      const paragraphBox = await paragraphs.nth(index).boundingBox();
      expect(paragraphBox?.height).toBeCloseTo(
        target.paragraphHeights[index],
        1,
      );
    }

    // The alignment transforms on the replacement portrait only affect the
    // rendered bounding box; the layout box must still match the reference.
    const portraitLayout = await portrait.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        width: Number.parseFloat(style.width),
        height: Number.parseFloat(style.height),
      };
    });
    expect(portraitLayout.width).toBeCloseTo(target.portraitWidth, 1);
    expect(portraitLayout.height).toBeCloseTo(target.portraitHeight, 1);

    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(documentWidth).toBeLessThanOrEqual(target.viewport.width);

    await expect(instructorInner).toHaveCSS(
      "flex-wrap",
      target.viewport.width >= 768 ? "nowrap" : "wrap",
    );
    if (target.viewport.width >= 768) {
      expect(portraitBox?.x).toBeGreaterThan(copyBox?.x ?? 0);
      await expect(title).toHaveCSS("text-align", "start");
    } else {
      expect(copyBox?.y).toBeLessThan(
        portraitBox?.y ?? Number.POSITIVE_INFINITY,
      );
    }

    await page.screenshot({
      fullPage: false,
      path: `ref/current-project/implementation-captures/instructor-section/${target.name}.png`,
    });
  }
});

test("ships the derived instructor portrait with a usable alpha mask", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const alphaPixels = await page.evaluate(async () => {
    // Read the shipped derivative, not the raw source: the cut-out has to
    // survive the WebP conversion, otherwise the portrait would composite
    // a solid rectangle over the section background.
    const response = await fetch(
      "/media/nailpro/derived/instructor-portrait.webp",
    );
    const bitmap = await createImageBitmap(await response.blob());
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) {
      return {
        transparent: 0,
        opaque: 0,
        mask: { bottomLeft: 0, bottomRight: 0, lowerCenter: 0 },
      };
    }
    context.drawImage(bitmap, 0, 0);
    const { width, height } = bitmap;
    const pixels = context.getImageData(0, 0, width, height).data;
    bitmap.close();
    let transparent = 0;
    let opaque = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] < 250) transparent += 1;
      if (pixels[index] > 250) opaque += 1;
    }
    const alphaAt = (x: number, y: number) => pixels[(y * width + x) * 4 + 3];
    return {
      transparent,
      opaque,
      mask: {
        bottomLeft: alphaAt(0, height - 1),
        bottomRight: alphaAt(width - 1, height - 1),
        lowerCenter: alphaAt(600, 1500),
      },
    };
  });
  expect(alphaPixels.transparent).toBeGreaterThan(1000);
  expect(alphaPixels.opaque).toBeGreaterThan(1000);
  expect(alphaPixels.mask.bottomLeft).toBeLessThan(10);
  expect(alphaPixels.mask.bottomRight).toBeLessThan(10);
  expect(alphaPixels.mask.lowerCenter).toBeGreaterThan(240);
});

test("keeps the signature clear of the biography across the mobile range", async ({
  page,
}) => {
  // The reference caps the signature widget at 65px below 768px while the
  // image keeps its 3:1 aspect, so from ~375px up the name is drawn on top of
  // the first paragraph (68px of overlap at 767px). Ours must never overlap.
  for (const width of [320, 360, 375, 500, 600, 700, 767]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const instructor = page.locator(
      'section[aria-labelledby="instructor-title"]',
    );
    await instructor.scrollIntoViewIfNeeded();
    const signature = instructor.locator(
      'img[src*="signature-livia-montelume"]',
    );
    // `content-visibility: auto` renders a section only once it approaches the
    // viewport, and the web fonts reflow the copy underneath it, so wait for
    // both before measuring — the same "in view and settled" rule the visual
    // evidence follows.
    await expect
      .poll(async () => (await signature.boundingBox())?.height ?? 0)
      .toBeGreaterThan(0);
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    // The signature PNG is `fetchpriority="low"` (it is below the fold), so its
    // intrinsic size only lands after the fetch: wait for the decode too.
    await expect
      .poll(() =>
        signature.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const signatureBox = await signature.boundingBox();
    const firstParagraphBox = await instructor
      .locator("p")
      .first()
      .boundingBox();
    expect(signatureBox).not.toBeNull();
    expect(firstParagraphBox).not.toBeNull();
    const gap =
      (firstParagraphBox?.y ?? 0) -
      ((signatureBox?.y ?? 0) + (signatureBox?.height ?? 0));
    expect(gap).toBeCloseTo(20, 1);
  }
});
