const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function main() {
  const prisma = new PrismaClient();

  const email = "b.tuguldur2015@gmail.com";
  const password = "dragonX12";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "SUPERADMIN",
      name: "Super Admin",
    },
    create: {
      email,
      passwordHash,
      role: "SUPERADMIN",
      name: "Super Admin",
    },
  });

  await prisma.$disconnect();
  console.log("Superadmin ensured:", email);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
