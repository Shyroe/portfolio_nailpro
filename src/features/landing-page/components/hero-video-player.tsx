"use client";

import Image from "next/image";
import { useState } from "react";

type HeroVideoPlayerProps = {
  className?: string;
  posterCompactUrl: string;
  posterUrl: string;
  posterAvifUrl: string;
  posterCompactAvifUrl: string;
  unavailableBody: string;
  unavailableTitle: string;
};

export function HeroVideoPlayer({
  className,
  posterCompactUrl,
  posterUrl,
  posterAvifUrl,
  posterCompactAvifUrl,
  unavailableBody,
  unavailableTitle,
}: HeroVideoPlayerProps) {
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  return (
    <div className={`relative mt-7 w-full max-w-[38rem] ${className ?? ""}`}>
      {videoUnavailable ? (
        <div
          className="flex aspect-[1.77777] w-full flex-col items-center justify-center gap-3 rounded-xl bg-[#360040] px-8 text-center text-white shadow-2xl"
          data-state="unavailable"
        >
          <div aria-live="polite" className="flex flex-col items-center gap-2">
            <svg
              aria-hidden="true"
              className="size-10 fill-[#ff0078]"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m1 15h-2v-2h2zm0-4h-2V7h2z" />
            </svg>
            <p className="font-heading text-lg font-bold uppercase text-[#ff0078]">
              {unavailableTitle}
            </p>
            <p className="max-w-[30rem] text-sm leading-6 text-white/90">
              {unavailableBody}
            </p>
          </div>
          <button
            className="mt-1 rounded-full border border-white/70 px-5 py-3 font-heading text-xs font-bold uppercase transition-colors duration-300 ease-[ease] hover:bg-white hover:text-[#360040] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
            onClick={() => setVideoUnavailable(false)}
            type="button"
          >
            Voltar à capa do vídeo
          </button>
        </div>
      ) : (
        <button
          aria-label="Assistir vídeo de apresentação do curso"
          className="relative block aspect-[1.77777] w-full cursor-pointer"
          onClick={() => setVideoUnavailable(true)}
          type="button"
        >
          {/* The reference paints this poster as a CSS background, so it is
              always eager, and it competes for LCP with the hero banner. Next's
              `priority` emitted a preload without `fetchpriority` — what
              Lighthouse reports as `priorityHinted: false` — and PageSpeed
              flagged the 1024-wide file as oversized for the 352px slot, so the
              compact variant is preloaded by media query for small phones. */}
          <link
            as="image"
            type="image/avif"
            fetchPriority="high"
            href={posterCompactAvifUrl}
            media="(max-width: 560px)"
            rel="preload"
          />
          <link
            as="image"
            type="image/avif"
            fetchPriority="high"
            href={posterAvifUrl}
            media="(min-width: 561px)"
            rel="preload"
          />
          <picture className="block h-full w-full">
            <source
              type="image/avif"
              media="(max-width: 560px)"
              srcSet={posterCompactAvifUrl}
            />
            <source type="image/avif" srcSet={posterAvifUrl} />
            <source
              type="image/webp"
              media="(max-width: 560px)"
              srcSet={posterCompactUrl}
            />
            <Image
              alt=""
              className="h-full w-full rounded-xl object-cover shadow-2xl"
              decoding="sync"
              fetchPriority="high"
              height={576}
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 560px"
              src={posterUrl}
              width={1024}
            />
          </picture>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
          >
            <svg
              aria-hidden="true"
              className="size-[49px] fill-white drop-shadow-[1px_0_6px_rgb(0_0_0_/_30%)]"
              focusable="false"
              viewBox="0 0 1000 1000"
            >
              <path d="M838 162C746 71 633 25 500 25 371 25 258 71 163 162 71 254 25 367 25 500 25 633 71 746 163 837 254 929 367 979 500 979 633 979 746 933 838 837 929 746 975 633 975 500 975 367 929 254 838 162M808 192C892 279 933 379 933 500 933 621 892 725 808 808 725 892 621 938 500 938 379 938 279 896 196 808 113 725 67 621 67 500 67 379 108 279 196 192 279 108 383 62 500 62 621 62 721 108 808 192M438 392V642L642 517 438 392Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
