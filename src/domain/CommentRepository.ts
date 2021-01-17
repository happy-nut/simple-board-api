import { Comment } from './Comment'
import { CommentId } from './CommentId'

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY')

export interface CommentRepository {
  findOneById (commentId: CommentId): Promise<Comment | undefined>

  save (comment: Comment): Promise<Comment>
}
