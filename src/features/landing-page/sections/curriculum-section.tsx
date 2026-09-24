"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { landingContent } from "@/features/landing-page/landing-content";
import { cn } from "@/lib/utils";

const moduleIcons = [
  { id: "module-1", viewBox: "0 0 64 64" },
  { id: "module-2", viewBox: "0 0 512 512" },
  { id: "module-3", viewBox: "-29 0 487 487.71902" },
  { id: "module-4", viewBox: "0 0 512 512" },
  { id: "module-5", viewBox: "0 0 512 512" },
  { id: "module-6", viewBox: "0 0 512 512" },
] as const;

type ModuleCardTone = "light" | "purple" | "pink";

const moduleCardTones: Record<string, readonly ModuleCardTone[]> = {
  tecnicas: ["light", "purple", "light", "purple", "light", "purple"],
  produtos: ["purple", "light", "purple", "light", "purple", "light"],
  "modelo-de-negocio": ["light", "pink", "light", "light", "pink", "light"],
};

const moduleCardStyles: Record<
  ModuleCardTone,
  { background: string; description: string; icon: string; title: string }
> = {
  light: {
    background: "bg-white",
    description: "text-[#767676]",
    icon: "text-[#360040]",
    title: "text-[#360040]",
  },
  pink: {
    background: "bg-[#e0006a]",
    description: "text-white",
    icon: "text-white",
    title: "text-white",
  },
  purple: {
    background: "bg-[#360040]",
    description: "text-white",
    icon: "text-[#ff0078]",
    title: "text-[#ff107f]",
  },
};

type ModuleCardProps = {
  description: string;
  index: number;
  title: string;
  tone: ModuleCardTone;
};

function ModuleCard({ description, index, title, tone }: ModuleCardProps) {
  const icon = moduleIcons[index % moduleIcons.length];
  const cardStyle = moduleCardStyles[tone];
  const cardRef = useRef<HTMLLIElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInViewport(true);
        observer.disconnect();
      }
    });

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      className={cn(
        "rounded-[10px] p-5 shadow-[0_0_10px_rgb(0_0_0_/_19%)]",
        cardStyle.background,
        // Same reasoning as ScrollReveal: `opacity` keeps the module list
        // readable by assistive tech before the card enters the viewport.
        !isInViewport && "pointer-events-none opacity-0",
        isInViewport && "animate-[bounceIn_1.25s] motion-reduce:animate-none",
      )}
      ref={cardRef}
    >
      <svg
        aria-hidden="true"
        className={cn("mx-auto block size-[58px]", cardStyle.icon)}
        fill="currentColor"
        viewBox={icon.viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        <use href={`/media/nailpro/module-icons/sprite.svg#${icon.id}`} />
      </svg>
      <h3
        className={cn(
          "mt-2 text-lg font-semibold uppercase leading-[21.6px]",
          cardStyle.title,
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-[15px] font-medium leading-[22.5px]",
          cardStyle.description,
        )}
      >
        {description}
      </p>
    </li>
  );
}

function getModuleTabValue(label: string) {
  return label
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

export function CurriculumSection() {
  const [firstModule, ...remainingModules] = landingContent.modules;
  const firstTabValue = getModuleTabValue(firstModule.label);

  return (
    <section
      aria-labelledby="curriculum-title"
      className="relative isolate overflow-hidden bg-transparent px-5 py-[30px] md:px-[50px] md:py-[80px]"
    >
      <picture className="pointer-events-none absolute inset-0 z-10 block">
        <source
          type="image/avif"
          media="(max-width: 560px)"
          srcSet="/media/nailpro/derived/marble-compact.avif"
        />
        <source
          type="image/avif"
          media="(min-width: 561px) and (max-width: 767px)"
          srcSet="/media/nailpro/derived/marble-mobile.avif"
        />
        <source
          type="image/avif"
          media="(min-width: 768px)"
          srcSet="/media/nailpro/derived/marble.avif"
        />
        <source
          type="image/webp"
          media="(max-width: 560px)"
          srcSet="/media/nailpro/derived/marble-compact.webp"
        />
        <source
          type="image/webp"
          media="(max-width: 767px)"
          srcSet="/media/nailpro/derived/marble-mobile.webp"
        />
        <Image
          alt=""
          className="h-full w-full object-cover object-center opacity-50"
          fill
          sizes="100vw"
          src="/media/nailpro/derived/marble.webp"
        />
      </picture>
      <div className="relative z-20 mx-auto max-w-[1140px] text-center">
        <h2
          className="font-heading text-[35px] font-black uppercase leading-[35px] text-[#ff0078] md:text-[55px] md:leading-[55px]"
          id="curriculum-title"
        >
          Módulos
        </h2>
        <p className="mt-5 text-[17px] font-semibold uppercase leading-[17px] text-[#360040] md:text-[18px] md:leading-[18px]">
          Confira o conteúdo que você irá aprender no curso
        </p>
        <Tabs
          activationMode="manual"
          className="mt-5 gap-0"
          defaultValue={firstTabValue}
        >
          <TabsList
            aria-labelledby="curriculum-title"
            className="mx-auto !h-auto flex w-full max-w-full flex-wrap justify-center gap-[10px] rounded-none bg-transparent p-0"
            variant="line"
          >
            {landingContent.modules.map(({ label }) => (
              <TabsTrigger
                className="h-[45.5px] flex-none cursor-pointer rounded-[10px] border-0 px-[30px] py-[10px] text-[17px] font-medium leading-[25.5px] text-[#360040] transition-all duration-300 ease-[ease] after:hidden data-[state=active]:!bg-[#40004c] data-[state=active]:!text-white data-[state=inactive]:bg-[#cecece95] data-[state=inactive]:text-[#360040] data-[state=inactive]:hover:bg-[#40004c] data-[state=inactive]:hover:text-white md:data-[state=inactive]:hover:bg-[#360040] motion-reduce:transition-none"
                key={label}
                value={getModuleTabValue(label)}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {[firstModule, ...remainingModules].map(({ label, items }) => {
            const tabValue = getModuleTabValue(label);

            return (
              <TabsContent
                className="mt-0 bg-white p-[30px]"
                key={label}
                tabIndex={-1}
                value={tabValue}
              >
                <ul className="grid grid-cols-1 gap-5 text-center md:grid-cols-3">
                  {items.map(({ title, description }, index) => {
                    const tone = moduleCardTones[tabValue]?.[index] ?? "light";

                    return (
                      <ModuleCard
                        description={description}
                        index={index}
                        key={title}
                        title={title}
                        tone={tone}
                      />
                    );
                  })}
                </ul>
              </TabsContent>
            );
          })}
        </Tabs>
        <a
          className="mx-auto mt-5 inline-flex h-auto min-h-[56px] cursor-pointer items-center justify-center rounded-[30px] bg-[#ff0078] px-[60px] py-[20px] text-white font-bold uppercase leading-[16px] shadow-[0_15px_10px_rgb(0_0_0_/_40%)] transition-all duration-300 ease-[ease] motion-reduce:transition-none md:h-[60px] md:min-h-0 md:text-xl md:leading-[20px]"
          href="#oferta"
          style={{
            fontFamily: '"Poppins CTA Medium", sans-serif',
            fontWeight: 700,
          }}
        >
          Quero mudar de vida
        </a>
      </div>
    </section>
  );
}
