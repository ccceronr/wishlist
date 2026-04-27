import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

const DEFAULT_TAGS = [
  "maquillaje",
  "deportes",
  "viajes",
  "restaurantes",
  "ropa",
  "accesorios",
  "widgets",
  "otros",
];

async function main() {
  console.log("Seeding default tags...");

  await prisma.tag.deleteMany({ where: { isDefault: true } });

  await prisma.tag.createMany({
    data: DEFAULT_TAGS.map((name) => ({ name, isDefault: true })),
  });

  console.log(`✓ Created ${DEFAULT_TAGS.length} default tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
