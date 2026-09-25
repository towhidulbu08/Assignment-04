import { z } from "zod";

export const createRentalSchema = z.object({
  body: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    items: z
      .array(
        z.object({
          gearItemId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1, "At least one gear item is required"),
  }),
});
