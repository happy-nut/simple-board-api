import { CommentId } from './CommentId'
import { UserId } from './UserId'
import { Comment } from './Comment'

describe('Comment', () => {
  describe('.create()', () => {
    it('creates comment with ID', () => {
      const userId = new UserId()
      const content = 'test-content'
      const createdAt = new Date()
      const commentId = new CommentId()

      const comment = Comment.create(
        {
          authorId: userId,
          content,
          createdAt
        },
        commentId
      )

      expect(comment.id.equals(commentId)).toBeTrue()
      expect(comment.authorId.equals(userId)).toBeTrue()
      expect(comment.content).toBe(content)
      expect(comment.createdAt).toEqual<Date>(createdAt)
    })

  })

  describe('.createNew()', () => {
    it('creates comment without ID and createdAt', () => {
      const userId = new UserId()
      const content = 'test-content'

      const comment = Comment.createNew(
        {
          authorId: userId,
          content
        }
      )

      expect(comment.id).toEqual(expect.any(CommentId))
      expect(comment.authorId.equals(userId)).toBeTrue()
      expect(comment.content).toBe(content)
      expect(comment.createdAt).toEqual(expect.any(Date))
    })
  })
})
