import { z } from "zod";

export const createGearSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().min(5),
    brand: z.string().min(1),
    pricePerDay: z.number().positive("Price must be greater than 0"),
    stock: z.number().int().nonnegative(),
    categoryId: z.string().uuid("Invalid category id"),
    image: z.string().url().optional(),
  }),
});

export const updateGearSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    brand: z.string().min(1).optional(),
    pricePerDay: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().uuid().optional(),
    isAvailable: z.boolean().optional(),
  }),
});
