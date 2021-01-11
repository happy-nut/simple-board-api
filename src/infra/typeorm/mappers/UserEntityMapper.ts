import { User } from '../../../domain'
import { UserId } from '../../../domain/UserId'
import { UserEntity } from '../entities'

export class UserEntityMapper {
  static fromDomain (user: User): UserEntity {
    const entity = new UserEntity()
    entity.id = user.id.value
    entity.name = user.name
    entity.registeredAt = user.registeredAt
    return entity
  }

  static toDomain (entity: UserEntity): User {
    return User.create(
      {
        name: entity.name,
        registeredAt: entity.registeredAt
      },
      new UserId(entity.id)
    )
  }
}
