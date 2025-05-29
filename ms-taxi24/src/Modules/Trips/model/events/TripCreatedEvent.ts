import { DomainEvent } from "@Shared/domain/DomainEvent";

export class TripCreatedEvent extends DomainEvent {
  constructor(public readonly id: string) {
    super('TripCreatedEvent', id);
  }
}
