import { Post, PostId } from './Post'
import { UserId } from './UserId'

export interface PostRepository {
  findOneById(id: PostId): Promise<Post | undefined>

  findAll(skip?: number, limit?: number): Promise<Post[]>

  findAllByUserId(userId: UserId): Promise<Post[]>

  save (post: Post): Promise<Post | undefined>

  removeOne (post: Post): Promise<void>
}
