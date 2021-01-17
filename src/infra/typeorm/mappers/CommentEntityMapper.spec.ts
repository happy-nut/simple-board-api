import { Comment } from '../../../domain/Comment'
import { CommentEntityMapper } from './CommentEntityMapper'
import { UserId } from '../../../domain/UserId'
import { CommentEntity } from '../entities'
import { CommentId } from '../../../domain/CommentId'
import { PostId } from '../../../domain/PostId'

describe('CommentEntityMapper', () => {
  describe('.fromDomain', () => {
    it('maps from Comment to CommentEntity', () => {
      const comment = Comment.createNew({
        content: 'test-content',
        postId: new PostId('test-post-id'),
        authorId: new UserId('test-user-id')
      })

      const mapped = CommentEntityMapper.fromDomain(comment)

      const expected = new CommentEntity()
      expected.id = comment.id.value
      expected.authorId = comment.authorId.value
      expected.postId = comment.postId.value
      expected.content = comment.content
      expected.createdAt = comment.createdAt
      expect(mapped).toEqual(expected)
    })
  })

  describe('.toDomain', () => {
    it('maps from CommentEntity to Comment', () => {
      const commentId = new CommentId()
      const authorId = new UserId()
      const postId = new PostId()
      const now = new Date()
      const entity = new CommentEntity()
      entity.id = commentId.value
      entity.authorId = authorId.value
      entity.postId = postId.value
      entity.content = 'test-content'
      entity.createdAt = now

      const mapped = CommentEntityMapper.toDomain(entity)

      const expected = Comment.create(
        {
          createdAt: now,
          content: 'test-content',
          authorId,
          postId
        },
        commentId
      )
      expect(mapped).toEqual(expected)
    })
  })
})
