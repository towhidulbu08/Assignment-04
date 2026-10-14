import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

interface CreateReviewInput {
  customerId: string;
  rentalOrderId: string;
  gearItemId: string;
  rating: number;
  comment?: string;
}

export async function createReview(input: CreateReviewInput) {
  const { customerId, rentalOrderId, gearItemId, rating, comment } = input;

  const order = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
  });

  if (rating < 0 || rating > 10) {
    throw new ApiError(404, "Rating Must Be Between 0 To 10");
  }

  if (!order) {
    throw new ApiError(404, "Rental order not found");
  }
  if (order.customerId !== customerId) {
    throw new ApiError(403, "This is not your rental order");
  }
  // Business rule from the doc: reviews can only be left AFTER the gear is returned.
  if (order.status !== "RETURNED") {
    throw new ApiError(
      400,
      "You can only review gear after it has been returned",
    );
  }

  return prisma.review.create({
    data: { customerId, rentalOrderId, gearItemId, rating, comment },
  });
}
