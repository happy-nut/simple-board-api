import { Entity } from './Entity'
import { EntityId } from './EntityId'

export abstract class AggregateRoot<P, I = EntityId> extends Entity<P, I> {
}
