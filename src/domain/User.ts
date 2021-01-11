import _ from 'lodash'
import { AggregateRoot } from '../shared/ddd'
import { UserId } from './UserId'

interface Props {
  name: string
  registeredAt: Date
}

export class User extends AggregateRoot<Props> {
  static create (props: Props, id?: UserId): User {
    if (_.isNil(id)) {
      return new User({ ...props }, new UserId())
    }

    return new User({ ...props }, id)
  }

  get name (): string {
    return this.props.name
  }

  get registeredAt (): Date {
    return this.props.registeredAt
  }
}
