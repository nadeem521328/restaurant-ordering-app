import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Enter your name.")
    .max(80, "Name is too long."),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10 digit phone number."),
  address: z
    .string()
    .trim()
    .min(3, "Enter landmark or address.")
    .max(250, "Address is too long."),
  notes: z.string().trim().max(250, "Notes are too long.").optional(),
  menuItemId: z.string().uuid("Invalid menu item."),
  quantity: z.number().int().min(1).max(20)
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
