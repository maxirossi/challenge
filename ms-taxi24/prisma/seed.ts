import { PrismaClient } from '@prisma/client'
import crypto from 'crypto';
const prisma = new PrismaClient();

async function main() {


  const passwordPlain = 'ilovepuppies';
  const passwordMd5 = crypto.createHash('md5').update(passwordPlain).digest('hex');

  const newUser = await prisma.user.create({
    data: {
      uuid: '18b1992a-2cc8-454b-94e3-e69f6610905c',
      name: 'John',
      lastName : 'Wick',
      email : 'John@continental.com',
      user : 'babayaga',
      password : passwordMd5,
      active : true,
    },
  });

  console.log(`New user created: `, newUser);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
