import { Post, PostProps } from '../../../src/domain/Post'
import { UserId } from '../../../src/domain/UserId'
import { PostId } from '../../../src/domain/PostId'

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
