import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'taxi24-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const kafkaProducer = kafka.producer();

export const connectKafkaProducer = async () => {
  await kafkaProducer.connect();
  console.log('[Kafka] Producer connected');
};
