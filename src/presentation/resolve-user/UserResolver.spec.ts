import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mock, MockProxy } from 'jest-mock-extended'
import { GetUserError, GetUserResponse, GetUserUseCase } from '../../application/get-user'
import { GraphQueryLanguageModule } from '../../modules'
import { UserResolver } from './UserResolver'
import { UserId } from '../../domain/UserId'
import request from 'supertest'
import { User } from '../../domain'

describe('UserResolver', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let getUserUseCase: MockProxy<GetUserUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseRejectedWithUserNotFoundError () {
    getUserUseCase.execute.mockRejectedValueOnce(GetUserError.useNotFound())
  }

  function givenUseCaseRejectedWithUnknownError () {
    getUserUseCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenUseCaseResolvedWithUserResponse (getUserResponse: GetUserResponse) {
    getUserUseCase.execute.mockResolvedValueOnce(getUserResponse)
  }

  function createUserQuery (userId: string) {
    return `
      {
        user (id: "${userId}") {
          id, registeredAt, name
        }
      }
    `
  }

  beforeEach(async () => {
    getUserUseCase = mock()
    logger = mock()
    testingModule = await Test
      .createTestingModule({
        imports: [GraphQueryLanguageModule],
        providers: [
          UserResolver,
          {
            provide: GetUserUseCase,
            useValue: getUserUseCase
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

  it('responses with errors when user of given ID does not exist', async () => {
    givenUseCaseRejectedWithUserNotFoundError()
    const userId = new UserId().value
    const userQuery = createUserQuery(userId)

    const response = await request(uut)
      .post('/graphql')
      .send({
        operationName: null,
        query: userQuery
      })

    expect(getUserUseCase.execute).toHaveBeenCalledWith({ id: userId })
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body.data).toBeNull()
    expect(response.body.errors[0]).toEqual(expect.objectContaining({
      message: `User not found with ID: ${userId}`
    }))
  })

  it('responses with errors and logs when user of given ID does not exist', async () => {
    givenUseCaseRejectedWithUnknownError()
    const userId = new UserId().value
    const userQuery = createUserQuery(userId)

    const response = await request(uut)
      .post('/graphql')
      .send({
        operationName: null,
        query: userQuery
      })

    expect(getUserUseCase.execute).toHaveBeenCalledWith({ id: userId })
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body.data).toBeNull()
    expect(response.body.errors).toBeDefined()
    expect(logger.error).toHaveBeenCalled()
  })

  it('responses user with a user when user of given ID exists', async () => {
    const user = User.createNew({ name: 'test-name' })
    const getUserResponse = {
      id: user.id.value,
      registeredAt: user.registeredAt,
      name: user.name
    }
    givenUseCaseResolvedWithUserResponse(getUserResponse)
    const userQuery = createUserQuery(user.id.value)

    const response = await request(uut)
      .post('/graphql')
      .send({
        operationName: null,
        query: userQuery
      })

    expect(getUserUseCase.execute).toHaveBeenCalledWith({ id: user.id.value })
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual({
      data: {
        user: {
          id: user.id.value,
          name: 'test-name',
          registeredAt: user.registeredAt.toISOString()
        }
      }
    })
  })
})
