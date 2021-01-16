import { Connection } from 'typeorm'
import { User } from '../../domain'
import { UserId } from '../../domain/UserId'
import { TypeOrmUserRepository } from './TypeOrmUserRepository'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '../../modules/DatabaseModule'
import { UserEntity } from './entities'
import _ from 'lodash'
import { Users } from '../../domain/Users'

describe('TypeOrmUserRepository', () => {
  let connection: Connection
  let testingModule: TestingModule
  let uut: TypeOrmUserRepository

  beforeEach(async () => {
    testingModule = await Test
      .createTestingModule({
        imports: [DatabaseModule]
      })
      .compile()
    connection = await testingModule.resolve(Connection)
    uut = new TypeOrmUserRepository(connection)
  })

  afterEach(async () => {
    const repository = await connection.getRepository(UserEntity)
    await repository.clear()
    await testingModule.close()
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

  describe('.findAllByIds', () => {
    it('finds undefined when there is no user that has given IDs', async () => {
      const userId = new UserId()

      const users = await uut.findAllByIds([userId])

      expect(users.isEmpty).toBeTrue()
    })

    it('finds users when there are users that has given IDs', async () => {
      const user1 = User.createNew({ name: 'test-name-1' })
      const user2 = User.createNew({ name: 'test-name-2' })
      const user3 = User.createNew({ name: 'test-name-3' })
      await uut.save(user1)
      await uut.save(user2)
      await uut.save(user3)

      const founds = await uut.findAllByIds([user2.id, user3.id]) as Users

      expect(founds.length).toBe(2)
      expect(founds.get(user1.id)).toBeUndefined()
      const found1 = founds.get(user2.id) as User
      expect(found1.registeredAt).toEqual(user2.registeredAt)
      expect(found1.name).toEqual(user2.name)
      expect(found1.id.equals(user2.id)).toBeTrue()
      const found2 = founds.get(user3.id) as User
      expect(found2.registeredAt).toEqual(user3.registeredAt)
      expect(found2.name).toEqual(user3.name)
      expect(found2.id.equals(user3.id)).toBeTrue()
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
