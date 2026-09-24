#!/usr/bin/env node
/**
 * Build-time image derivatives for the static Cloudflare export.
 *
 * `output: "export"` removes the Next image optimizer, which today turns a
 * 2.1 MB instructor PNG into a ~50 KB variant and a 724 KB mobile hero into a
 * much smaller payload. Instead of paying a runtime image service (Cloudflare
 * Image Resizing is not enabled on the zone and is a paid feature) or adding a
 * dependency, this project ships AVIF/WebP derivatives generated locally with
 * ImageMagick (the same tool `scripts/reference/download-assets.mjs` already
 * uses) and `next/image` runs with `unoptimized: true`.
 *
 * Provenance: every derivative is registered in the asset manifest as a local
 * asset derived from a tracked source file, so the manifest stays auditable.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const MEDIA = "public/media/nailpro";

const PROCESSING = {
  "image/avif": "libheif AVIF",
  "image/webp": "libwebp WebP",
  "image/jpeg": "JPEG cover crop",
  "image/png": "PNG",
};

const FORMAT_TYPES = {
  avif: "image/avif",
  webp: "image/webp",
  jpeg: "image/jpeg",
  png: "image/png",
};
const DERIVED = `${MEDIA}/derived`;

// [source file, output file, target width, webp quality, purpose]
export const DERIVATIVES = [
  ["hero-banner.png", "hero-banner.webp", 1920, 80, "hero banner (desktop)"],
  [
    "hero-banner.png",
    "og-cover.jpg",
    1200,
    82,
    "Open Graph / Twitter cover",
    { format: "jpeg", crop: "1200x630" },
  ],
  [
    "hero-banner-mobile.png",
    "hero-banner-mobile.webp",
    1080,
    78,
    "hero banner (mobile)",
  ],
  // Compact variants: PageSpeed emulates a 476x885 viewport at DPR 1.75, so
  // the 1080-wide banner (2.17 MP) was both over-sized and slow to decode
  // under CPU throttling — its decode was the bulk of the LCP render delay.
  // 833 px matches that DPR exactly; wider phones keep the 1080 asset.
  [
    "hero-banner-mobile.png",
    "hero-banner-compact.webp",
    833,
    78,
    "hero banner (compact phones)",
  ],
  [
    "hero-video.png",
    "hero-video-compact.webp",
    640,
    80,
    "hero video poster (compact phones)",
  ],
  ["hero-video.png", "hero-video.webp", 1024, 80, "hero video poster (LCP)"],
  [
    "audience-collage.png",
    "audience-collage.webp",
    600,
    80,
    "audience collage",
  ],
  ["marble.jpg", "marble.webp", 1920, 75, "light marble section background"],
  [
    "marble-secondary.jpg",
    "marble-secondary.webp",
    1920,
    75,
    "FAQ marble background",
  ],
  [
    "marble-mobile.png",
    "marble-mobile.webp",
    1080,
    75,
    "mobile marble background",
  ],
  [
    "why-alongamento.jpg",
    "why-alongamento.webp",
    1920,
    78,
    "education background (desktop)",
  ],
  [
    "why-alongamento-mobile.png",
    "why-alongamento-mobile.webp",
    1080,
    78,
    "education background (mobile)",
  ],
  [
    "testimonials-background.jpg",
    "testimonials-background.webp",
    1920,
    75,
    "testimonials background (desktop)",
  ],
  [
    "testimonials-background-mobile.png",
    "testimonials-background-mobile.webp",
    1080,
    75,
    "testimonials background (mobile)",
  ],
  [
    "instructor-background.jpg",
    "instructor-background.webp",
    1920,
    75,
    "instructor background",
  ],
  [
    "footer-rodape.png",
    "footer-rodape.webp",
    1080,
    78,
    "footer torn band (mobile)",
  ],
  [
    "footer-background.png",
    "footer-background.webp",
    1920,
    78,
    "footer band (desktop)",
  ],
  ["brand-logo.png", "brand-logo.webp", 392, 85, "footer brand logo"],
  // CSS caps the portrait at 600px, so 1200 keeps it sharp on 2x displays.
  [
    "instructor-portrait-manicurist-brush-clean-hand-mask-1200x1678.png",
    "instructor-portrait.webp",
    1200,
    80,
    "instructor portrait",
  ],
  // Compact variants for the decorative art that is painted full-bleed at
  // every width. PageSpeed emulates a 476x885 viewport at DPR 1.75, so an
  // 833 px file is exact there while the wider art stays for 561-767 px.
  [
    "instructor-background.jpg",
    "instructor-background-compact.webp",
    833,
    78,
    "instructor background (compact phones)",
  ],
  [
    "footer-rodape.png",
    "footer-rodape-compact.webp",
    833,
    80,
    "footer band (compact phones)",
  ],
  [
    "marble-mobile.png",
    "marble-compact.webp",
    833,
    78,
    "light marble background (compact phones)",
  ],
  [
    "testimonials-background-mobile.png",
    "testimonials-background-compact.webp",
    833,
    78,
    "testimonials background (compact phones)",
  ],
  [
    "why-alongamento-mobile.png",
    "why-alongamento-compact.webp",
    833,
    78,
    "education background (compact phones)",
  ],
  // The favicon is requested on every visit and was a 19 KB PNG.
  ["brand-logo.png", "brand-icon.png", 64, 90, "favicon", { format: "png" }],
  ...[
    "technique-glitter",
    "technique-fitilho",
    "technique-babyboomer",
    "technique-crystal",
    "technique-fibra",
    "technique-tip",
    "technique-moldado",
    "technique-decoracao",
  ].map((name) => [
    `${name}.png`,
    `${name}.webp`,
    256,
    80,
    "technique card photo",
  ]),
];

// AVIF candidates follow the same dimensions as the WebP outputs. HTML picture
// sources and CSS image-set() choose exactly one format per browser, retaining
// WebP as a same-origin fallback without doubling downloads.
const AVIF_DERIVATIVES = [
  [
    "hero-banner.png",
    "hero-banner.avif",
    1920,
    48,
    "hero banner (desktop)",
    { format: "avif" },
  ],
  [
    "hero-banner-mobile.png",
    "hero-banner-mobile.avif",
    1080,
    48,
    "hero banner (mobile)",
    { format: "avif" },
  ],
  [
    "hero-banner-mobile.png",
    "hero-banner-compact.avif",
    833,
    48,
    "hero banner (compact phones)",
    { format: "avif" },
  ],
  [
    "hero-video.png",
    "hero-video.avif",
    1024,
    48,
    "hero video poster (LCP)",
    { format: "avif" },
  ],
  [
    "hero-video.png",
    "hero-video-compact.avif",
    640,
    48,
    "hero video poster (compact phones)",
    { format: "avif" },
  ],
  [
    "marble.jpg",
    "marble.avif",
    1920,
    48,
    "light marble section background",
    { format: "avif" },
  ],
  [
    "marble-secondary.jpg",
    "marble-secondary.avif",
    1920,
    48,
    "FAQ marble background",
    { format: "avif" },
  ],
  [
    "marble-mobile.png",
    "marble-mobile.avif",
    1080,
    48,
    "mobile marble background",
    { format: "avif" },
  ],
  [
    "marble-mobile.png",
    "marble-compact.avif",
    833,
    48,
    "light marble background (compact phones)",
    { format: "avif" },
  ],
  [
    "why-alongamento.jpg",
    "why-alongamento.avif",
    1920,
    48,
    "education background (desktop)",
    { format: "avif" },
  ],
  [
    "why-alongamento-mobile.png",
    "why-alongamento-mobile.avif",
    1080,
    48,
    "education background (mobile)",
    { format: "avif" },
  ],
  [
    "why-alongamento-mobile.png",
    "why-alongamento-compact.avif",
    833,
    48,
    "education background (compact phones)",
    { format: "avif" },
  ],
  [
    "testimonials-background.jpg",
    "testimonials-background.avif",
    1920,
    48,
    "testimonials background (desktop)",
    { format: "avif" },
  ],
  [
    "testimonials-background-mobile.png",
    "testimonials-background-mobile.avif",
    1080,
    48,
    "testimonials background (mobile)",
    { format: "avif" },
  ],
  [
    "testimonials-background-mobile.png",
    "testimonials-background-compact.avif",
    833,
    48,
    "testimonials background (compact phones)",
    { format: "avif" },
  ],
  [
    "instructor-background.jpg",
    "instructor-background.avif",
    1920,
    48,
    "instructor background",
    { format: "avif" },
  ],
  [
    "instructor-background.jpg",
    "instructor-background-compact.avif",
    833,
    48,
    "instructor background (compact phones)",
    { format: "avif" },
  ],
  [
    "footer-rodape.png",
    "footer-rodape.avif",
    1080,
    48,
    "footer torn band (mobile)",
    { format: "avif" },
  ],
  [
    "footer-rodape.png",
    "footer-rodape-compact.avif",
    833,
    48,
    "footer band (compact phones)",
    { format: "avif" },
  ],
  [
    "footer-background.png",
    "footer-background.avif",
    1920,
    48,
    "footer band (desktop)",
    { format: "avif" },
  ],
];

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

function run(command, args) {
  return execFileSync(command, args, { encoding: "utf8" }).trim();
}

export function generateDerivatives({ quiet = false } = {}) {
  fs.mkdirSync(DERIVED, { recursive: true });
  const rows = [];
  for (const [source, output, width, quality, purpose, options = {}] of [
    ...DERIVATIVES,
    ...AVIF_DERIVATIVES,
  ]) {
    const sourcePath = path.join(MEDIA, source);
    const outputPath = path.join(DERIVED, output);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`missing source asset: ${sourcePath}`);
    }
    const args = [sourcePath];
    if (options.crop) {
      args.push(
        "-resize",
        `${options.crop}^`,
        "-gravity",
        "center",
        "-extent",
        options.crop,
      );
    } else {
      args.push("-resize", `${width}x`);
    }
    args.push("-quality", String(quality));
    if (!options.format || options.format === "webp") {
      args.push("-define", "webp:method=6");
    }
    if (options.format === "avif") {
      args.push("-define", "heic:speed=6");
    }
    if (options.format === "png") {
      args.push("-strip", "-define", "png:compression-level=9");
    }
    args.push(outputPath);
    run("convert", args);
    const before = fs.statSync(sourcePath).size;
    const after = fs.statSync(outputPath).size;
    const [w, h] = run("identify", ["-format", "%w %h", outputPath]).split(" ");
    rows.push({
      source,
      output: `derived/${output}`,
      purpose,
      width: Number(w),
      height: Number(h),
      quality,
      beforeKB: kb(before),
      afterKB: kb(after),
      savedKB: kb(before - after),
      format: FORMAT_TYPES[options.format ?? "webp"],
      sha256: createHash("sha256")
        .update(fs.readFileSync(outputPath))
        .digest("hex"),
    });
  }
  if (!quiet) {
    console.log(
      "source -> derived                                  antes    depois   ganho",
    );
    let before = 0;
    let after = 0;
    for (const row of rows) {
      before += row.beforeKB;
      after += row.afterKB;
      console.log(
        `${row.source.padEnd(30)} -> ${row.output.padEnd(30)} ${String(row.beforeKB).padStart(7)}KB ${String(row.afterKB).padStart(7)}KB ${String(row.savedKB).padStart(7)}KB`,
      );
    }
    console.log(
      `TOTAL: ${Math.round(before)}KB -> ${Math.round(after)}KB (economia de ${Math.round(before - after)}KB, restam ${Math.round((after / before) * 100)}% do original)`,
    );
  }
  return rows;
}

export function updateManifest(rows) {
  const manifestPath = `${MEDIA}/manifest.json`;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const others = manifest.assets.filter(
    (asset) => !asset.path.includes("/derived/"),
  );
  const derived = rows.map((row) => ({
    path: path.posix.join(MEDIA, row.output),
    sourceUrl: `local-derived://lp-nailpro/${row.source}`,
    derivedFrom: path.posix.join(MEDIA, row.source),
    license: "Derived from a tracked project asset; same license as the source",
    processing: `ImageMagick ${PROCESSING[row.format] ?? "WebP"} q${row.quality} at ${row.width}px (static export without the Next image optimizer)`,
    purpose: row.purpose,
    contentType: row.format,
    sha256: row.sha256,
    dimensions: { width: row.width, height: row.height },
  }));
  manifest.assets = [...others, ...derived];
  manifest.generatedAt = new Date().toISOString();
  manifest.derivativesNote =
    "Derived AVIF and WebP assets for the static Cloudflare export. AVIF is selected with <picture>/CSS image-set where supported; WebP remains the fallback. Regenerate with `node scripts/build/generate-image-derivatives.mjs`.";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return derived.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = generateDerivatives();
  const count = updateManifest(rows);
  console.log(`manifest atualizado com ${count} derivadas.`);
}
