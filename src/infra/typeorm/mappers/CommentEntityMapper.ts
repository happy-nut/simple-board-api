import { Comment } from '../../../domain/Comment'
import { UserId } from '../../../domain/UserId'
import { PostId } from '../../../domain/PostId'
import { CommentEntity } from '../entities'
import { CommentId } from '../../../domain/CommentId'

export class CommentEntityMapper {
  static fromDomain (comment: Comment): CommentEntity {
    const entity = new CommentEntity()
    entity.id = comment.id.value
    entity.authorId = comment.authorId.value
    entity.postId = comment.postId.value
    entity.content = comment.content
    entity.createdAt = comment.createdAt
    return entity
  }

  static toDomain (entity: CommentEntity): Comment {
    return Comment.create(
      {
        authorId: new UserId(entity.authorId),
        postId: new PostId(entity.postId),
        content: entity.content,
        createdAt: entity.createdAt
      },
      new CommentId(entity.id)
    )
  }
}
