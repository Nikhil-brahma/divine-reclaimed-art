import { readFileSync } from "node:fs";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import StructuredData from "./StructuredData";

afterEach(cleanup);

function productShippingAnswer(): string {
  const { container } = render(
    <MemoryRouter initialEntries={["/products/test-potli"]}>
      <StructuredData productData={{ name: "Test Potli", description: "", image: "", price: "999" }} />
    </MemoryRouter>,
  );
  const schemas = Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
    .map((script) => JSON.parse(script.textContent ?? "{}"));
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
  return faq?.mainEntity.find((question: { name: string }) => question.name === "How long does shipping take?")?.acceptedAnswer.text ?? "";
}

function shippingFacts(): string[] {
  return [productShippingAnswer(), ...["customer-chat", "seo-optimizer", "auto-seo-engine"].map((name) => {
    const source = readFileSync(new URL(`../../supabase/functions/${name}/index.ts`, import.meta.url), "utf8");
    return source.split("\n").find((line) => /SHIPPING:|Free shipping above/.test(line)) ?? "";
  })];
}

describe("shipping policy in product answers and AI prompts", () => {
  it("uses the ₹999 free-shipping threshold and ₹99 fee", () => {
    for (const facts of shippingFacts()) {
      const amounts = Array.from(facts.matchAll(/₹([\d,]+)/g), (match) => Number(match[1].replace(/,/g, "")));
      expect(amounts).toContain(999);
      expect(amounts).toContain(99);
      expect(amounts).not.toContain(5000);
    }
  });

  it("gives 3–7 business days with the policy's 7–10 remote-area exception", () => {
    for (const facts of shippingFacts()) {
      const ranges = Array.from(facts.matchAll(/(\d+)[–-](\d+) business days/g), (match) => [Number(match[1]), Number(match[2])]);
      expect(ranges).toEqual([[3, 7], [7, 10]]);
    }
  });

  it("does not offer live international shipping or a 10–21-day promise", () => {
    for (const facts of shippingFacts()) {
      expect(/International shipping is not yet live/i.test(facts)).toBe(true);
      expect(/10[–-]21/.test(facts)).toBe(false);
    }
  });
});