import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mock, MockProxy } from 'jest-mock-extended'
import { GetPostError, GetPostResponse, GetPostUseCase } from '../../application/get-post'
import { GraphQueryLanguageModule } from '../../modules'
import { SavePostInput, PostResolver } from './PostResolver'
import { PostId } from '../../domain/PostId'
import request from 'supertest'
import {
  SavePostError,
  SavePostResponse,
  SavePostUseCase
} from '../../application/save-post'
import json5 from 'json5'
import { createDummyPost } from '../../../test/support/utils'

describe('PostResolver', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let getPostUseCase: MockProxy<GetPostUseCase>
  let savePostUseCase: MockProxy<SavePostUseCase>
  let logger: MockProxy<Logger>

  function givenGetUseCaseRejectedWithPostNotFoundError (): void {
    getPostUseCase.execute.mockRejectedValueOnce(GetPostError.postNotFound())
  }

  function givenGetUseCaseRejectedWithUnknownError (): void {
    getPostUseCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenGetUseCaseResolvedWithResponse (response: GetPostResponse): void {
    getPostUseCase.execute.mockResolvedValueOnce(response)
  }

  function givenSaveUseCaseRejectedWithPostNotFoundError (): void {
    savePostUseCase.execute.mockRejectedValueOnce(SavePostError.postNotFound())
  }

  function givenSaveUseCaseRejectedWithUnknownError (): void {
    savePostUseCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenSaveUseCaseResolvedWithResponse (response: SavePostResponse): void {
    savePostUseCase.execute.mockResolvedValueOnce(response)
  }

  function createPostQuery (postId: string): string {
    return `
      {
        getPost (id: "${postId}") {
          id, authorId, authorName, title, content, createdAt
        }
      }
    `
  }

  function createPostMutation (input: SavePostInput): string {
    return `
      mutation {
        savePost (input: ${json5.stringify(input, { quote: '"' })}) {
          id, authorId, authorName, title, content, createdAt
        }
      }
    `
  }

  beforeEach(async () => {
    getPostUseCase = mock()
    savePostUseCase = mock()
    logger = mock()
    testingModule = await Test
      .createTestingModule({
        imports: [GraphQueryLanguageModule],
        providers: [
          PostResolver,
          {
            provide: GetPostUseCase,
            useValue: getPostUseCase
          },
          {
            provide: SavePostUseCase,
            useValue: savePostUseCase
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

  describe('.getPost()', () => {
    it('responds with errors when post of given ID does not exist', async () => {
      givenGetUseCaseRejectedWithPostNotFoundError()
      const postId = new PostId().value
      const query = createPostQuery(postId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: query
        })

      expect(getPostUseCase.execute).toHaveBeenCalledWith({ id: postId })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors[0]).toEqual(expect.objectContaining({
        message: 'Post not found'
      }))
    })

    it('responds with errors and logs when post of given ID does not exist', async () => {
      givenGetUseCaseRejectedWithUnknownError()
      const postId = new PostId().value
      const query = createPostQuery(postId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: query
        })

      expect(getPostUseCase.execute).toHaveBeenCalledWith({ id: postId })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors).toBeDefined()
      expect(logger.error).toHaveBeenCalled()
    })

    it('responds with a post when post of given ID exists', async () => {
      const post = createDummyPost()
      const getPostResponse: GetPostResponse = {
        id: post.id.value,
        createdAt: post.createdAt,
        content: post.content,
        title: post.title,
        authorId: post.authorId.value,
        authorName: 'test-author-name'
      }
      givenGetUseCaseResolvedWithResponse(getPostResponse)
      const query = createPostQuery(post.id.value)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query
        })

      expect(getPostUseCase.execute).toHaveBeenCalledWith({ id: post.id.value })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        getPost: {
          id: post.id.value,
          authorId: post.authorId.value,
          authorName: 'test-author-name',
          content: post.content,
          title: post.title,
          createdAt: post.createdAt.toISOString()
        }
      })
      expect(response.body.errors).toBeUndefined()
    })
  })

  describe('.savePost()', () => {
    it('responds error when given post case rejected with PostNotFoundError', async () => {
      givenSaveUseCaseRejectedWithPostNotFoundError()
      const input: SavePostInput = {
        title: 'test-title',
        authorId: 'test-author-id',
        content: 'test-content'
      }
      const mutation = createPostMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(savePostUseCase.execute).toHaveBeenCalledWith({
        title: 'test-title',
        authorId: 'test-author-id',
        content: 'test-content'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors[0]).toEqual(expect.objectContaining({
        message: 'Post not found'
      }))
    })

    it('responds error and logs when given post case rejected with unknown error', async () => {
      givenSaveUseCaseRejectedWithUnknownError()
      const input: SavePostInput = {
        title: 'test-title',
        authorId: 'test-author-id',
        content: 'test-content'
      }
      const mutation = createPostMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(savePostUseCase.execute).toHaveBeenCalledWith({
        title: 'test-title',
        authorId: 'test-author-id',
        content: 'test-content'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors).toBeDefined()
      expect(logger.error).toHaveBeenCalled()
    })

    it('responds a created post when given use cases all resolved', async () => {
      const postId = new PostId().value
      const createdAt = new Date()
      const createPostResponse: SavePostResponse = {
        postId: postId
      }
      givenSaveUseCaseResolvedWithResponse(createPostResponse)
      givenGetUseCaseResolvedWithResponse({
        authorName: 'test-author-name',
        authorId: 'test-author-id',
        title: 'test-title',
        content: 'test-content',
        createdAt,
        id: postId
      })
      const input: SavePostInput = {
        title: 'test-title',
        authorId: 'test-author-id',
        content: 'test-content'
      }
      const mutation = createPostMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(savePostUseCase.execute).toHaveBeenCalledWith({
        title: 'test-title',
        authorId: 'test-author-id',
        content: 'test-content'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        savePost: {
          id: postId,
          authorId: 'test-author-id',
          authorName: 'test-author-name',
          title: 'test-title',
          content: 'test-content',
          createdAt: createdAt.toISOString()
        }
      })
      expect(response.body.errors).toBeUndefined()
    })

    it('responds a updated post when given use cases all resolved', async () => {
      const postId = new PostId().value
      const createdAt = new Date()
      const createPostResponse: SavePostResponse = {
        postId: postId
      }
      givenSaveUseCaseResolvedWithResponse(createPostResponse)
      givenGetUseCaseResolvedWithResponse({
        authorName: 'test-author-name',
        authorId: 'test-author-id',
        title: 'test-title',
        content: 'test-content',
        createdAt,
        id: postId
      })
      const input: SavePostInput = {
        id: postId,
        title: 'test-title',
        authorId: 'test-author-id',
        content: 'test-content'
      }
      const mutation = createPostMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(savePostUseCase.execute).toHaveBeenCalledWith({
        id: postId,
        title: 'test-title',
        authorId: 'test-author-id',
        content: 'test-content'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        savePost: {
          id: postId,
          authorId: 'test-author-id',
          authorName: 'test-author-name',
          title: 'test-title',
          content: 'test-content',
          createdAt: createdAt.toISOString()
        }
      })
      expect(response.body.errors).toBeUndefined()
    })
  })
})
