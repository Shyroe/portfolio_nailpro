import { ScrollReveal } from "@/features/landing-page/components/scroll-reveal";
import { TestimonialVideoCard } from "@/features/landing-page/components/testimonial-video-card";
import { landingContent } from "@/features/landing-page/landing-content";
import { cn } from "@/lib/utils";

const testimonialGroups = [
  { id: "first-row", items: landingContent.testimonials.items.slice(0, 3) },
  { id: "second-row", items: landingContent.testimonials.items.slice(3) },
] as const;

export function TestimonialsSection() {
  const { heading, posterUrl, subtitle } = landingContent.testimonials;

  return (
    <section
      aria-labelledby="testimonials-title"
      className="relative isolate overflow-hidden bg-[#f9edf6] px-5 md:px-[50px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 media-testimonials-background bg-cover bg-center"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[767px] flex-col gap-5 pt-[30px] pb-[80px] md:max-w-[1024px] md:pt-[80px] lg:max-w-[1140px]">
        <h2
          className="font-heading text-center text-[35px] leading-[35px] font-black uppercase text-[#ff0078] md:text-[55px] md:leading-[55px]"
          id="testimonials-title"
        >
          {heading}
        </h2>
        <p className="text-center text-lg font-semibold capitalize leading-[18px] text-[#360040]">
          {subtitle}
        </p>
        {testimonialGroups.map(({ id, items }, groupIndex) => (
          <div
            className={cn(
              "flex flex-col px-[10px]",
              groupIndex === 0 ? "mt-[30px]" : "md:mt-[30px]",
            )}
            key={id}
          >
            <ScrollReveal
              animation="fadeIn"
              as="ul"
              className="flex flex-wrap justify-between gap-x-[1%] gap-y-5 md:py-[10px]"
            >
              {items.map((item) => (
                <li className="w-full md:w-[32.666%]" key={item.id}>
                  <TestimonialVideoCard
                    label={item.label}
                    posterUrl={posterUrl}
                  />
                </li>
              ))}
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  );
}
