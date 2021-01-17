import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mock, MockProxy } from 'jest-mock-extended'
import { GraphQueryLanguageModule } from '../../modules'
import { SaveCommentInput, CommentResolver } from './CommentResolver'
import { CommentId } from '../../domain/CommentId'
import request from 'supertest'
import {
  SaveCommentError,
  SaveCommentResponse,
  SaveCommentUseCase
} from '../../application/save-comment'
import json5 from 'json5'
import { DeleteCommentError, DeleteCommentUseCase } from '../../application/delete-comment'

describe('CommentResolver', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let saveCommentUseCase: MockProxy<SaveCommentUseCase>
  let deleteCommentUseCase: MockProxy<DeleteCommentUseCase>
  let logger: MockProxy<Logger>

  function givenSaveUseCaseRejectedWithCommentNotFoundError (): void {
    saveCommentUseCase.execute.mockRejectedValueOnce(SaveCommentError.commentNotFound())
  }

  function givenSaveUseCaseRejectedWithUnknownError (): void {
    saveCommentUseCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenSaveUseCaseResolvedWithResponse (response: SaveCommentResponse): void {
    saveCommentUseCase.execute.mockResolvedValueOnce(response)
  }

  function givenDeleteUseCaseRejectedWithCommentNotFoundError (): void {
    deleteCommentUseCase.execute.mockRejectedValueOnce(DeleteCommentError.commentNotFound())
  }

  function givenDeleteUseCaseResolved (): void {
    deleteCommentUseCase.execute.mockResolvedValueOnce()
  }

  function createCommentSaveMutation (input: SaveCommentInput): string {
    return `
      mutation {
        saveComment (input: ${json5.stringify(input, { quote: '"' })}) {
          id
        }
      }
    `
  }

  function createCommentRemoveMutation (commentId: string): string {
    return `
      mutation {
        removeComment (id: "${commentId}") {
          id
        }
      }
    `
  }

  beforeEach(async () => {
    saveCommentUseCase = mock()
    deleteCommentUseCase = mock()
    logger = mock()
    testingModule = await Test
      .createTestingModule({
        imports: [GraphQueryLanguageModule],
        providers: [
          CommentResolver,
          {
            provide: SaveCommentUseCase,
            useValue: saveCommentUseCase
          },
          {
            provide: DeleteCommentUseCase,
            useValue: deleteCommentUseCase
          },
          {
            provide: Logger,
            useValue: logger
          }
        ]
      })
      .compile()
    app = await testingModule
      .createNestApplication()
      .init()
    uut = app.getHttpServer()
  })

  afterEach(async () => {
    await app.close()
    await testingModule.close()
  })
  
  describe('.saveComment()', () => {
    it('responds error when given comment case rejected with CommentNotFoundError', async () => {
      givenSaveUseCaseRejectedWithCommentNotFoundError()
      const input: SaveCommentInput = {
        postId: 'test-post-id',
        authorId: 'test-author-id',
        content: 'test-content'
      }
      const mutation = createCommentSaveMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(saveCommentUseCase.execute).toHaveBeenCalledWith({
        postId: 'test-post-id',
        authorId: 'test-author-id',
        content: 'test-content'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors[0]).toEqual(expect.objectContaining({
        message: 'Comment not found'
      }))
    })

    it('responds error and logs when given comment case rejected with unknown error', async () => {
      givenSaveUseCaseRejectedWithUnknownError()
      const input: SaveCommentInput = {
        postId: 'test-post-id',
        authorId: 'test-author-id',
        content: 'test-content'
      }
      const mutation = createCommentSaveMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(saveCommentUseCase.execute).toHaveBeenCalledWith({
        postId: 'test-post-id',
        authorId: 'test-author-id',
        content: 'test-content'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors).toBeDefined()
      expect(logger.error).toHaveBeenCalled()
    })

    it('responds a created comment when given use cases all resolved', async () => {
      const commentId = new CommentId().value
      const createdAt = new Date()
      const createCommentResponse: SaveCommentResponse = {
        commentId: commentId
      }
      givenSaveUseCaseResolvedWithResponse(createCommentResponse)
      const input: SaveCommentInput = {
        postId: 'test-post-id',
        authorId: 'test-author-id',
        content: 'test-content'
      }
      const mutation = createCommentSaveMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(saveCommentUseCase.execute).toHaveBeenCalledWith({
        postId: 'test-post-id',
        authorId: 'test-author-id',
        content: 'test-content'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        saveComment: {
          id: commentId
        }
      })
      expect(response.body.errors).toBeUndefined()
    })

    it('responds a updated comment when given use cases all resolved', async () => {
      const commentId = new CommentId().value
      const createdAt = new Date()
      const createCommentResponse: SaveCommentResponse = {
        commentId: commentId
      }
      givenSaveUseCaseResolvedWithResponse(createCommentResponse)
      const input: SaveCommentInput = {
        id: commentId,
        postId: 'test-post-id',
        authorId: 'test-author-id',
        content: 'test-content'
      }
      const mutation = createCommentSaveMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(saveCommentUseCase.execute).toHaveBeenCalledWith({
        id: commentId,
        postId: 'test-post-id',
        authorId: 'test-author-id',
        content: 'test-content'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        saveComment: {
          id: commentId
        }
      })
      expect(response.body.errors).toBeUndefined()
    })
  })

  describe('.removeComment()', () => {
    it('responds error when given delete case rejected with CommentNotFoundError', async () => {
      givenDeleteUseCaseRejectedWithCommentNotFoundError()
      const commentId = new CommentId().value
      const mutation = createCommentRemoveMutation(commentId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(deleteCommentUseCase.execute).toHaveBeenCalledWith({ commentId })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        removeComment: null
      })
      expect(response.body.errors[0]).toEqual(expect.objectContaining({
        message: 'Comment not found'
      }))
    })

    it('responds null when given delete case resolved', async () => {
      givenDeleteUseCaseResolved()
      const commentId = new CommentId().value
      const mutation = createCommentRemoveMutation(commentId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(deleteCommentUseCase.execute).toHaveBeenCalledWith({ commentId })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        removeComment: null
      })
      expect(response.body.errors).toBeUndefined()
    })
  })
})
