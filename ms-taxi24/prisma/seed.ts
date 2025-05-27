import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario administrador
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

  console.log('✅ Usuario creado:', newUser.email);

  // Crear conductor
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

  console.log('🚗 Conductor creado:', newDriver.name);

  // Crear autos para el conductor
  const car1 = await prisma.car.create({
    data: {
      uuid: uuidv4(),
      plate: 'ABC123',
      model: 'Focus',
      brand: 'Ford',
      year: 2018,
      color: 'Azul',
      driverId: newDriver.id,
    },
  });

  await prisma.carPosition.create({
    data: {
      uuid: uuidv4(),
      carId: car1.id,
      latitude: -34.6037,
      longitude: -58.3816,
      isActive: true,
      isFree: true,
    },
  });

  const car2 = await prisma.car.create({
    data: {
      uuid: uuidv4(),
      plate: 'XYZ789',
      model: 'Model 3',
      brand: 'Tesla',
      year: 2021,
      color: 'Negro',
      driverId: newDriver.id,
    },
  });

  await prisma.carPosition.create({
    data: {
      uuid: uuidv4(),
      carId: car2.id,
      latitude: -34.6157,
      longitude: -58.4333,
      isActive: true,
      isFree: false,
    },
  });

  console.log('🚘 Autos y posiciones creados');

  // Crear pasajero
  const passenger = await prisma.passenger.upsert({
    where: { email: 'ana@example.com' },
    update: {},
    create: {
      uuid: uuidv4(),
      name: 'Ana',
      lastName: 'Martínez',
      email: 'ana@example.com',
      phone: '987654321',
    },
  });

  console.log('🧍 Pasajero creado:', passenger.name);

  // Crear viajes
  await prisma.trip.createMany({
    data: [
      {
        uuid: uuidv4(),
        origin: 'Centro',
        destination: 'Aeropuerto',
        status: 'COMPLETED',
        fare: 1200.5,
        driverId: newDriver.id,
        passengerId: passenger.id,
        completedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        origin: 'Terminal',
        destination: 'Hotel Plaza',
        status: 'IN_PROGRESS',
        fare: 800.0,
        driverId: newDriver.id,
        passengerId: passenger.id,
      },
      {
        uuid: uuidv4(),
        origin: 'Estación Sur',
        destination: 'Teatro',
        status: 'CANCELLED',
        fare: 0.0,
        driverId: newDriver.id,
        passengerId: passenger.id,
        cancelledAt: new Date(),
      },
    ],
  });

  console.log('🛺 Viajes creados');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
