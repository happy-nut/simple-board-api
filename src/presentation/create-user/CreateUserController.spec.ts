import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import {
  CreateUserError,
  CreateUserResponse,
  CreateUserUseCase
} from '../../application/create-user'
import { mock, MockProxy } from 'jest-mock-extended'
import { UserId } from '../../domain/UserId'
import { CreateUserBody, CreateUserController } from './CreateUserController'

describe('CreateUserController', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<CreateUserUseCase>
  let logger: MockProxy<Logger>

  function givenUserCaseResolvesResponse (result: CreateUserResponse) {
    useCase.execute.mockResolvedValueOnce(result)
  }

  function givenUserCaseRejectsWithUserAlreadyCreatedError () {
    useCase.execute.mockRejectedValueOnce(CreateUserError.userAlreadyCreated())
  }

  function givenUserCaseRejectsWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  beforeEach(async () => {
    useCase = mock<CreateUserUseCase>()
    logger = mock<Logger>()
    testingModule = await Test
      .createTestingModule({
        controllers: [CreateUserController],
        providers: [
          {
            provide: CreateUserUseCase,
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

  it('responds 409 CONFLICT' +
    ' when given use case rejected error with USER_ALREADY_CREATED', async () => {
    const name = 'test-user-name'
    const body: CreateUserBody = { name }
    givenUserCaseRejectsWithUserAlreadyCreatedError()

    const response = await request(uut)
      .post('/users')
      .send(body)

    expect(response.status).toBe(HttpStatus.CONFLICT)
  })

  it('responds 500 INTERNAL SERVER ERROR and logs' +
    ' when given use case rejected unknown error', async () => {
    const name = 'test-user-name'
    const body: CreateUserBody = { name }
    givenUserCaseRejectsWithUnknownError()

    const response = await request(uut)
      .post('/users')
      .send(body)

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(logger.error).toHaveBeenCalled()
  })

  it('responds 200 OK when given use case resolved a user', async () => {
    const id = new UserId().value
    const name = 'test-user-name'
    const registeredAt = new Date()
    const body: CreateUserBody = { name }
    givenUserCaseResolvesResponse({
      id,
      name,
      registeredAt
    })

    const response = await request(uut)
      .post('/users')
      .send(body)

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual({
      id,
      name,
      registeredAt: registeredAt.toISOString()
    })
  })
})
