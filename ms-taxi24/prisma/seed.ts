import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const passwordPlain = 'ilovepuppies';
  const passwordMd5 = crypto.createHash('md5').update(passwordPlain).digest('hex');

  const newUser = await prisma.user.upsert({
    where: { email: 'John@continental.com' },
    update: {},
    create: {
      uuid: uuidv4(),
      name: 'John',
      lastName: 'Wick',
      email: 'John@continental.com',
      user: 'babayaga',
      password: passwordMd5,
      active: true,
    },
  });

  console.log('✅ New user created:', newUser.email);

  const newDriver = await prisma.driver.upsert({
    where: { email: 'driver@example.com' },
    update: {},
    create: {
      uuid: uuidv4(),
      name: 'Carlos',
      lastName: 'Pérez',
      email: 'driver@example.com',
      phone: '123456789',
    },
  });

  console.log('🚗 New driver created:', newDriver.name);

  const car1 = await prisma.car.create({
    data: {
      uuid: uuidv4(),
      plate: 'ABC123',
      model: 'Focus',
      brand: 'Ford',
      year: 2018,
      driverId: newDriver.id,
    },
  });

  const car2 = await prisma.car.create({
    data: {
      uuid: uuidv4(),
      plate: 'XYZ789',
      model: 'Model 3',
      brand: 'Tesla',
      year: 2021,
      driverId: newDriver.id,
    },
  });

  console.log('🚘 Cars created:', car1.plate, 'and', car2.plate);

  await prisma.trip.createMany({
    data: [
      {
        uuid: uuidv4(),
        origin: 'Centro',
        destination: 'Aeropuerto',
        status: 'COMPLETED',
        fare: 1200.50,
        driverId: newDriver.id,
      },
      {
        uuid: uuidv4(),
        origin: 'Terminal',
        destination: 'Hotel Plaza',
        status: 'IN_PROGRESS',
        fare: 800.00,
        driverId: newDriver.id,
      },
      {
        uuid: uuidv4(),
        origin: 'Estación Sur',
        destination: 'Teatro',
        status: 'CANCELLED',
        fare: 0.0,
        driverId: newDriver.id,
      },
    ],
  });

  console.log('🛺 Trips seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Seeder error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });