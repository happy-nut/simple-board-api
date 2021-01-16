import { Post, PostId, PostProps } from '../../../src/domain/Post'
import { UserId } from '../../../src/domain/UserId'

export function createDummyPost (params?: Partial<PostProps>, id?: PostId): Post {
  return Post.create(
    {
      createdAt: params?.createdAt ?? new Date(),
      content: params?.content ?? 'test-content',
      title: params?.title ?? 'test-title',
      authorId: params?.authorId ?? new UserId()
    },
    id ?? new PostId()
  )
}
