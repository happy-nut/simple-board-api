import { Connection, createConnection } from 'typeorm'
import { User } from '../../domain'
import { UserId } from '../../domain/UserId'
import { UserEntity } from './entities'
import config from 'config'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import { TypeOrmUserRepository } from './TypeOrmUserRepository'

describe('TypeOrmUserRepository', () => {
  let connection: Connection
  let uut: TypeOrmUserRepository

  beforeEach(async () => {
    // TODO: Introduce Database Module.
    connection = await createConnection(
      {
        ...config.get<ConnectionOptions>('typeorm'),
        entities: [
          UserEntity
        ]
      }
    )
    uut = new TypeOrmUserRepository(connection)
  })

  afterEach(async () => {
    await connection.close()
  })

  describe('.findOneById', () => {
    it('finds undefined when there is no user that has given ID', async () => {
      const userId = new UserId()

      const user = await uut.findOneById(userId)

      expect(user).toBeUndefined()
    })

    it('finds a user when there is a user that has given ID', async () => {
      const user = User.createNew({ name: 'test-name' })
      await uut.save(user)

      const found = await uut.findOneById(user.id) as User

      expect(found).toBeDefined()
      expect(found.id.equals(user.id)).toBeTrue()
      expect(found.name).toBe(user.name)
      expect(found.registeredAt).toEqual<Date>(user.registeredAt)
    })
  })

  describe('.save', () => {
    it('crates a user', async () => {
      const user = User.createNew({ name: 'test-name' })

      const created = await uut.save(user) as User

      expect(created.id.equals(user.id)).toBeTrue()
      expect(created.name).toBe(user.name)
      expect(created.registeredAt).toEqual<Date>(user.registeredAt)
    })

    it('returns undefined when ID of given user already exists', async () => {
      const user = User.createNew({ name: 'test-name' })
      await uut.save(user)
      const userWithSameId = User.create(
        {
          name: 'test-name-2',
          registeredAt: user.registeredAt
        },
        user.id
      )
      const findSpy = jest.spyOn(uut, 'findOneById')

      const updated = await uut.save(userWithSameId)

      expect(findSpy).toHaveBeenCalledWith(user.id)
      expect(updated).toBeUndefined()
    })
  })
})
