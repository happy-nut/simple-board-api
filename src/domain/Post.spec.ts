import { UserId } from './UserId'
import { Post, PostId } from './Post'

describe('Post', () => {
  describe('.create', () => {
    it('creates a post', () => {
      const id = new PostId('test-post-id')
      const authorId = new UserId('test-user-id')
      const title = 'test-title'
      const content = 'test-content'
      const createdAt = new Date()

      const uut = Post.create(
        {
          authorId,
          title,
          content,
          createdAt
        },
        id
      )

      expect(uut.id.equals(id)).toBeTrue()
      expect(uut.authorId.equals(authorId)).toBeTrue()
      expect(uut.title).toBe(title)
      expect(uut.content).toBe(content)
      expect(uut.createdAt).toEqual<Date>(createdAt)
    })
  })


  describe('.createNew', () => {
    it('creates a post', () => {
      const authorId = new UserId('test-user-id')
      const title = 'test-title'
      const content = 'test-content'
      const createdAt = new Date()

      const uut = Post.createNew(
        {
          authorId,
          title,
          content
        }
      )

      expect(uut.id).toBeInstanceOf(PostId)
      expect(uut.id.value).toBeString()
      expect(uut.authorId.equals(authorId)).toBeTrue()
      expect(uut.title).toBe(title)
      expect(uut.content).toBe(content)
      expect(uut.createdAt).toEqual<Date>(createdAt)
    })
  })
})
