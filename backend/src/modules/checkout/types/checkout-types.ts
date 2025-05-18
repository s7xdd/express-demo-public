import { z } from "zod";

export const checkoutValidationSchema = z.object({
  product_id: z.string(),
});
