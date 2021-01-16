import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import {
  ListPostsByAuthorIdError, ListPostsByAuthorIdResponse,
  ListPostsByAuthorIdUseCase
} from '../../application/list-posts-by-author-id'
import { ListPostsByAuthorIdController } from './ListPostsByAuthorIdController'
import { UserId } from '../../domain/UserId'
import { createDummyPostsOrderByCreatedAt } from '../../../test/support/utils/createDummyPostsOrderByCreatedAt'

describe('ListPostsByAuthorIdController', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<ListPostsByAuthorIdUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseRejectsWithAuthorNotFoundError () {
    useCase.execute.mockRejectedValueOnce(ListPostsByAuthorIdError.authorNotFound())
  }

  function givenUseCaseRejectsWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenUseCaseResolvesResponse (result: ListPostsByAuthorIdResponse) {
    useCase.execute.mockResolvedValueOnce(result)
  }

  beforeEach(async () => {
    useCase = mock()
    logger = mock()
    testingModule = await Test
      .createTestingModule({
        controllers: [ListPostsByAuthorIdController],
        providers: [
          {
            provide: ListPostsByAuthorIdUseCase,
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
      .get(`/users/${new UserId().value}/posts`)

    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('responds 500 INTERNAL_SERVER_ERROR and logs' +
    ' when given use case rejected unknown error', async () => {
    givenUseCaseRejectsWithUnknownError()

    const response = await request(uut)
      .get(`/users/${new UserId().value}/posts`)

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(logger.error).toHaveBeenCalled()
  })

  it('responds 200 OK when given use case resolved a user', async () => {
    const userId = new UserId()
    const posts = createDummyPostsOrderByCreatedAt(2, userId)
    const useCaseResponse: ListPostsByAuthorIdResponse = [
      {
        createdAt: posts[0].createdAt,
        username: 'test-username',
        title: posts[0].title,
        content: posts[0].content,
        id: posts[0].id.value,
        authorId: userId.value
      },
      {
        createdAt: posts[1].createdAt,
        username: 'test-username',
        title: posts[1].title,
        content: posts[1].content,
        id: posts[1].id.value,
        authorId: userId.value
      }
    ]
    givenUseCaseResolvesResponse(useCaseResponse)

    const response = await request(uut)
      .get(`/users/${userId.value}/posts`)

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual([
      {
        createdAt: useCaseResponse[0].createdAt.toISOString(),
        authorName: useCaseResponse[0].username,
        authorId: useCaseResponse[0].authorId,
        title: useCaseResponse[0].title,
        content: useCaseResponse[0].content,
        id: useCaseResponse[0].id
      },
      {
        createdAt: useCaseResponse[1].createdAt.toISOString(),
        authorName: useCaseResponse[1].username,
        authorId: useCaseResponse[1].authorId,
        title: useCaseResponse[1].title,
        content: useCaseResponse[1].content,
        id: useCaseResponse[1].id
      },
    ])
  })
})
