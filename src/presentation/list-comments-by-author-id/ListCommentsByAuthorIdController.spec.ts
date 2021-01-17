import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import {
  ListCommentsByAuthorIdError,
  ListCommentsByAuthorIdResponse,
  ListCommentsByAuthorIdUseCase
} from '../../application/list-comments-by-author-id'
import { ListCommentsByAuthorIdController } from './ListCommentsByAuthorIdController'
import { UserId } from '../../domain/UserId'
import { createDummyCommentsOrderByCreatedAt } from '../../../test/support/utils'

describe('ListCommentsByAuthorIdController', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<ListCommentsByAuthorIdUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseRejectsWithAuthorNotFoundError () {
    useCase.execute.mockRejectedValueOnce(ListCommentsByAuthorIdError.authorNotFound())
  }

  function givenUseCaseRejectsWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenUseCaseResolvesResponse (result: ListCommentsByAuthorIdResponse) {
    useCase.execute.mockResolvedValueOnce(result)
  }

  beforeEach(async () => {
    useCase = mock()
    logger = mock()
    testingModule = await Test
      .createTestingModule({
        controllers: [ListCommentsByAuthorIdController],
        providers: [
          {
            provide: ListCommentsByAuthorIdUseCase,
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
    ' when given use case rejected error with AUTHOR_NOT_FOUND', async () => {
    givenUseCaseRejectsWithAuthorNotFoundError()

    const response = await request(uut)
      .get(`/users/${new UserId().value}/comments`)

    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('responds 500 INTERNAL_SERVER_ERROR and logs' +
    ' when given use case rejected unknown error', async () => {
    givenUseCaseRejectsWithUnknownError()

    const response = await request(uut)
      .get(`/users/${new UserId().value}/comments`)

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(logger.error).toHaveBeenCalled()
  })

  it('responds 200 OK when given use case resolved a user', async () => {
    const userId = new UserId()
    const comments = createDummyCommentsOrderByCreatedAt(2, userId)
    const useCaseResponse: ListCommentsByAuthorIdResponse = [
      {
        createdAt: comments[0].createdAt,
        username: 'test-username',
        content: comments[0].content,
        id: comments[0].id.value,
        postId: comments[0].postId.value
      },
      {
        createdAt: comments[1].createdAt,
        username: 'test-username',
        content: comments[1].content,
        id: comments[1].id.value,
        postId: comments[1].postId.value
      }
    ]
    givenUseCaseResolvesResponse(useCaseResponse)

    const response = await request(uut)
      .get(`/users/${userId.value}/comments`)

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual([
      {
        createdAt: useCaseResponse[0].createdAt.toISOString(),
        authorName: useCaseResponse[0].username,
        postId: comments[0].postId.value,
        content: useCaseResponse[0].content,
        id: useCaseResponse[0].id
      },
      {
        createdAt: useCaseResponse[1].createdAt.toISOString(),
        authorName: useCaseResponse[1].username,
        postId: comments[1].postId.value,
        content: useCaseResponse[1].content,
        id: useCaseResponse[1].id
      },
    ])
  })
})
