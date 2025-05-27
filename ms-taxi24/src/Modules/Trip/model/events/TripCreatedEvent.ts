import { DomainEvent } from '@Shared/domain/DomainEvent';

export class TripCreatedEvent extends DomainEvent {
  constructor(public readonly uuid: string) {
    super('TripCreatedEvent', uuid);
  }
}
