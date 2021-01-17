import { Comment } from './Comment'
import { CommentId } from './CommentId'

export interface CommentRepository {
  findOneById (commentId: CommentId): Promise<Comment | undefined>

  save (comment: Comment): Promise<Comment>
}
