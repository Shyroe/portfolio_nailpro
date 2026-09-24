"use client";

import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/features/landing-page/components/scroll-reveal";
import { landingContent } from "@/features/landing-page/landing-content";

export function FaqFooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <section
        aria-labelledby="faq-title"
        className="relative bg-white px-5 md:px-[50px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 media-marble-faq bg-center bg-cover opacity-50"
        />
        <div className="relative z-10 mx-auto flex max-w-[1140px] flex-col gap-5 pt-[30px] pb-[130px] text-center md:pt-20 md:pb-[180px]">
          <h2
            className="font-heading text-[55px] leading-[55px] font-black uppercase text-[#ff0078]"
            id="faq-title"
          >
            FAQ
          </h2>
          <p className="font-sans text-[18px] font-semibold uppercase leading-[18px] text-[#360040]">
            Perguntas frequentes
          </p>
          <ScrollReveal animation="fadeIn">
            <Accordion className="text-left" type="multiple">
              {landingContent.faq.map(([question, answer], index) => (
                <AccordionItem
                  className="mb-4 rounded-[30px] border-0 last:mb-0"
                  key={question}
                  value={`faq-${index + 1}`}
                >
                  <AccordionTrigger className="p-5 font-sans text-[19px] font-normal leading-[19px] text-white data-[state=open]:text-[#ff0078]">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="px-[10px] py-3 font-sans text-[15px] font-normal leading-[22.5px] text-[#7a7a7a] md:p-[15px]">
                    <p className="mb-[14.4px]">{answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>
      <footer className="relative -mt-[130px] media-footer-background bg-[position:center_top] bg-cover px-5 text-center text-white md:px-[50px]">
        <div className="relative mx-auto flex max-w-[1140px] flex-col items-center gap-5 pt-[120px] pb-5 md:pt-[250px] md:pb-[50px]">
          <p className="mb-[14.4px] w-full font-sans text-[17px] font-medium leading-[25.5px]">
            {landingContent.footer.disclaimer}
          </p>
          <a
            className="mt-[10px] rounded-[30px] bg-[#ff0078] px-[60px] py-5 font-heading text-[16px] font-bold uppercase leading-[16px] shadow-[0_15px_10px_rgba(0,0,0,0.4)] transition-all duration-300 ease-[ease] motion-reduce:transition-none md:text-[20px] md:leading-[20px]"
            href="#oferta"
            style={{
              fontFamily: '"Poppins CTA Medium", sans-serif',
            }}
          >
            {landingContent.ctaLabel}
          </a>
          <Image
            fetchPriority="low"
            alt="Nail Art"
            className="h-auto w-[66%] max-w-[392px] md:w-[22%]"
            height={206}
            src="/media/nailpro/derived/brand-logo.webp"
            width={392}
          />
          <p className="text-[15px] font-medium uppercase leading-[15px]">
            {landingContent.footer.copyright.replace(
              "{year}",
              String(currentYear),
            )}
          </p>
        </div>
      </footer>
    </>
  );
}
