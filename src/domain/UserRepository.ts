import { User } from './User'
import { UserId } from './UserId'

export interface UserRepository {
  findOneById(id: UserId): Promise<User | undefined>

  save (user: User): Promise<User | undefined>
}
