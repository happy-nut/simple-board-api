import { ApiProperty } from '@nestjs/swagger'

interface UserViewModelProps {
  id: string
  name: string
  registeredAt: Date
}

export class UserViewModel implements UserViewModelProps {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Date })
  registeredAt: Date

  constructor (props: UserViewModelProps) {
    this.id = props.id
    this.name = props.name
    this.registeredAt = props.registeredAt
  }
}
