import { UserId } from '../../../src/domain/UserId'
import { CommentProps, Comment } from '../../../src/domain/Comment'
import { CommentId } from '../../../src/domain/CommentId'

export function createDummyComment (params?: Partial<CommentProps>, id?: CommentId): Comment {
  return Comment.create(
    {
      authorId: params?.authorId ?? new UserId(),
      content: params?.content ?? 'test-content',
      createdAt: params?.createdAt ?? new Date()
    },
    id ?? new CommentId()
  )
}
