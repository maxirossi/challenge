import { Server } from './server';
import { connectKafkaProducer } from '@Shared/infrastructure/kafka/producer';
import { startKafkaConsumer } from '@Shared/infrastructure/kafka/consumer';
import { registerDomainEvents } from '@Shared/domain/RegisterDomainEvents';

const PORT = process.env.PORT || '3000';

async function main() {
  try {
    await connectKafkaProducer();
    await startKafkaConsumer(); 
    registerDomainEvents();

    const server = new Server(PORT);
    await server.listen();
    console.log(`✅ Server running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Error starting the server:', error);
    process.exit(1);
  }
}

main();
