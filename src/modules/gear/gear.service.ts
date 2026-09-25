import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
// GET /api/gear?category=&brand=&minPrice=&maxPrice=&available=true

// import { Prisma } from "../../generated/prisma";

interface GearQuery {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  available?: string;
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getAllGear(query: GearQuery) {
  // ---- Pagination ----
  // const limit = query.limit ? Number(query.limit) : 10;
  // const page = query.page ? Number(query.page) : 1;
  // const skip = (page - 1) * limit;

  // ---- Sorting ----
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  // ---- Dynamic filtering ----
  const andConditions: Prisma.GearItemWhereInput[] = [];

  // Search across multiple fields (name + description + brand)
  // if (query.searchTerm) {
  //   andConditions.push({
  //     OR: [
  //       { name: { contains: query.searchTerm, mode: "insensitive" } },
  //       { description: { contains: query.searchTerm, mode: "insensitive" } },
  //       { brand: { contains: query.searchTerm, mode: "insensitive" } },
  //     ],
  //   });
  // }

  // Exact-match filters
  if (query.category) {
    andConditions.push({
      category: { name: { equals: query.category, mode: "insensitive" } },
    });
  }

  if (query.brand) {
    andConditions.push({
      brand: { equals: query.brand, mode: "insensitive" },
    });
  }

  if (query.available !== undefined) {
    andConditions.push({
      isAvailable: query.available === "true",
    });
  }

  // Range filter (price)
  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      pricePerDay: {
        ...(query.minPrice && { gte: Number(query.minPrice) }),
        ...(query.maxPrice && { lte: Number(query.maxPrice) }),
      },
    });
  }

  // ---- Run the query ----
  const gearItems = await prisma.gearItem.findMany({
    where: { AND: andConditions },
    // take: limit,
    // skip,
    orderBy: { [sortBy]: sortOrder },
    include: {
      category: true,
      provider: { select: { id: true, name: true } },
    },
  });

  // ---- Count total (needed for pagination metadata) ----
  // const total = await prisma.gearItem.count({ where: { AND: andConditions } });

  return gearItems;
}
export async function getGearById(id: string) {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
    include: {
      category: true,
      provider: { select: { id: true, name: true, phone: true } },
      reviews: { include: { customer: { select: { name: true } } } },
    },
  });

  if (!gear) {
    throw new ApiError(404, "Gear item not found");
  }

  return gear;
}

export async function getAllCategories() {
  return prisma.category.findMany({ where: { isActive: true } });
}
