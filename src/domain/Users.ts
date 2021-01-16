import { User } from './User'
import { UserId } from './UserId'
import _ from 'lodash'

export class Users {
  constructor (private readonly users: User[]) {
  }

  get (userId: UserId): User | undefined {
    return _.find(this.users, (user) => user.id.equals(userId))
  }

  get length (): number {
    return this.users.length
  }

  get isEmpty (): boolean {
    return this.length === 0
  }
}
