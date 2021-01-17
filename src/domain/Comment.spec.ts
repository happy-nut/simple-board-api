import { CommentId } from './CommentId'
import { UserId } from './UserId'
import { Comment } from './Comment'
import { PostId } from './PostId'
import { createDummyComment } from '../../test/support/utils'

describe('Comment', () => {
  describe('.create()', () => {
    it('creates comment with ID', () => {
      const userId = new UserId()
      const content = 'test-content'
      const createdAt = new Date()
      const commentId = new CommentId()

      const postId = new PostId()
      const comment = Comment.create(
        {
          authorId: userId,
          postId,
          content,
          createdAt
        },
        commentId
      )

      expect(comment.id.equals(commentId)).toBeTrue()
      expect(comment.postId.equals(postId)).toBeTrue()
      expect(comment.authorId.equals(userId)).toBeTrue()
      expect(comment.content).toBe(content)
      expect(comment.createdAt).toEqual<Date>(createdAt)
    })

  })

  describe('.createNew()', () => {
    it('creates comment without ID and createdAt', () => {
      const userId = new UserId()
      const content = 'test-content'

      const postId = new PostId()
      const comment = Comment.createNew(
        {
          authorId: userId,
          postId,
          content
        }
      )

      expect(comment.id).toEqual(expect.any(CommentId))
      expect(comment.postId.equals(postId)).toBeTrue()
      expect(comment.authorId.equals(userId)).toBeTrue()
      expect(comment.content).toBe(content)
      expect(comment.createdAt).toEqual(expect.any(Date))
    })
  })

  it('sets content', () => {
    const comment = createDummyComment()

    comment.setContent('new-content')

    expect(comment.id.equals(comment.id)).toBeTrue()
    expect(comment.postId.equals(comment.postId)).toBeTrue()
    expect(comment.authorId.equals(comment.authorId)).toBeTrue()
    expect(comment.content).toBe('new-content')
    expect(comment.createdAt).toEqual<Date>(comment.createdAt)
  })
})
