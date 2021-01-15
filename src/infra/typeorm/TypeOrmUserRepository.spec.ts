import { Connection } from 'typeorm'
import { User } from '../../domain'
import { UserId } from '../../domain/UserId'
import { TypeOrmUserRepository } from './TypeOrmUserRepository'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '../../modules/DatabaseModule'
import { UserEntity } from './entities'

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
