const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function main() {
  const prisma = new PrismaClient();

  const email = "b.tuguldur2014@gmail.com";
  const password = "dragonX12";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "DOCTOR",
      name: "EEJ",
    },
    create: {
      email,
      passwordHash,
      role: "DOCTOR",
      name: "EEJ",
    },
  });

  await prisma.$disconnect();
  console.log("Doctor ensured:", email);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
