import { Comment } from './Comment'
import { CommentId } from './CommentId'
import { UserId } from './UserId'

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY')

export interface CommentRepository {
  findOneById (commentId: CommentId): Promise<Comment | undefined>

  findAllByUserId (userId: UserId): Promise<Comment[]>

  save (comment: Comment): Promise<Comment>
}
