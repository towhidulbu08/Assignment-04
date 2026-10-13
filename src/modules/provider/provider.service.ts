import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

interface CreateGearInput {
  providerId: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  categoryId: string;
  image?: string;
}

export async function addGear(input: CreateGearInput) {
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const result = await prisma.gearItem.create({
    data: {
      name: input.name,
      description: input.description,
      brand: input.brand,
      pricePerDay: input.pricePerDay,
      stock: input.stock,
      availableStock: input.stock,
      categoryId: input.categoryId,
      providerId: input.providerId,
      image: input.image,
    },
  });

  return result;
}

// Ownership check helper - a provider can only touch their own gear.
async function checkOwnGear(gearId: string, providerId: string) {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });
  if (!gear) {
    throw new ApiError(404, "Gear item not found");
  }
  if (gear.providerId !== providerId) {
    throw new ApiError(403, "You do not own this gear item");
  }
}

export async function updateGear(
  gearId: string,
  providerId: string,
  data: Record<string, any>,
) {
  await checkOwnGear(gearId, providerId);
  const result = prisma.gearItem.update({ where: { id: gearId }, data });

  return result;
}

export async function deleteGear(gearId: string, providerId: string) {
  await checkOwnGear(gearId, providerId);
  return prisma.gearItem.delete({ where: { id: gearId } });
}

export async function getProviderOrders(providerId: string) {
  // Orders that contain at least one gear item belonging to this provider.
  return prisma.rentalOrder.findMany({
    where: { items: { some: { gearItem: { providerId } } } },
    include: {
      items: {
        where: { gearItem: { providerId } },
        include: { gearItem: true },
      },

      customer: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(
  orderId: string,
  providerId: string,
  status: "PLACED" | "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED",
) {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: { items: { include: { gearItem: true } } },
  });

  if (!order) {
    throw new ApiError(404, "Rental order not found");
  }

  const ownsAnItem = order.items.some(
    (item) => item.gearItem.providerId === providerId,
  );
  if (!ownsAnItem) {
    throw new ApiError(403, "You do not have permission to update this order");
  }

  // If the order is cancelled or fully returned, release the reserved stock.
  if (status === "CANCELLED" || status === "RETURNED") {
    await prisma.$transaction(
      order.items.map((item) =>
        prisma.gearItem.update({
          where: { id: item.gearItemId },
          data: { availableStock: { increment: item.quantity } },
        }),
      ),
    );
  }

  return prisma.rentalOrder.update({
    where: { id: orderId },
    data: { status },
  });
}
