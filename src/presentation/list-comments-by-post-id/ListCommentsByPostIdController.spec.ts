import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import {
  ListCommentsByPostIdError,
  ListCommentsByPostIdResponse,
  ListCommentsByPostIdUseCase
} from '../../application/list-comments-by-post-id'
import { ListCommentsByPostIdController } from './ListCommentsByPostIdController'
import { createDummyCommentsOrderByCreatedAt } from '../../../test/support/utils'
import { PostId } from '../../domain/PostId'

describe('ListCommentsByPostIdController', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<ListCommentsByPostIdUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseRejectedWithPostNotFoundError () {
    useCase.execute.mockRejectedValueOnce(ListCommentsByPostIdError.postNotFound())
  }

  function givenUseCaseRejectedWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenUseCaseResolvedResponse (result: ListCommentsByPostIdResponse) {
    useCase.execute.mockResolvedValueOnce(result)
  }

  beforeEach(async () => {
    useCase = mock()
    logger = mock()
    testingModule = await Test
      .createTestingModule({
        controllers: [ListCommentsByPostIdController],
        providers: [
          {
            provide: ListCommentsByPostIdUseCase,
            useValue: useCase
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

  it('responds 404 NOT_FOUND' +
    ' when given use case rejected error with PostNotFoundError', async () => {
    givenUseCaseRejectedWithPostNotFoundError()

    const response = await request(uut)
      .get(`/posts/${new PostId().value}/comments`)

    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('responds 500 INTERNAL_SERVER_ERROR and logs' +
    ' when given use case rejected unknown error', async () => {
    givenUseCaseRejectedWithUnknownError()

    const response = await request(uut)
      .get(`/posts/${new PostId().value}/comments`)

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(logger.error).toHaveBeenCalled()
  })

  it('responds 200 OK when given use case resolved a user', async () => {
    const postId = new PostId()
    const comments = createDummyCommentsOrderByCreatedAt(2, undefined, postId)
    const useCaseResponse: ListCommentsByPostIdResponse = [
      {
        createdAt: comments[0].createdAt,
        username: 'test-username',
        content: comments[0].content,
        id: comments[0].id.value,
        authorId: comments[0].authorId.value
      },
      {
        createdAt: comments[1].createdAt,
        username: 'test-username',
        content: comments[1].content,
        id: comments[1].id.value,
        authorId: comments[1].authorId.value
      }
    ]
    givenUseCaseResolvedResponse(useCaseResponse)

    const response = await request(uut)
      .get(`/posts/${postId.value}/comments`)

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual([
      {
        createdAt: useCaseResponse[0].createdAt.toISOString(),
        authorName: useCaseResponse[0].username,
        authorId: useCaseResponse[0].authorId,
        content: useCaseResponse[0].content,
        id: useCaseResponse[0].id
      },
      {
        createdAt: useCaseResponse[1].createdAt.toISOString(),
        authorName: useCaseResponse[1].username,
        authorId: useCaseResponse[1].authorId,
        content: useCaseResponse[1].content,
        id: useCaseResponse[1].id
      },
    ])
  })

  it('responds 200 OK' +
    ' when given use case resolved a user and skip and take are given', async () => {
    const postId = new PostId()
    const comments = createDummyCommentsOrderByCreatedAt(2, undefined, postId)
    const useCaseResponse: ListCommentsByPostIdResponse = [
      {
        createdAt: comments[0].createdAt,
        username: 'test-username',
        content: comments[0].content,
        id: comments[0].id.value,
        authorId: comments[0].authorId.value
      },
      {
        createdAt: comments[1].createdAt,
        username: 'test-username',
        content: comments[1].content,
        id: comments[1].id.value,
        authorId: comments[1].authorId.value
      }
    ]
    givenUseCaseResolvedResponse(useCaseResponse)

    const response = await request(uut)
      .get(`/posts/${postId.value}/comments?skip=1&take=2`)

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual([
      {
        createdAt: useCaseResponse[0].createdAt.toISOString(),
        authorName: useCaseResponse[0].username,
        authorId: useCaseResponse[0].authorId,
        content: useCaseResponse[0].content,
        id: useCaseResponse[0].id
      },
      {
        createdAt: useCaseResponse[1].createdAt.toISOString(),
        authorName: useCaseResponse[1].username,
        authorId: useCaseResponse[1].authorId,
        content: useCaseResponse[1].content,
        id: useCaseResponse[1].id
      },
    ])
  })
})
