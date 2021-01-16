import { User } from './User'
import { UserId } from './UserId'
import { Users } from './Users'

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')

export interface UserRepository {
  findOneById(id: UserId): Promise<User | undefined>

  findAllByIds (ids: UserId[]): Promise<Users>

  save (user: User): Promise<User | undefined>
}
