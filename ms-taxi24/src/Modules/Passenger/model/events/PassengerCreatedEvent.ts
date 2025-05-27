import { DomainEvent } from '@Shared/domain/DomainEvent';

export class PassengerCreatedEvent extends DomainEvent {
  constructor(
    public readonly uuid: string,
    public readonly email: string
  ) {
    super('PassengerCreatedEvent', uuid);
  }
}
