import { Post} from '../../../domain/Post'
import { PostEntity } from '../entities/PostEntity'
import { UserId } from '../../../domain/UserId'
import { PostId } from '../../../domain/PostId'

export class PostEntityMapper {
  static fromDomain (post: Post): PostEntity {
    const entity = new PostEntity()
    entity.id = post.id.value
    entity.authorId = post.authorId.value
    entity.title = post.title
    entity.content = post.content
    entity.createdAt = post.createdAt
    return entity
  }

  static toDomain (entity: PostEntity): Post {
    return Post.create(
      {
        authorId: new UserId(entity.authorId),
        title: entity.title,
        content: entity.content,
        createdAt: entity.createdAt
      },
      new PostId(entity.id)
    )
  }
}
