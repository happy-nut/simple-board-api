import { Post } from '../../../domain/Post'
import { PostEntityMapper } from './PostEntityMapper'
import { UserId } from '../../../domain/UserId'
import { PostEntity } from '../entities/PostEntity'
import { PostId } from '../../../domain/PostId'

describe('PostEntityMapper', () => {
  describe('.fromDomain', () => {
    it('maps from Post to PostEntity', () => {
      const post = Post.createNew({
        content: 'test-content',
        title: 'test-title',
        authorId: new UserId('test-user-id')
      })

      const mapped = PostEntityMapper.fromDomain(post)

      const expected = new PostEntity()
      expected.id = post.id.value
      expected.authorId = post.authorId.value
      expected.title = post.title
      expected.content = post.content
      expected.createdAt = post.createdAt
      expect(mapped).toEqual(expected)
    })
  })

  describe('.toDomain', () => {
    it('maps from PostEntity to Post', () => {
      const postId = new PostId()
      const authorId = new UserId()
      const now = new Date()
      const entity = new PostEntity()
      entity.id = postId.value
      entity.authorId = authorId.value
      entity.title = 'test-title'
      entity.content = 'test-content'
      entity.createdAt = now

      const mapped = PostEntityMapper.toDomain(entity)

      const expected = Post.create(
        {
          createdAt: now,
          content: 'test-content',
          title: 'test-title',
          authorId
        },
        postId
      )
      expect(mapped).toEqual(expected)
    })
  })
})
