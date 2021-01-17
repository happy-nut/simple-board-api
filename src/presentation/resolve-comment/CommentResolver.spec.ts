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
import {
  ListCommentsByAuthorIdError, ListCommentsByAuthorIdResponse,
  ListCommentsByAuthorIdUseCase
} from '../../application/list-comments-by-author-id'
import { UserId } from '../../domain/UserId'
import { PostId } from '../../domain/PostId'
import {
  ListCommentsByPostIdError,
  ListCommentsByPostIdResponse, ListCommentsByPostIdUseCase
} from '../../application/list-comments-by-post-id'

describe('CommentResolver', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let saveCommentUseCase: MockProxy<SaveCommentUseCase>
  let deleteCommentUseCase: MockProxy<DeleteCommentUseCase>
  let listCommentsByAuthorIdUseCase: MockProxy<ListCommentsByAuthorIdUseCase>
  let listCommentsByPostIdUseCase: MockProxy<ListCommentsByPostIdUseCase>
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

  function givenListPostsByAuthorIdUseCaseRejectedWithAuthorNotFoundError (): void {
    listCommentsByAuthorIdUseCase.execute
      .mockRejectedValueOnce(ListCommentsByAuthorIdError.authorNotFound())
  }

  function givenListPostsByAuthorIdUseCaseResolved (
    response: ListCommentsByAuthorIdResponse
  ): void {
    listCommentsByAuthorIdUseCase.execute.mockResolvedValueOnce(response)
  }

  function givenListPostsByPostIdUseCaseRejectedWithPostNotFoundError (): void {
    listCommentsByPostIdUseCase.execute
      .mockRejectedValueOnce(ListCommentsByPostIdError.postNotFound())
  }

  function givenListPostsByPostIdUseCaseResolved (response: ListCommentsByPostIdResponse): void {
    listCommentsByPostIdUseCase.execute.mockResolvedValueOnce(response)
  }

  beforeEach(async () => {
    saveCommentUseCase = mock()
    deleteCommentUseCase = mock()
    listCommentsByAuthorIdUseCase = mock()
    listCommentsByPostIdUseCase = mock()
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
            provide: ListCommentsByAuthorIdUseCase,
            useValue: listCommentsByAuthorIdUseCase
          },
          {
            provide: ListCommentsByPostIdUseCase,
            useValue: listCommentsByPostIdUseCase
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
    function createCommentSaveMutation (input: SaveCommentInput): string {
      return `
        mutation {
          saveComment (input: ${json5.stringify(input, { quote: '"' })}) {
            id
          }
        }
      `
    }

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
    function createCommentRemoveMutation (commentId: string): string {
      return `
        mutation {
          removeComment (id: "${commentId}") {
            id
          }
        }
      `
    }

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

  describe('.listCommentsByAuthorId()', () => {
    function createCommentListCommentsByAuthorIdQuery (authorId: string): string {
      return `
        {
          listCommentsByAuthorId (authorId: "${authorId}") {
            id, postId, content, createdAt, authorName
          }
        }
      `
    }

    it('responds error' +
      ' when given list by author ID use case rejected with AuthorNotFoundError', async () => {
      givenListPostsByAuthorIdUseCaseRejectedWithAuthorNotFoundError()
      const authorId = new UserId().value
      const query = createCommentListCommentsByAuthorIdQuery(authorId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query
        })

      expect(listCommentsByAuthorIdUseCase.execute).toHaveBeenCalledWith({ authorId })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors[0]).toEqual(expect.objectContaining({
        message: 'Author not found'
      }))
    })

    it('responds error' +
      ' when given list by author ID use case rejected with AuthorNotFoundError', async () => {
      const listResponse: ListCommentsByAuthorIdResponse = [
        {
          content: 'test-content-1',
          postId: new PostId().value,
          createdAt: new Date(),
          id: new CommentId().value,
          username: 'test-username-1'
        },
        {
          content: 'test-content-2',
          postId: new PostId().value,
          createdAt: new Date(),
          id: new CommentId().value,
          username: 'test-username-2'
        }
      ]

      givenListPostsByAuthorIdUseCaseResolved(listResponse)
      const authorId = new UserId().value
      const query = createCommentListCommentsByAuthorIdQuery(authorId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query
        })

      expect(listCommentsByAuthorIdUseCase.execute).toHaveBeenCalledWith({ authorId })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        listCommentsByAuthorId: [
          {
            id: listResponse[0].id,
            content: listResponse[0].content,
            postId: listResponse[0].postId,
            createdAt: listResponse[0].createdAt.toISOString(),
            authorName: listResponse[0].username
          },
          {
            id: listResponse[1].id,
            content: listResponse[1].content,
            postId: listResponse[1].postId,
            createdAt: listResponse[1].createdAt.toISOString(),
            authorName: listResponse[1].username
          }
        ]
      })
      expect(response.body.errors).toBeUndefined()
    })
  })

  describe('.listCommentsByAuthorId()', () => {
    function createCommentListCommentsByPostIdQuery (postId: string): string {
      return `
        {
          listCommentsByPostId (postId: "${postId}") {
            id, authorId, content, createdAt, authorName
          }
        }
      `
    }

    it('responds error' +
      ' when given list by author ID use case rejected with AuthorNotFoundError', async () => {
      givenListPostsByPostIdUseCaseRejectedWithPostNotFoundError()
      const postId = new PostId().value
      const query = createCommentListCommentsByPostIdQuery(postId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query
        })

      expect(listCommentsByPostIdUseCase.execute).toHaveBeenCalledWith({
        postId,
        skip: 0,
        take: 100
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors[0]).toEqual(expect.objectContaining({
        message: 'Post not found'
      }))
    })

    it('responds error' +
      ' when given list by author ID use case rejected with PostNotFoundError', async () => {
      const listResponse: ListCommentsByPostIdResponse = [
        {
          content: 'test-content-1',
          authorId: new UserId().value,
          createdAt: new Date(),
          id: new CommentId().value,
          username: 'test-username-1'
        },
        {
          content: 'test-content-2',
          authorId: new UserId().value,
          createdAt: new Date(),
          id: new CommentId().value,
          username: 'test-username-2'
        }
      ]
      givenListPostsByPostIdUseCaseResolved(listResponse)
      const postId = new PostId().value
      const query = createCommentListCommentsByPostIdQuery(postId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query
        })

      expect(listCommentsByPostIdUseCase.execute).toHaveBeenCalledWith({
        postId,
        skip: 0,
        take: 100
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        listCommentsByPostId: [
          {
            id: listResponse[0].id,
            content: listResponse[0].content,
            authorId: listResponse[0].authorId,
            createdAt: listResponse[0].createdAt.toISOString(),
            authorName: listResponse[0].username
          },
          {
            id: listResponse[1].id,
            content: listResponse[1].content,
            authorId: listResponse[1].authorId,
            createdAt: listResponse[1].createdAt.toISOString(),
            authorName: listResponse[1].username
          }
        ]
      })
      expect(response.body.errors).toBeUndefined()
    })
  })
})
