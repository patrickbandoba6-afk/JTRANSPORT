import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";
import { DEFAULT_CUSTOMS_REQUIREMENTS } from "../src/data/customsRequirements.js";

const prisma = new PrismaClient();

async function main() {
  const password = await hashPassword("password123");

  const owner = await prisma.user.upsert({
    where: { email: "client@jtransport.test" },
    update: {},
    create: {
      email: "client@jtransport.test",
      passwordHash: password,
      name: "Amina Client",
      role: "PARTICULIER",
    },
  });

  const carrier = await prisma.user.upsert({
    where: { email: "transporteur@jtransport.test" },
    update: {},
    create: {
      email: "transporteur@jtransport.test",
      passwordHash: password,
      name: "Transports Diallo",
      role: "TRANSPORTEUR",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@jtransport.test" },
    update: {},
    create: {
      email: "admin@jtransport.test",
      passwordHash: password,
      name: "Admin JTransport",
      role: "ADMIN",
    },
  });

  await prisma.mission.upsert({
    where: { id: "seed-mission-1" },
    update: {},
    create: {
      id: "seed-mission-1",
      ownerId: owner.id,
      fromCity: "Paris",
      toCity: "Lyon",
      date: new Date("2026-09-15"),
      cargo: "8 palettes",
      weightKg: 2500,
      vehicleType: "Camion",
      budget: 650,
      recurring: false,
    },
  });

  const existingRequirements = await prisma.customsRequirement.count();
  if (existingRequirements === 0) {
    for (const r of DEFAULT_CUSTOMS_REQUIREMENTS) {
      await prisma.customsRequirement.create({ data: r });
    }
  }

  console.log("Seed complete:", {
    owner: owner.email,
    carrier: carrier.email,
    admin: admin.email,
    customsRequirements: existingRequirements === 0 ? DEFAULT_CUSTOMS_REQUIREMENTS.length : existingRequirements,
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
