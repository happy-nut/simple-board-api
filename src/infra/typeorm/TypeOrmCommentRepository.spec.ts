import { Connection } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'
import { Comment } from '../../domain/Comment'
import { TypeOrmCommentRepository } from './TypeOrmCommentRepository'
import { CommentEntity } from './entities'
import { DatabaseModule } from '../../modules'
import { CommentId } from '../../domain/CommentId'
import {
  createDummyComment,
  createDummyCommentsOrderByCreatedAt,
  createDummyPostsOrderByCreatedAt
} from '../../../test/support/utils'
import { UserId } from '../../domain/UserId'

describe('TypeOrmCommentRepository', () => {
  let connection: Connection
  let testingModule: TestingModule
  let uut: TypeOrmCommentRepository

  beforeEach(async () => {
    testingModule = await Test
      .createTestingModule({
        imports: [DatabaseModule]
      })
      .compile()
    connection = await testingModule.resolve(Connection)
    uut = new TypeOrmCommentRepository(connection)
  })

  afterEach(async () => {
    const repository = connection.getRepository(CommentEntity)
    await repository.clear()
    await testingModule.close()
  })

  describe('.findOneById', () => {
    it('finds undefined when there is no comment that has given ID', async () => {
      const commentId = new CommentId()

      const comment = await uut.findOneById(commentId)

      expect(comment).toBeUndefined()
    })

    it('finds a comment when there is a comment that has given ID', async () => {
      const comment = createDummyComment()
      await uut.save(comment)

      const found = await uut.findOneById(comment.id) as Comment

      expect(found).toBeDefined()
      expect(found.id.equals(comment.id)).toBeTrue()
      expect(found.authorId.equals(comment.authorId)).toBeTrue()
      expect(found.postId.equals(comment.postId)).toBeTrue()
      expect(found.content).toBe(comment.content)
      expect(found.createdAt).toEqual<Date>(comment.createdAt)
    })
  })

  describe('.findAllByUserId', () => {
    it('finds posts with given user ID', async () => {
      const userId = new UserId('test-user-id')
      const comments = createDummyCommentsOrderByCreatedAt(2, userId)
      await uut.save(comments[0])
      await uut.save(comments[1])
      const commentByOtherUser = createDummyCommentsOrderByCreatedAt(1)
      await uut.save(commentByOtherUser[0])

      const founds = await uut.findAllByUserId(userId)

      expect(founds).toEqual(comments)
    })
  })

  describe('.save', () => {
    it('crates a comment', async () => {
      const comment = createDummyComment()

      const created = await uut.save(comment)

      expect(created.id.equals(comment.id)).toBeTrue()
      expect(created.createdAt).toEqual<Date>(comment.createdAt)
      expect(created.content).toBe(comment.content)
      expect(created.postId.equals(comment.postId)).toBeTrue()
      expect(created.authorId.equals(comment.authorId)).toBeTrue()
    })

    it('updates a comment', async () => {
      const comment = createDummyComment()
      await uut.save(comment)
      const commentWithSameId = createDummyComment({
        content: 'new-content',
        postId: comment.postId,
        authorId: comment.authorId,
        createdAt: comment.createdAt
      }, comment.id)

      const updated = await uut.save(commentWithSameId)

      expect(updated.id.equals(comment.id)).toBeTrue()
      expect(updated.createdAt).toEqual<Date>(comment.createdAt)
      expect(updated.content).toBe('new-content')
      expect(updated.postId.equals(comment.postId)).toBeTrue()
      expect(updated.authorId.equals(comment.authorId)).toBeTrue()
    })
  })
})
