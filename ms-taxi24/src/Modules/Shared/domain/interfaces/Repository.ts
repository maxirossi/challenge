import { Logger } from './Logger';

export interface Repository<T, K> {
  findById(id: K): Promise<T | null>;
  save(entity: Omit<T, 'id'>): Promise<T>;
  update(id: K, entity: Partial<T>): Promise<T>;
  delete(id: K): Promise<void>;
  getAll(page?: number, limit?: number): Promise<{ data: T[]; total: number }>;
}

export abstract class BaseRepository<T, K> implements Repository<T, K> {
  constructor(protected readonly logger: Logger) {}

  abstract findById(id: K): Promise<T | null>;
  abstract save(entity: Omit<T, 'id'>): Promise<T>;
  abstract update(id: K, entity: Partial<T>): Promise<T>;
  abstract delete(id: K): Promise<void>;
  abstract getAll(page?: number, limit?: number): Promise<{ data: T[]; total: number }>;

  protected handleError(error: unknown, message: string): never {
    this.logger.error(error);
    throw new Error(message);
  }
} 