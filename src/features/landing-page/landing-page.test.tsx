import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { landingContent } from "./landing-content";
import { LandingPage } from "./landing-page";

describe("LandingPage", () => {
  it("renders one primary heading and the local offer anchor", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /aprenda como se tornar/i,
      }),
    ).toBeDefined();
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: /quanto vai custar/i }),
    ).toBeDefined();
  });

  it("keeps FAQ, module, and bonus copy original and presentation-ready", () => {
    const faqAnswers = landingContent.faq.map(([, answer]) => answer);
    const moduleDescriptions = landingContent.modules.flatMap(({ items }) =>
      items.map(({ description }) => description),
    );
    const bonusDescriptions = landingContent.bonuses.items.map(
      ({ description }) => description,
    );
    const editorialCopy = [
      ...faqAnswers,
      ...moduleDescriptions,
      ...bonusDescriptions,
    ].join(" ");

    expect(new Set(faqAnswers).size).toBe(5);
    expect(landingContent.heroVideo).not.toHaveProperty("embedUrl");
    expect(landingContent.heroVideo.unavailableTitle).toMatch(
      /aula demonstrativa em breve/i,
    );
    expect(landingContent.heroVideo.unavailableBody).toMatch(
      /preparação, estrutura e acabamento/i,
    );
    expect(editorialCopy.toLowerCase()).not.toMatch(/lorem|ipsum/);
    expect(editorialCopy).toMatch(/biossegurança|manutenção|precificação/i);
  });
});
