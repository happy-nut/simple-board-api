import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
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
    testingModule = await Test
      .createTestingModule({
        controllers: [CreateUserController],
        providers: [
          {
            provide: CreateUserUseCase,
            useValue: useCase
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
    givenUserCaseRejectsWithUserAlreadyCreatedError()
    const body: CreateUserBody = { name }

    const response = await request(uut)
      .post('/users')
      .send(body)

    expect(response.status).toBe(HttpStatus.CONFLICT)
  })

  it('responds 500 INTERNAL SERVER ERROR' +
    ' when given use case rejected unknown error', async () => {
    const name = 'test-user-name'
    givenUserCaseRejectsWithUnknownError()
    const body: CreateUserBody = { name }

    const response = await request(uut)
      .post('/users')
      .send(body)

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
  })

  it('responds 200 OK when given use case resolved a user', async () => {
    const id = new UserId().value
    const name = 'test-user-name'
    const registeredAt = new Date()
    givenUserCaseResolvesResponse({
      id,
      name,
      registeredAt
    })
    const body: CreateUserBody = { name }

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
