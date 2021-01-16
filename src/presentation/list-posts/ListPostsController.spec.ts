import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { UserId } from '../../domain/UserId'
import { ListPostsController } from './ListPostsController'
import { ListPostsError, ListPostsResponse, ListPostsUseCase } from '../../application/list-posts'

describe('ListPostsController', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<ListPostsUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseResolvesResponse (result: ListPostsResponse) {
    useCase.execute.mockResolvedValueOnce(result)
  }

  function givenUseCaseRejectsWithAuthorNotFoundError () {
    useCase.execute.mockRejectedValueOnce(ListPostsError.authorNotFound())
  }

  function givenUseCaseRejectsWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  beforeEach(async () => {
    useCase = mock<ListPostsUseCase>()
    logger = mock<Logger>()
    testingModule = await Test
      .createTestingModule({
        controllers: [ListPostsController],
        providers: [
          {
            provide: ListPostsUseCase,
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
      .get('/posts')

    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('responds 500 INTERNAL_SERVER_ERROR and logs' +
    ' when given use case rejected unknown error', async () => {
    givenUseCaseRejectsWithUnknownError()

    const response = await request(uut)
      .get('/posts')

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(logger.error).toHaveBeenCalled()
  })

  it('responds 200 OK when given use case resolved a user', async () => {
    const useCaseResponse: ListPostsResponse = [
      {
        createdAt: new Date(),
        username: 'test-user-name-1',
        title: 'test-title-1',
        id: 'test-id-1'
      },
      {
        createdAt: new Date(),
        username: 'test-user-name-2',
        title: 'test-title-2',
        id: 'test-id-2'
      }
    ]
    givenUseCaseResolvesResponse(useCaseResponse)

    const response = await request(uut)
      .get('/posts')

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual([
      {
        createdAt: useCaseResponse[0].createdAt.toISOString(),
        authorName: 'test-user-name-1',
        title: 'test-title-1',
        id: 'test-id-1'
      },
      {
        createdAt: useCaseResponse[1].createdAt.toISOString(),
        authorName: 'test-user-name-2',
        title: 'test-title-2',
        id: 'test-id-2'
      }
    ])
  })
})
