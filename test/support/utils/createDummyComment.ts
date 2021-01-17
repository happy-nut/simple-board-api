import { UserId } from '../../../src/domain/UserId'
import { CommentProps, Comment } from '../../../src/domain/Comment'
import { CommentId } from '../../../src/domain/CommentId'
import { PostId } from '../../../src/domain/PostId'

export function createDummyComment (params?: Partial<CommentProps>, id?: CommentId): Comment {
  return Comment.create(
    {
      authorId: params?.authorId ?? new UserId(),
      postId: params?.postId ?? new PostId(),
      content: params?.content ?? 'test-content',
      createdAt: params?.createdAt ?? new Date()
    },
    id ?? new CommentId()
  )
}
