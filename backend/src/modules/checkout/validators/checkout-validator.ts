import { z } from "zod";

const lineItemSchema = z.object({
  price_data: z.object({
    unit_amount: z.number().int().positive(),
    currency: z.string().length(3),
    product_data: z.object({
      name: z.string().min(1),
    }),
  }),
  quantity: z.number().int().positive(),
});

export const lineItemValidationSchema = z.object({ line_items: z.array(lineItemSchema) });


