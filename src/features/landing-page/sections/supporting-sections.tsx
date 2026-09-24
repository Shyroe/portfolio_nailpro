import Image from "next/image";

import { ScrollReveal } from "@/features/landing-page/components/scroll-reveal";
import { landingContent } from "@/features/landing-page/landing-content";

type BenefitIconKind = "basic" | "didactic" | "market";

const basicBadgeCheck =
  "m321.24 148.843c-2.931-2.931-6.827-4.545-10.972-4.545s-8.041 1.614-10.971 4.545l-59.323 59.323-33.81-33.81c-6.05-6.049-15.893-6.049-21.943 0l-11.333 11.334c-2.931 2.931-4.545 6.827-4.545 10.972s1.614 8.041 4.545 10.971l50.446 50.447c4.588 4.587 10.614 6.881 16.64 6.881s12.053-2.294 16.64-6.881l75.961-75.96c6.049-6.05 6.049-15.894 0-21.943zm.727 22.67-75.96 75.959c-3.326 3.327-8.74 3.328-12.067 0l-50.447-50.447c-.037-.037-.151-.151-.151-.364 0-.214.114-.328.151-.365l11.333-11.334c.101-.101.233-.151.366-.151s.265.05.365.151l39.112 39.113c1.406 1.407 3.314 2.197 5.303 2.197s3.897-.79 5.303-2.197l64.626-64.626c.037-.037.151-.151.364-.151.214 0 .327.114.365.151l11.334 11.334c.204.201.204.529.003.73z";
const basicBadgeOutline = [
  "m450.601 220.356c-2.407-7.318-4.68-14.23-4.68-20.461s2.273-13.144 4.68-20.463c3.521-10.709 7.163-21.784 4.217-32.805-3.07-11.484-11.965-19.392-20.567-27.039-5.569-4.951-10.83-9.627-13.747-14.668-3.002-5.188-4.462-12.183-6.008-19.587-2.331-11.162-4.741-22.703-12.987-30.949-8.246-8.245-19.787-10.654-30.948-12.984-7.404-1.546-14.398-3.006-19.586-6.007-5.041-2.917-9.717-8.177-14.668-13.747-7.647-8.602-15.554-17.497-27.038-20.566-11.019-2.945-22.094.696-32.803 4.218-7.318 2.407-14.231 4.68-20.462 4.68s-13.144-2.273-20.463-4.68c-10.709-3.522-21.784-7.164-32.806-4.217-11.484 3.07-19.391 11.965-27.038 20.567-4.951 5.569-9.627 10.83-14.668 13.747-5.188 3.002-12.183 4.462-19.587 6.008-11.162 2.331-22.703 4.741-30.948 12.987-8.246 8.246-10.655 19.787-12.985 30.948-1.545 7.404-3.005 14.398-6.007 19.586-2.917 5.041-8.177 9.717-13.747 14.668-8.602 7.646-17.497 15.554-20.566 27.037-2.946 11.021.696 22.095 4.218 32.804 2.407 7.318 4.68 14.231 4.68 20.462s-2.273 13.144-4.68 20.462c-3.522 10.709-7.164 21.784-4.217 32.806 3.07 11.484 11.965 19.391 20.567 27.038 5.569 4.951 10.83 9.627 13.747 14.669 3.002 5.188 4.462 12.183 6.008 19.587 2.331 11.162 4.741 22.703 12.987 30.949 8.245 8.246 19.786 10.654 30.947 12.984 1.308.273 2.596.546 3.871.823l-40.684 116.364c-.892 2.55-.343 5.383 1.438 7.417 1.78 2.032 4.517 2.949 7.162 2.403l41.365-8.561 27.02 32.469c1.439 1.729 3.56 2.703 5.765 2.703.443 0 .89-.039 1.334-.119 2.659-.481 4.854-2.355 5.746-4.905l39.103-111.843c.66-.216 1.319-.432 1.976-.648 7.318-2.407 14.231-4.68 20.462-4.68s13.144 2.273 20.463 4.68c10.709 3.521 21.784 7.163 32.805 4.217 11.484-3.07 19.392-11.965 27.039-20.567 4.951-5.569 9.627-10.83 14.669-13.747.442-.256.914-.486 1.381-.72l36.482 104.348-32.8-6.788c-2.712-.563-5.513.417-7.285 2.547l-21.425 25.747-24.258-69.384c-1.367-3.91-5.645-5.974-9.555-4.604-3.91 1.367-5.972 5.645-4.604 9.555l28.63 81.889c.892 2.551 3.086 4.424 5.745 4.904.445.081.892.12 1.335.12 2.205 0 4.326-.974 5.765-2.703l27.02-32.469 41.365 8.561c2.646.547 5.382-.371 7.162-2.403 1.78-2.033 2.33-4.866 1.438-7.417l-40.687-116.369c1.277-.277 2.567-.551 3.877-.824 11.161-2.331 22.703-4.741 30.948-12.986 8.246-8.246 10.655-19.787 12.984-30.948 1.546-7.404 3.006-14.398 6.007-19.586 2.917-5.041 8.177-9.717 13.747-14.668 8.602-7.647 17.497-15.554 20.566-27.038 2.946-11.021-.695-22.095-4.217-32.804zm-265.926 269.172-21.425-25.747c-1.772-2.13-4.575-3.11-7.285-2.547l-32.8 6.788 36.482-104.348c.469.235.943.466 1.386.722 5.042 2.917 9.718 8.177 14.668 13.747 7.646 8.602 15.553 17.496 27.037 20.566 2.836.758 5.674 1.08 8.51 1.08 1.637 0 3.274-.111 4.907-.304zm255.652-240.241c-1.907 7.136-8.772 13.239-16.041 19.7-6.212 5.522-12.637 11.233-16.764 18.367-4.209 7.274-5.987 15.794-7.707 24.033-1.967 9.423-3.825 18.324-8.908 23.407s-13.983 6.942-23.407 8.909c-8.239 1.721-16.759 3.5-24.034 7.709-7.134 4.127-12.845 10.552-18.368 16.765-6.461 7.269-12.564 14.134-19.701 16.042-6.708 1.792-15.227-1.01-24.247-3.975-8.119-2.67-16.514-5.431-25.148-5.431s-17.029 2.761-25.148 5.431c-9.02 2.966-17.541 5.768-24.244 3.976-7.136-1.908-13.239-8.772-19.7-16.041-5.523-6.213-11.233-12.637-18.368-16.764-7.275-4.209-15.794-5.988-24.033-7.708-9.423-1.967-18.324-3.825-23.406-8.907-5.083-5.083-6.942-13.984-8.91-23.408-1.72-8.239-3.5-16.758-7.708-24.033-4.128-7.134-10.552-12.845-16.765-18.368-7.269-6.461-14.134-12.564-16.042-19.701-1.793-6.706 1.009-15.226 3.975-24.247 2.67-8.119 5.431-16.514 5.431-25.148s-2.761-17.029-5.431-25.148c-2.966-9.02-5.768-17.539-3.976-24.244 1.907-7.136 8.772-13.238 16.041-19.7 6.213-5.522 12.637-11.233 16.764-18.367 4.209-7.275 5.987-15.794 7.707-24.033 1.967-9.423 3.825-18.324 8.908-23.407s13.984-6.942 23.408-8.91c8.239-1.72 16.758-3.5 24.033-7.708 7.134-4.128 12.845-10.552 18.368-16.765 6.461-7.269 12.564-14.134 19.701-16.042 1.462-.391 3.01-.563 4.631-.563 5.813 0 12.562 2.219 19.615 4.539 8.119 2.67 16.515 5.431 25.149 5.431s17.029-2.761 25.148-5.431c9.02-2.966 17.537-5.768 24.244-3.976 7.136 1.907 13.239 8.772 19.7 16.041 5.522 6.212 11.233 12.637 18.367 16.764 7.275 4.209 15.794 5.987 24.033 7.707 9.423 1.967 18.324 3.825 23.406 8.907 5.083 5.083 6.942 13.984 8.91 23.408 1.72 8.239 3.5 16.759 7.708 24.034 4.127 7.133 10.552 12.844 16.764 18.367 7.269 6.461 14.134 12.564 16.042 19.702 1.793 6.706-1.009 15.226-3.975 24.246-2.67 8.119-5.431 16.514-5.431 25.148s2.761 17.029 5.431 25.147c2.969 9.02 5.77 17.539 3.978 24.245z",
].join("");
const basicBadgeRing =
  "m358.311 109.726c-3.251 2.566-3.808 7.282-1.242 10.534 18.127 22.973 27.709 50.51 27.709 79.635 0 71.006-57.768 128.774-128.774 128.774s-128.774-57.768-128.774-128.774 57.767-128.775 128.774-128.775c29.124 0 56.661 9.582 79.634 27.709 3.252 2.566 7.968 2.011 10.534-1.242 2.566-3.252 2.01-7.968-1.242-10.534-25.646-20.237-56.396-30.934-88.926-30.934-79.277 0-143.774 64.497-143.774 143.774s64.497 143.774 143.774 143.774 143.774-64.497 143.774-143.774c0-32.53-10.697-63.281-30.934-88.927-2.565-3.249-7.281-3.806-10.533-1.24z";

function BenefitIcon({
  className,
  kind,
}: {
  className?: string;
  kind: BenefitIconKind;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      {kind === "basic" && (
        <>
          <path d={basicBadgeCheck} fill="currentColor" />
          <path d={basicBadgeOutline} fill="currentColor" />
          <path d={basicBadgeRing} fill="currentColor" />
        </>
      )}
      {kind === "didactic" && (
        <>
          <path
            d="m472.172 60.582c-6.08-3.168-13.797-4.582-25.02-4.582h-382.303c-21.422 0-38.849 17.427-38.849 38.849v322.304c0 21.42 17.427 38.847 38.849 38.847h382.303c23.354 0 38.848-29.401 38.848-48.848v-322.303c0-14.101-7.52-20.98-13.828-24.267zm-6.172 346.57c0 11.652-9.929 28.848-18.849 28.848h-382.302c-10.393 0-18.849-8.455-18.849-18.848v-322.303c0-10.393 8.456-18.849 18.849-18.849h382.303c18.848 0 18.848 4.498 18.848 8.849z"
            fill="currentColor"
          />
          <path
            d="m421 96h-330c-13.785 0-25 11.215-25 25v190c0 13.785 11.215 25 25 25h330c13.785 0 25-11.215 25-25v-190c0-13.785-11.215-25-25-25zm5 215c0 2.757-2.243 5-5 5h-330c-2.757 0-5-2.243-5-5v-190c0-2.757 2.243-5 5-5h330c2.757 0 5 2.243 5 5z"
            fill="currentColor"
          />
          <path
            d="m436 376h-251.72c-4.128-11.639-15.244-20-28.28-20s-24.152 8.361-28.28 20h-51.72c-5.523 0-10 4.478-10 10s4.477 10 10 10h51.72c4.128 11.639 15.244 20 28.28 20s24.152-8.361 28.28-20h251.72c5.522 0 10-4.478 10-10s-4.478-10-10-10zm-280 20c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10z"
            fill="currentColor"
          />
          <path
            d="m311.734 207.808-100-70c-3.054-2.137-7.045-2.399-10.353-.677-3.307 1.722-5.382 5.141-5.382 8.87v140c0 3.728 2.075 7.147 5.382 8.87 3.299 1.716 7.29 1.467 10.353-.678l100-70c5.679-3.976 5.687-12.405 0-16.385zm-95.734 58.985v-101.587l72.563 50.794z"
            fill="currentColor"
          />
        </>
      )}
      {kind === "market" && (
        <>
          <path
            d="m410 80c5.523438 0 10-4.476562 10-10v-60c0-5.394531-4.410156-10-10-10h-60c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h37.734375l-25.617187 28.824219c-74.109376 83.363281-180.582032 131.175781-292.117188 131.175781-5.523438 0-10 4.476562-10 10s4.476562 10 10 10c117.242188 0 229.164062-50.257812 307.0625-137.886719l22.9375-25.808593v33.695312c0 5.523438 4.476562 10 10 10zm0 0"
            fill="currentColor"
          />
          <path
            d="m470 492h-10v-362c0-5.523438-4.476562-10-10-10h-60c-5.523438 0-10 4.476562-10 10v362h-40v-282c0-5.523438-4.476562-10-10-10h-60c-5.523438 0-10 4.476562-10 10v282h-40v-222c0-5.523438-4.476562-10-10-10h-60c-5.523438 0-10 4.476562-10 10v222h-40v-162c0-5.523438-4.476562-10-10-10h-60c-5.523438 0-10 4.476562-10 10v162h-10c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h460c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10zm-70-352h40v352h-40zm-120 80h40v272h-40zm-120 60h40v212h-40zm-120 60h40v152h-40zm0 0"
            fill="currentColor"
          />
        </>
      )}
    </svg>
  );
}

const benefitCardStyles = [
  {
    card: "bg-[#40004c] text-white",
    description: "text-white",
    icon: "text-white",
  },
  {
    card: "bg-white text-[#360040]",
    description: "text-[#7a7a7a]",
    icon: "text-[#360040]",
  },
  {
    card: "bg-[#ff0078] text-white",
    description: "text-white",
    icon: "text-white",
  },
] as const;

export function EducationSection() {
  return (
    <section
      aria-labelledby="education-title"
      className="relative isolate overflow-hidden bg-rose-surface px-5 md:px-[50px]"
    >
      <picture className="pointer-events-none absolute inset-0 -z-10 block">
        <source
          type="image/avif"
          media="(max-width: 560px)"
          srcSet="/media/nailpro/derived/why-alongamento-compact.avif"
        />
        <source
          type="image/avif"
          media="(min-width: 561px) and (max-width: 767px)"
          srcSet="/media/nailpro/derived/why-alongamento-mobile.avif"
        />
        <source
          type="image/avif"
          media="(min-width: 768px)"
          srcSet="/media/nailpro/derived/why-alongamento.avif"
        />
        <source
          type="image/webp"
          media="(max-width: 560px)"
          srcSet="/media/nailpro/derived/why-alongamento-compact.webp"
        />
        <source
          type="image/webp"
          media="(max-width: 767px)"
          srcSet="/media/nailpro/derived/why-alongamento-mobile.webp"
        />
        <Image
          alt=""
          className="h-full w-full object-cover"
          fill
          sizes="100vw"
          src="/media/nailpro/derived/why-alongamento.webp"
        />
      </picture>
      <div className="mx-auto flex w-full max-w-[767px] flex-wrap pb-[200px] pt-[30px] md:max-w-[1024px] md:flex-nowrap md:pb-[80px] md:pt-[80px] lg:max-w-[1140px]">
        <ScrollReveal
          animation="fadeIn"
          className="flex w-full flex-col p-[10px] md:w-[54.711%]"
        >
          <h2
            className="font-heading text-[35px] leading-[35px] font-black text-[#ff0078] md:text-[55px] md:leading-[55px]"
            id="education-title"
          >
            Por que trabalhar com alongamento?
          </h2>
          <div className="mt-5 text-left">
            {landingContent.educationBody.map((paragraph) => (
              <p
                className="mb-[14.4px] text-base font-medium leading-[24px] text-[#7a7a7a]"
                key={paragraph.slice(0, 24)}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollReveal>
        <div aria-hidden="true" className="w-full p-[10px] md:w-[45.289%]" />
      </div>
    </section>
  );
}

export function BonusesAndBenefitsSection() {
  return (
    <>
      <section
        aria-labelledby="bonuses-title"
        className="relative isolate overflow-x-clip bg-white px-5 md:px-[50px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 media-marble-standard bg-center bg-cover opacity-50"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-[767px] flex-col gap-10 py-[30px] md:max-w-[1024px] md:py-20 lg:max-w-[1140px]">
          <h2
            className="whitespace-pre-line text-center font-heading text-[26px] font-black uppercase leading-[26px] text-[#ff0078] md:text-[34px] md:leading-[34px]"
            id="bonuses-title"
          >
            {landingContent.bonuses.heading}
          </h2>
          {landingContent.bonuses.items.map((bonus) => (
            <ScrollReveal
              animation="bounceIn"
              as="article"
              className="overflow-hidden rounded-[10px] bg-white p-5 shadow-[0_0_10px_rgb(0_0_0_/_19%)]"
              key={bonus.title}
            >
              <div className="flex flex-col items-center text-center md:flex-row-reverse md:items-center md:text-left">
                <Image
                  fetchPriority="low"
                  alt=""
                  className="mb-[6.5px] h-auto w-1/2 min-w-0 object-contain md:mb-0 md:w-[15%]"
                  height={bonus.imageHeight}
                  sizes="(max-width: 767px) 50vw, 15vw"
                  src={bonus.image}
                  unoptimized
                  width={bonus.imageWidth}
                />
                <div className="w-full min-w-0 md:mr-[45px]">
                  <h3 className="mt-2 mb-[6px] font-sans text-[18px] font-semibold uppercase leading-[1.2] text-[#360040]">
                    {bonus.title}
                  </h3>
                  <p className="font-sans text-[15px] font-medium leading-[1.5] text-[#7a7a7a]">
                    {bonus.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <section
        className="bg-white px-5 text-[#360040] md:px-[50px]"
        aria-labelledby="benefits-title"
      >
        <ScrollReveal
          animation="fadeIn"
          className="mx-auto flex w-full max-w-[767px] flex-col py-[30px] md:max-w-[1024px] md:py-20 lg:max-w-[1140px]"
        >
          <h2
            className="m-0 text-center font-heading text-[35px] leading-[35px] font-black text-[#ff0078] md:text-[44px] md:leading-[44px]"
            id="benefits-title"
          >
            Aprimore seus conhecimentos
          </h2>
          <h2 className="m-0 text-center font-heading text-[23px] leading-[23px] font-black text-[#360040] md:text-[37px] md:leading-[37px]">
            com o curso perfeito para você!
          </h2>
          <ul className="mx-[10px] mt-10 flex flex-col gap-5 py-[10px] md:flex-row">
            {landingContent.benefits.map((benefit, index) => {
              const cardStyle =
                benefitCardStyles[index] ?? benefitCardStyles[0];
              const iconKind = ["basic", "didactic", "market"][
                index
              ] as BenefitIconKind;
              return (
                <li
                  className={`flex w-full flex-col items-center rounded-[10px] p-5 text-center shadow-[0_0_10px_rgb(0_0_0_/_19%)] md:w-[32%] ${cardStyle.card}`}
                  key={benefit.title}
                >
                  <BenefitIcon
                    className={`block size-[58px] shrink-0 ${cardStyle.icon}`}
                    kind={iconKind}
                  />
                  <h3 className="mt-2 w-full font-sans text-[18px] font-semibold uppercase leading-[21.6px]">
                    {benefit.title}
                  </h3>
                  <p
                    className={`m-0 font-sans text-[15px] font-medium leading-[22.5px] ${cardStyle.description}`}
                  >
                    {benefit.description}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="pt-[30px] text-center">
            <a
              className="inline-block rounded-[30px] bg-[#ff0078] px-[60px] py-5 font-heading text-[16px] leading-[16px] font-medium uppercase text-white shadow-[0_15px_10px_rgb(0_0_0_/_40%)] transition-all duration-300 ease-[ease] motion-reduce:transition-none md:text-[20px] md:leading-[20px]"
              href="#oferta"
            >
              {landingContent.ctaLabel}
            </a>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

export function InstructorSection() {
  return (
    <section
      aria-labelledby="instructor-title"
      className="relative isolate overflow-hidden bg-rose-surface px-5 md:px-[50px]"
      id="quemsou"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[76%] z-0 media-instructor-background bg-cover bg-[position:68%_top] bg-no-repeat md:bottom-0 md:left-[57%] md:top-0"
        data-instructor-background
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,#fff0f8_0%,#fff0f8_42%,rgb(255_240_248_/_82%)_62%,rgb(255_240_248_/_30%)_100%)]"
        data-instructor-overlay
      />
      <div
        className="relative z-10 mx-auto flex w-full max-w-[767px] flex-wrap gap-0 pt-[30px] pb-[50px] md:max-w-[1024px] md:flex-nowrap md:pt-20 md:pb-20 lg:max-w-[1140px]"
        data-instructor-inner
      >
        <div
          className="flex w-full flex-col gap-5 p-[10px] md:w-[54.712%] md:shrink-0"
          data-instructor-copy
        >
          <h2
            className="m-0 text-center font-heading text-[35px] leading-[35px] font-black text-[#ff0078] md:text-start md:text-[55px] md:leading-[55px]"
            id="instructor-title"
          >
            {landingContent.instructor.label}
          </h2>
          <ScrollReveal
            animation="zoomIn"
            className="w-[65%] self-center md:w-[300px] md:self-start"
          >
            <Image
              fetchPriority="low"
              alt=""
              className="h-auto w-full"
              height={100}
              sizes="(max-width: 767px) 65vw, 300px"
              src="/media/nailpro/signature-livia-montelume-large.png"
              unoptimized
              width={300}
            />
          </ScrollReveal>
          <div className="font-sans text-[18px] font-medium leading-[27px] text-[#5f5b5b]">
            {landingContent.instructor.bio.map((paragraph) => (
              <p className="m-0 mb-[14.4px]" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div
          className="relative z-10 flex w-full flex-col gap-5 p-[10px] md:w-1/2"
          data-instructor-portrait-column
        >
          <Image
            fetchPriority="low"
            alt="Professora do curso Nail Art"
            className="mx-auto aspect-[1200/1678] h-auto w-full max-w-[600px] origin-bottom-right -translate-x-[5px] scale-x-[1.04] object-contain md:translate-x-0 md:scale-y-[1.06]"
            height={1678}
            sizes="(max-width: 767px) 100vw, 600px"
            src={landingContent.instructor.portrait}
            width={1200}
          />
        </div>
      </div>
    </section>
  );
}
