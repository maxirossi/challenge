const Redis = require('ioredis');
const { PrismaClient } = require('@prisma/client');
async function seedRedis() {
    try {
        const prisma = new PrismaClient();
        const redis = new Redis({
            host: 'redis_taxi24',
            port: 6379,
        });
        // Obtener drivers de la base de datos
        const drivers = await prisma.driver.findMany({
            where: {
                active: true
            },
            include: {
                user: true
            }
        });
        if (drivers.length === 0) {
            console.log('⚠️ No se encontraron drivers activos en la base de datos');
            await prisma.$disconnect();
            await redis.quit();
            return;
        }
        // Crear ubicaciones de ejemplo para cada driver
        const driverLocations = drivers.map((driver) => ({
            id: driver.id,
            driverId: driver.id,
            latitude: 40.416775,
            longitude: -3.703790,
            lastUpdate: new Date().toISOString(),
            isActive: true,
            driver: {
                id: driver.id,
                userId: driver.userId,
                licenseNumber: driver.licenseNumber,
                active: driver.active,
                user: {
                    id: driver.user.id,
                    name: driver.user.name,
                    email: driver.user.email,
                    phone: driver.user.phone,
                    active: driver.user.active
                }
            }
        }));
        // Limpiar datos existentes
        await redis.del('driver_locations');
        // Insertar datos de ejemplo
        for (const location of driverLocations) {
            await redis.hset('driver_locations', location.driverId, JSON.stringify(location));
        }
        console.log(`✅ Seed de Redis completado exitosamente. Se insertaron ${driverLocations.length} ubicaciones de drivers.`);
        await prisma.$disconnect();
        await redis.quit();
    }
    catch (error) {
        console.error('❌ Error al ejecutar el seed de Redis:', error);
        process.exit(1);
    }
}
seedRedis();
