import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      // password intentionally excluded
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED") {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return prisma.user.update({ where: { id: userId }, data: { status } });
}

export async function getAllGearListings() {
  return prisma.gearItem.findMany({
    include: { category: true, provider: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllRentals() {
  return prisma.rentalOrder.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      items: { include: { gearItem: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
