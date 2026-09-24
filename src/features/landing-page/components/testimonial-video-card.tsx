"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type TestimonialVideoCardProps = {
  label: string;
  posterUrl: string;
};

export function TestimonialVideoCard({
  label,
  posterUrl,
}: TestimonialVideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `${label.toLowerCase().replaceAll(" ", "-")}-title`;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        aria-label={label}
        className="relative block w-full cursor-pointer overflow-hidden rounded-[10px] shadow-[0_6px_10px_rgb(0_0_0_/_28%)]"
        onClick={() => setIsOpen(true)}
        ref={buttonRef}
        type="button"
      >
        <Image
          fetchPriority="low"
          alt=""
          className="block aspect-video w-full object-cover"
          height={576}
          loading="lazy"
          sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1439px) calc((100vw - 140px) / 3), 367px"
          src={posterUrl}
          unoptimized
          width={1024}
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex h-[49.5px] w-[43px] -translate-x-1/2 -translate-y-1/2 flex-col items-center opacity-80 drop-shadow-[1px_0_6px_rgb(0_0_0_/_30%)]"
        >
          <svg
            aria-hidden="true"
            className="size-[43px]"
            fill="none"
            focusable="false"
            viewBox="0 0 43 43"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="21.5"
              cy="21.5"
              r="19.65"
              stroke="white"
              strokeWidth="1.7"
            />
            <path d="M18.8 16.9V27.6L27.6 22.25Z" fill="white" />
          </svg>
        </span>
      </button>

      <dialog
        aria-labelledby={titleId}
        className="m-auto w-[min(90vw,760px)] rounded-2xl bg-brand p-0 text-white shadow-2xl backdrop:bg-black/70"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeDialog();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeDialog();
          }
        }}
        onClose={() => {
          setIsOpen(false);
          buttonRef.current?.focus();
        }}
        ref={dialogRef}
      >
        <div className="relative p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2
              className="font-heading text-xl font-bold uppercase"
              id={titleId}
            >
              {label}
            </h2>
            <button
              aria-label="Fechar depoimento"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/70 text-2xl leading-none transition-colors hover:bg-white/15 focus-visible:bg-white/15"
              onClick={closeDialog}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          {isOpen ? (
            <Image
              fetchPriority="low"
              alt=""
              className="aspect-video w-full rounded-lg object-cover"
              height={576}
              src={posterUrl}
              unoptimized
              width={1024}
            />
          ) : null}
          <p className="mt-4 text-center text-sm leading-6 text-white/90">
            Esta é a prévia local do depoimento. O vídeo completo será conectado
            quando houver uma fonte aprovada para publicação.
          </p>
        </div>
      </dialog>
    </>
  );
}
