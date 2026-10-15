import { describe, expect, it } from "vitest";
import { customOrderSchema } from "./customOrder";

const valid = { design: "Red silk potli", quantity: "50", occasion: "Festival", name: "Asha", email: "a@b.com", phone: "9220464425" };

describe("customOrderSchema", () => {
  it("accepts a complete request", () => expect(customOrderSchema.safeParse(valid).success).toBe(true));
  it("rejects zero quantity", () => expect(customOrderSchema.safeParse({ ...valid, quantity: "0" }).success).toBe(false));
  it("rejects past needed-by dates", () => expect(customOrderSchema.safeParse({ ...valid, neededBy: "2000-01-01" }).success).toBe(false));
  it("requires valid email", () => expect(customOrderSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false));
});