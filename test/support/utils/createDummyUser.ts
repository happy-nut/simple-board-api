import { UserId } from '../../../src/domain/UserId'
import { User, UserProps } from '../../../src/domain'

export function createDummyUser (params?: Partial<UserProps>, id?: UserId): User {
  return User.create(
    {
      registeredAt: params?.registeredAt ?? new Date(),
      name: params?.name ?? 'test-name',
    },
    id ?? new UserId()
  )
}
