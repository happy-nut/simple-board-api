import { User } from './User'
import { UserId } from './UserId'

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')

export interface UserRepository {
  findOneById(id: UserId): Promise<User | undefined>

  save (user: User): Promise<User | undefined>
}
