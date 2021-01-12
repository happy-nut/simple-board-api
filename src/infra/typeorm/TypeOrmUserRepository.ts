import { User, UserRepository } from '../../domain'
import { Connection, Repository } from 'typeorm'
import { UserEntity } from './entities'
import { UserId } from '../../domain/UserId'
import _ from 'lodash'
import { UserEntityMapper } from './mappers'

export class TypeOrmUserRepository implements UserRepository {
  private readonly repository: Repository<UserEntity>

  constructor (private readonly connection: Connection) {
    this.repository = this.connection.getRepository(UserEntity)
  }

  async findOneById (id: UserId): Promise<User | undefined> {
    const entity = await this.repository.findOne(id.value)
    if (_.isNil(entity)) {
      return undefined
    }

    return UserEntityMapper.toDomain(entity)
  }

  async save (user: User): Promise<User | undefined> {
    const alreadyCreated = await this.findOneById(user.id)
    if (!_.isNil(alreadyCreated)) {
      return undefined
    }

    const userEntity = UserEntityMapper.fromDomain(user)
    const saved = await this.repository.save(userEntity)
    return UserEntityMapper.toDomain(saved)
  }
}
