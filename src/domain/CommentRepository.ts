import { Comment } from './Comment'
import { CommentId } from './CommentId'
import { UserId } from './UserId'
import { PostId } from './PostId'

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY')

export interface CommentRepository {
  findOneById (commentId: CommentId): Promise<Comment | undefined>

  findAllByUserId (userId: UserId): Promise<Comment[]>

  findAllByPostId (postId: PostId, skip: number, take: number): Promise<Comment[]>

  save (comment: Comment): Promise<Comment>

  removeOne (comment: Comment): Promise<void>
}
