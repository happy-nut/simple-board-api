import { AggregateRoot } from '../shared/ddd'
import { UserId } from './UserId'

export interface UserProps {
  name: string
  registeredAt: Date
}

interface CreateNewProps {
  name: string
}

export class User extends AggregateRoot<UserProps> {
  static create (props: UserProps, id: UserId): User {
    return new User({ ...props }, id)
  }

  static createNew (props: CreateNewProps): User {
    return new User(
      {
        ...props,
        registeredAt: new Date()
      },
      new UserId()
    )
  }

  get name (): string {
    return this.props.name
  }

  get registeredAt (): Date {
    return this.props.registeredAt
  }
}
