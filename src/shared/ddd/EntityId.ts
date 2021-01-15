import _ from 'lodash'
import { nanoid } from 'nanoid'

export class EntityId {
  private readonly _value: string

  constructor (id?: string) {
    if (_.isNil(id)) {
      this._value = nanoid()
      return
    }

    this._value = id
  }

  get value (): string {
    return this._value
  }

  equals (id: EntityId): boolean {
    return this.value === id.value
  }
}
