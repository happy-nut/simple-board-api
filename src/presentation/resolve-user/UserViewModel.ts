import { Field, ObjectType } from '@nestjs/graphql'

interface UserViewModelProps {
  id: string
  name: string
  registeredAt: Date
}

@ObjectType('User')
export class UserViewModel implements UserViewModelProps {

  @Field()
  readonly id: string

  @Field()
  readonly name: string

  @Field(() => Date)
  readonly registeredAt: Date

  constructor (props: UserViewModelProps) {
    this.id = props.id
    this.name = props.name
    this.registeredAt = props.registeredAt
  }
}
