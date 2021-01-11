import { User } from '../../../domain'
import { UserId } from '../../../domain/UserId'
import { UserEntity } from '../entities'
import { UserEntityMapper } from './UserEntityMapper'

describe('UserEntityMapper', () => {
  describe('.fromDomain', () => {
    it('maps from User to UserEntity', () => {
      const user = User.createNew({ name: 'test-name' })

      const mapped = UserEntityMapper.fromDomain(user)

      const expected = new UserEntity()
      expected.id = user.id.value
      expected.name = user.name
      expected.registeredAt = user.registeredAt
      expect(mapped).toEqual(expected)
    })
  })

  describe('.toDomain', () => {
    it('maps from UserEntity to User', () => {
      const entity = new UserEntity()
      entity.id = (new UserId()).value
      entity.name = 'test-name'
      entity.registeredAt = new Date()

      const mapped = UserEntityMapper.toDomain(entity)

      const expected = User.create(
        {
          name: entity.name,
          registeredAt: entity.registeredAt
        },
        new UserId(entity.id)
      )
      expect(mapped).toEqual(expected)
    })
  })
})
