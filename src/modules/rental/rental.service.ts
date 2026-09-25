import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

interface CreateRentalInput {
  customerId: string;
  startDate: Date;
  endDate: Date;
  items: { gearItemId: string; quantity: number }[];
}

export async function createRental(input: CreateRentalInput) {
  const { customerId, startDate, endDate, items } = input;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid startDate or endDate");
  }

  console.log("endDate,startDate", endDate, startDate);

  if (end <= start) {
    throw new ApiError(400, "endDate must be after startDate");
  }

  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Use a transaction: if ANY step fails (e.g. not enough stock),
  // nothing gets saved - avoids half-created orders.

  const result = prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const itemsData = [];

    for (const item of items) {
      const gear = await tx.gearItem.findUnique({
        where: { id: item.gearItemId },
      });

      if (!gear) {
        throw new ApiError(404, `Gear item ${item.gearItemId} not found`);
      }
      if (!gear.isAvailable || gear.availableStock < item.quantity) {
        throw new ApiError(
          400,
          `${gear.name} does not have enough stock available`,
        );
      }

      const subtotal = Number(gear.pricePerDay) * item.quantity * days;
      totalAmount += subtotal;

      itemsData.push({
        gearItemId: gear.id,
        quantity: item.quantity,
        pricePerDay: gear.pricePerDay,
        subtotal,
      });

      // Reserve the stock immediately so two customers can't over-book the same gear.
      await tx.gearItem.update({
        where: { id: gear.id },
        data: { availableStock: gear.availableStock - item.quantity },
      });
    }

    const rentalOrder = await tx.rentalOrder.create({
      data: {
        customerId,
        startDate: start,
        endDate: end,
        totalAmount,
        status: "PLACED",
        paymentStatus: "PENDING",
        items: { create: itemsData },
      },
      include: { items: true },
    });

    return rentalOrder;
  });
  return result;
}

export async function getRentalsForUser(userId: string, role: string) {
  // Admin sees everything, customer sees only their own orders.
  const where = role === "ADMIN" ? {} : { customerId: userId };

  return prisma.rentalOrder.findMany({
    where,
    include: { items: { include: { gearItem: true } }, payments: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRentalById(id: string, userId: string, role: string) {
  const rental = await prisma.rentalOrder.findUnique({
    where: { id },
    include: {
      items: { include: { gearItem: true } },
      payments: true,
      customer: { select: { name: true, email: true } },
    },
  });

  if (!rental) {
    throw new ApiError(404, "Rental order not found");
  }

  // Customers can only view their own order.
  if (role === "CUSTOMER" && rental.customerId !== userId) {
    throw new ApiError(403, "You do not have access to this rental order");
  }

  return rental;
}
