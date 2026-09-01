import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma";

async function main() {
  const hashedPassword = await bcrypt.hash("12346", 10);

  // ==========================================
  // 1️⃣ CATEGORY
  // ==========================================
  const cycling = await prisma.category.create({
    data: { name: "Cycling", description: "Bikes and cycling gear" },
  });

  const camping = await prisma.category.create({
    data: { name: "Camping", description: "Tents and camping equipment" },
  });

  console.log("✅ Categories created");

  // ==========================================
  // 2️⃣ USER (Provider, Customer, Admin)
  // ==========================================
  const provider = await prisma.user.create({
    data: {
      name: "Towhidul Islam Tamim",
      email: "towhid@gmail.com",
      password: hashedPassword,
      role: "PROVIDER",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Karim Customer",
      email: "karim@gmail.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@gearup.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Users created");

  // ==========================================
  // 3️⃣ GEAR ITEM
  // ==========================================
  const bike = await prisma.gearItem.create({
    data: {
      name: "Mountain Bike",
      description: "21-speed mountain bike, great for trails",
      brand: "Trek",
      pricePerDay: 500,
      stock: 5,
      availableStock: 5,
      providerId: provider.id,
      categoryId: cycling.id,
    },
  });

  const tent = await prisma.gearItem.create({
    data: {
      name: "4-Person Tent",
      description: "Waterproof camping tent",
      brand: "Coleman",
      pricePerDay: 300,
      stock: 3,
      availableStock: 3,
      providerId: provider.id,
      categoryId: camping.id,
    },
  });

  console.log("✅ Gear items created");

  // ==========================================
  // 4️⃣ RENTAL ORDER
  // ==========================================
  const rentalOrder = await prisma.rentalOrder.create({
    data: {
      customerId: customer.id,
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-05-12"),
      totalAmount: 1600,
      status: "CONFIRMED",
      paymentStatus: "COMPLETED",
    },
  });

  console.log("✅ Rental order created");

  // ==========================================
  // (Supporting) RENTAL ITEM
  // ==========================================
  await prisma.rentalItem.create({
    data: {
      rentalOrderId: rentalOrder.id,
      gearItemId: bike.id,
      quantity: 1,
      pricePerDay: bike.pricePerDay,
      subtotal: 1000,
    },
  });

  await prisma.rentalItem.create({
    data: {
      rentalOrderId: rentalOrder.id,
      gearItemId: tent.id,
      quantity: 1,
      pricePerDay: tent.pricePerDay,
      subtotal: 600,
    },
  });

  console.log("✅ Rental items created");

  // ==========================================
  // 5️⃣ PAYMENT
  // ==========================================
  await prisma.payment.create({
    data: {
      transactionId: "TXN-" + Date.now(),
      rentalOrderId: rentalOrder.id,
      customerId: customer.id,
      amount: 1600,
      method: "CARD",
      provider: "STRIPE",
      status: "COMPLETED",
      paidAt: new Date(),
    },
  });

  console.log("✅ Payment created");

  // ==========================================
  // 6️⃣ REVIEW
  // ==========================================
  await prisma.review.create({
    data: {
      customerId: customer.id,
      gearItemId: bike.id,
      rentalOrderId: rentalOrder.id,
      rating: 5,
      comment: "Great bike, smooth ride!",
    },
  });

  console.log("✅ Review created");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
