import { EntityId } from './EntityId'

export abstract class Entity<P, I = EntityId> {
  protected constructor (protected readonly props: P, readonly id: I) {
  }
}