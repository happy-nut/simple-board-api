import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { UserId } from '../../domain/UserId'
import { GetUserController } from './GetUserController'
import { GetUserError, GetUserResponse, GetUserUseCase } from '../../application/get-user'

describe('GetUserController', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<GetUserUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseResolvesResponse (result: GetUserResponse) {
    useCase.execute.mockResolvedValueOnce(result)
  }

  function givenUseCaseRejectsWithUserNotFoundError () {
    useCase.execute.mockRejectedValueOnce(GetUserError.useNotFound())
  }

  function givenUseCaseRejectsWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  beforeEach(async () => {
    useCase = mock<GetUserUseCase>()
    logger = mock<Logger>()
    testingModule = await Test
      .createTestingModule({
        controllers: [GetUserController],
        providers: [
          {
            provide: GetUserUseCase,
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
    ' when given use case rejected error with USER_NOT_FOUND', async () => {
    const id = new UserId().value
    givenUseCaseRejectsWithUserNotFoundError()

    const response = await request(uut)
      .get(`/users/${id}`)

    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('responds 500 INTERNAL_SERVER_ERROR and logs' +
    ' when given use case rejected unknown error', async () => {
    const id = new UserId().value
    givenUseCaseRejectsWithUnknownError()

    const response = await request(uut)
      .get(`/users/${id}`)

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(logger.error).toHaveBeenCalled()
  })

  it('responds 200 OK when given use case resolved a user', async () => {
    const id = new UserId().value
    const name = 'test-user-name'
    const registeredAt = new Date()
    givenUseCaseResolvesResponse({
      id,
      name,
      registeredAt
    })

    const response = await request(uut)
      .get(`/users/${id}`)

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual({
      id,
      name,
      registeredAt: registeredAt.toISOString()
    })
  })
})
