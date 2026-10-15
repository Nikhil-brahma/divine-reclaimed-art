import { z } from "zod";

export const OCCASIONS = ["Wedding / Bridal", "Shagun & Return Gifts", "Pooja & Temple", "Festival", "Corporate Gifting", "Other"] as const;

const today = () => new Date().toISOString().slice(0, 10);

export const customOrderSchema = z.object({
  design: z.string().trim().min(3, "Describe your preferred design").max(1000),
  quantity: z.coerce.number().int("Enter a whole number").min(1, "Quantity must be at least 1").max(100000, "Quantity is too large"),
  occasion: z.string().trim().min(1, "Choose an occasion").max(100),
  neededBy: z.string().optional().refine((d) => !d || d >= today(), "Date cannot be in the past"),
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{5,19}$/, "Enter a valid phone number"),
  notes: z.string().trim().max(1000).optional(),
});

export type CustomOrderInput = z.input<typeof customOrderSchema>;