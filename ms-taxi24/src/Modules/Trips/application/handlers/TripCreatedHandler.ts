import { TripCreatedEvent } from '@Modules/Trips/model/events/TripCreatedEvent';
import { kafkaProducer } from '@Shared/infrastructure/kafka/producer';

export const handleTripCreated = async (event: TripCreatedEvent) => {
  await kafkaProducer.send({
    topic: 'ms-taxi24-events',
    messages: [
      {
        key: event.aggregateId,
        value: JSON.stringify({
          id: event.id,
          createdAt: event.occurredOn
        })
      }
    ]
  });
};
