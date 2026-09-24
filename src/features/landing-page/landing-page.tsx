import dynamic from "next/dynamic";
import Image from "next/image";

import { HeroVideoPlayer } from "./components/hero-video-player";
import { ScrollReveal } from "./components/scroll-reveal";
import { landingContent } from "./landing-content";
import {
  BonusesAndBenefitsSection,
  EducationSection,
  InstructorSection,
} from "./sections/supporting-sections";

// The interactive islands below the fold pull Radix (tabs, accordion, dialog)
// into the initial payload, where they compete with the hero images for the
// 1.6 Mbps budget PageSpeed simulates — and the LCP is decided in that window.
// `ssr: true` keeps the HTML identical; only the hydration code is deferred.
const CurriculumSection = dynamic(() =>
  import("./sections/curriculum-section").then((m) => m.CurriculumSection),
);
const FaqFooterSection = dynamic(() =>
  import("./sections/faq-footer-section").then((m) => m.FaqFooterSection),
);
const TestimonialsSection = dynamic(() =>
  import("./sections/testimonials-section").then((m) => m.TestimonialsSection),
);

export function LandingPage() {
  return (
    <>
      <main id="conteudo-principal">
        <section className="relative isolate z-[1] min-h-[874px] overflow-hidden bg-transparent px-6 pb-[50px] pt-[50px] text-white md:min-h-[874px] md:px-[50px] md:pb-[50px] md:pt-[50px] lg:px-6 lg:py-10">
          {/* Next's `priority` preloaded the `<img>` src unconditionally, so on
              mobile the browser fetched the 60 KB desktop art *and* the mobile
              one, with the wasted request still in flight at 2.8s. The banner
              is the LCP element under PageSpeed's emulation, so each variant is
              preloaded by media query instead: exactly one request per
              viewport, and the compact 833 px art for small phones (the
              1080-wide file is 2.17 MP and its decode dominated the measured
              1.98 s of LCP render delay under CPU throttling). */}
          {/* The banner is decorative art painted behind the hero, and the LCP
              element under PageSpeed's emulation is the video poster, so the
              poster is the only image preloaded at high priority. The banner
              stays eager (discovered by the preload scanner from the initial
              HTML, default priority) and is served in three tiers so phones
              fetch the 833 px compact crop instead of the 1920 px desktop one.
              Preloading it as well measurably slowed the LCP: it competed with
              the poster for the same bandwidth budget. */}
          <picture className="pointer-events-none absolute inset-0 -z-10 block">
            <source
              type="image/avif"
              media="(max-width: 560px)"
              srcSet="/media/nailpro/derived/hero-banner-compact.avif"
            />
            <source
              type="image/avif"
              media="(min-width: 561px) and (max-width: 767px)"
              srcSet="/media/nailpro/derived/hero-banner-mobile.avif"
            />
            <source
              type="image/avif"
              media="(min-width: 768px)"
              srcSet="/media/nailpro/derived/hero-banner.avif"
            />
            <source
              type="image/webp"
              media="(max-width: 560px)"
              srcSet="/media/nailpro/derived/hero-banner-compact.webp"
            />
            <source
              type="image/webp"
              media="(max-width: 767px)"
              srcSet="/media/nailpro/derived/hero-banner-mobile.webp"
            />
            <Image
              alt=""
              className="h-full w-full object-cover object-top md:object-bottom"
              fill
              loading="eager"
              sizes="100vw"
              src="/media/nailpro/derived/hero-banner.webp"
            />
          </picture>
          <div className="mx-auto grid max-w-[1140px] gap-8 md:grid-cols-[56.53%_minmax(0,1fr)] md:gap-0 lg:items-start">
            <div className="relative z-10 mx-auto flex max-w-[40rem] flex-col items-center text-center max-md:w-[calc(100%-0.75rem)] md:mx-0 md:max-lg:pt-[10px] lg:w-full lg:max-w-none lg:pt-[20px]">
              <ScrollReveal
                animation="fadeIn"
                as="h1"
                className="w-full font-heading text-[1.9375rem] leading-[31px] font-black uppercase md:mx-[10px] md:w-[calc(100%-1.25rem)] sm:text-[2.1875rem] sm:leading-[35px] lg:text-[2.1875rem] lg:leading-[35px]"
              >
                Aprenda como se tornar uma <br className="hidden lg:block" />
                <span className="text-[#ff0078]">
                  profissional de alongamento
                  <br className="hidden max-[374px]:block lg:block" />
                  de unhas
                </span>{" "}
                e fature muito sem <br className="hidden lg:block" />
                sair de casa
              </ScrollReveal>
              <HeroVideoPlayer
                className="max-md:mx-auto max-md:mt-[30px] max-md:max-w-none max-md:w-[calc(100%-1.25rem)] md:mx-[20px] md:mt-[30px] md:max-w-none md:w-[calc(100%-2.5rem)]"
                posterCompactUrl={landingContent.heroVideo.posterCompactUrl}
                posterUrl={landingContent.heroVideo.posterUrl}
                posterAvifUrl={landingContent.heroVideo.posterAvifUrl}
                posterCompactAvifUrl={
                  landingContent.heroVideo.posterCompactAvifUrl
                }
                unavailableBody={landingContent.heroVideo.unavailableBody}
                unavailableTitle={landingContent.heroVideo.unavailableTitle}
              />
              <div aria-hidden="true" className="h-[240px] md:hidden" />
              <a
                className="mt-7 w-full self-center rounded-[30px] bg-[#ff0078] p-5 text-center font-cta text-[20px] font-bold uppercase leading-[20px] text-white shadow-[0_15px_10px_rgba(0,0,0,0.4)] transition-all duration-300 ease-[ease] max-md:mx-auto max-md:mt-0 max-md:w-full md:mx-[10px] md:mt-[30px] md:w-[calc(100%-1.25rem)] motion-reduce:transition-none"
                href="#oferta"
              >
                Quero fazer parte
              </a>
              <Image
                alt="Métodos de pagamento aceitos"
                className="relative z-20 mt-5 h-auto w-full max-[374px]:mt-[20.359375px] md:mx-[10px] md:w-[calc(100%-1.25rem)] lg:mx-auto lg:w-[400px]"
                height={36}
                src="/media/nailpro/payment-methods.webp"
                width={400}
              />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="techniques-title"
          className="relative isolate -mt-[130px] overflow-x-clip bg-white px-5 pb-10 pt-[150px] md:px-[50px] md:pb-[100px] md:pt-[180px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 media-marble-techniques bg-center bg-cover opacity-50"
          />
          <div className="relative z-10 mx-auto max-w-[1140px]">
            <h2
              className="font-heading text-center text-[26px] leading-[26px] font-black uppercase text-[#ff0078] md:text-[55px] md:leading-[55px]"
              id="techniques-title"
            >
              Técnicas que você <br />
              aprenderá no curso
            </h2>
            <p className="mt-5 text-center text-[17px] leading-[17px] font-semibold uppercase text-[#360040] md:text-[18px] md:leading-[18px]">
              Veja um pouco do que você vai aprender
            </p>
            <ul className="mt-5 grid grid-cols-2 grid-rows-[repeat(4,1fr)] gap-5 p-[10px] md:grid-cols-4 md:grid-rows-[repeat(2,1fr)]">
              {landingContent.techniques.map(([name, src]) => (
                <ScrollReveal
                  animation="bounceIn"
                  as="li"
                  className="flex h-auto flex-col items-center rounded-[10px] bg-surface p-5 text-center shadow-[0_0_10px_rgba(0,0,0,0.19)] max-md:p-3"
                  key={name}
                >
                  <Image
                    alt=""
                    className="h-auto w-[85%] max-w-none rounded-full object-cover md:w-[59%] md:max-w-[134px]"
                    height={400}
                    sizes="(max-width: 640px) 35vw, 134px"
                    src={src}
                    width={400}
                  />
                  <h3 className="mt-[14.5px] mb-4 w-full whitespace-pre-line text-[12px] leading-[1.2] font-semibold uppercase text-[#360040] md:text-[15px] md:max-w-none">
                    {name}
                  </h3>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="audience-title"
          className="flex flex-col items-center bg-brand px-5 text-white md:px-[50px]"
        >
          <ScrollReveal
            animation="fadeIn"
            className="flex w-full max-w-[767px] flex-wrap items-center py-[30px] md:max-w-[1024px] md:flex-nowrap md:py-[80px] lg:max-w-[1140px]"
          >
            <div className="flex w-full flex-col gap-5 p-[10px] md:w-[54.9%]">
              <h2
                className="font-heading text-[35px] leading-[35px] font-black uppercase text-white md:text-[55px] md:leading-[55px]"
                id="audience-title"
              >
                Para quem é o <span className="text-[#ff0078]">#Nail Art?</span>
              </h2>
              <ul>
                {landingContent.audience.map((item) => (
                  <li
                    className="mb-[9.5px] flex items-center pb-[9.5px] last:mb-0 last:pb-0"
                    key={item}
                  >
                    <span aria-hidden="true" className="flex shrink-0 pr-3">
                      <svg
                        aria-hidden="true"
                        className="mr-[8.5px] size-[34px] md:mr-[7.75px] md:size-[31px]"
                        fill="white"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-6.248-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 22.628 0 22.628.001z" />
                      </svg>
                    </span>
                    <span className="block pl-[5px] text-[17px] leading-[25.5px] md:text-[19px] md:leading-[28.5px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pb-[30px] md:pb-0">
                <a
                  className="block w-full rounded-[30px] bg-[#ff0078] p-5 text-center text-white font-cta text-[20px] font-bold uppercase leading-[20px] shadow-[0_15px_10px_rgba(0,0,0,0.4)] transition-all duration-300 ease-[ease] motion-reduce:transition-none"
                  href="#oferta"
                >
                  {landingContent.ctaLabel}
                </a>
              </div>
            </div>
            <div className="flex w-full flex-col gap-5 p-[10px] md:w-[50%]">
              <Image
                alt="Técnicas de manicure"
                className="mx-auto aspect-[600/587] h-auto w-full max-w-[600px]"
                height={587}
                sizes="(max-width: 767px) 92vw, (max-width: 1023px) 42vw, 524px"
                src="/media/nailpro/derived/audience-collage.webp"
                width={600}
              />
            </div>
          </ScrollReveal>
        </section>

        <EducationSection />
        <CurriculumSection />
        <TestimonialsSection />

        <section
          aria-labelledby="offer-title"
          className="bg-brand px-5 text-white md:px-[50px]"
          id="oferta"
        >
          <div className="mx-auto flex w-full max-w-[767px] flex-col gap-5 py-[40px] md:max-w-[1024px] md:py-20 lg:max-w-[1140px]">
            <h2
              className="whitespace-pre-line text-center font-sans text-[18px] leading-[18px] font-semibold uppercase"
              id="offer-title"
            >
              {landingContent.offer.heading}
            </h2>
            <p className="mb-[14.4px] whitespace-pre-line text-center font-sans text-[17px] leading-[25.5px] font-medium text-white">
              {landingContent.offer.body}
            </p>
            <p className="text-center font-heading text-[89px] leading-[89px] font-black uppercase text-shadow-[0_25px_17px_rgb(0_0_0_/_30%)] md:text-[110px] md:leading-[110px]">
              {landingContent.offer.price}
            </p>
            <p className="text-center font-sans text-[23px] leading-[23px] font-semibold uppercase md:text-[30px] md:leading-[30px]">
              {landingContent.offer.cash}
            </p>
            <a
              className="inline-flex max-w-full self-center rounded-[30px] bg-[#ff0078] px-[30px] py-5 text-center font-heading text-[18px] leading-[18px] font-medium uppercase text-white shadow-[0_15px_10px_rgb(0_0_0_/_40%)] transition-all duration-300 ease-[ease] motion-reduce:transition-none md:px-[70px] md:text-2xl md:leading-[24px]"
              href="#oferta"
            >
              {landingContent.offer.ctaLabel}
            </a>
            <p className="mt-5 text-center font-sans text-[17px] leading-[17px] font-medium uppercase underline">
              {landingContent.offer.attention}
            </p>
            <div className="px-[10px]">
              <div className="flex w-full flex-col items-center gap-5 py-[10px] text-left md:flex-row md:items-center">
                <Image
                  alt="Garantia de reembolso em até 7 dias"
                  className="h-auto w-[72%] max-w-[450px] shrink-0 md:w-[22.375%]"
                  height={450}
                  sizes="(max-width: 767px) 72vw, 22.375vw"
                  src={landingContent.offer.guaranteeImage}
                  unoptimized
                  width={450}
                />
                <p className="mb-[14.4px] w-full text-center font-sans text-[17px] leading-[25.5px] font-medium text-white md:flex-1 md:text-left">
                  {landingContent.offer.guaranteeText}
                </p>
              </div>
            </div>
            <Image
              alt="Métodos de pagamento aceitos"
              className="h-auto w-full max-w-[400px] self-center"
              height={36}
              src={landingContent.offer.paymentMethodsImage}
              width={400}
            />
          </div>
        </section>
        <BonusesAndBenefitsSection />
        <InstructorSection />
      </main>
      <FaqFooterSection />
    </>
  );
}
