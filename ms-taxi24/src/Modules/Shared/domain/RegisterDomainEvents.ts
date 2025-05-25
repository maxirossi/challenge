import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';
import { UserCreatedEvent } from '@Modules/User/model/events/UserCreatedEvent';
import { handleUserCreated } from '@Modules/User/application/handlers/UserCreatedHandler';
export const registerDomainEvents = (): void => {
  console.log('[DomainEvents] Registering domain event handlers...');
  DomainEventDispatcher.register<UserCreatedEvent>('UserCreatedEvent', handleUserCreated);
};
