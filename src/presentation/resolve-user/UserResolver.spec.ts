import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mock, MockProxy } from 'jest-mock-extended'
import { GetUserError, GetUserResponse, GetUserUseCase } from '../../application/get-user'
import { GraphQueryLanguageModule } from '../../modules'
import { CreateUserInput, UserResolver } from './UserResolver'
import { UserId } from '../../domain/UserId'
import request from 'supertest'
import { User } from '../../domain'
import {
  CreateUserError,
  CreateUserResponse,
  CreateUserUseCase
} from '../../application/create-user'
import json5 from 'json5'

describe('UserResolver', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let getUserUseCase: MockProxy<GetUserUseCase>
  let createUserUseCase: MockProxy<CreateUserUseCase>
  let logger: MockProxy<Logger>

  function givenGetUseCaseRejectedWithUserNotFoundError (): void {
    getUserUseCase.execute.mockRejectedValueOnce(GetUserError.useNotFound())
  }

  function givenGetUseCaseRejectedWithUnknownError (): void {
    getUserUseCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenGetUseCaseResolvedWithResponse (response: GetUserResponse): void {
    getUserUseCase.execute.mockResolvedValueOnce(response)
  }

  function givenCreateUseCaseRejectedWithUserCreatingFailedError (): void {
    createUserUseCase.execute.mockRejectedValueOnce(CreateUserError.userCreatingFailed())
  }

  function givenCreateUseCaseRejectedWithUnknownError (): void {
    createUserUseCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenCreateUseCaseResolvedWithResponse (response: CreateUserResponse): void {
    createUserUseCase.execute.mockResolvedValueOnce(response)
  }

  function createUserQuery (userId: string): string {
    return `
      {
        getUser (id: "${userId}") {
          id, registeredAt, name
        }
      }
    `
  }

  function createUserMutation (input: CreateUserInput): string {
    return `
      mutation {
        createUser (input: ${json5.stringify(input, { quote: '"' })}) {
          id, registeredAt, name
        }
      }
    `
  }

  beforeEach(async () => {
    getUserUseCase = mock()
    createUserUseCase = mock()
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
            provide: CreateUserUseCase,
            useValue: createUserUseCase
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

  describe('.get()', () => {
    it('responses with errors when user of given ID does not exist', async () => {
      givenGetUseCaseRejectedWithUserNotFoundError()
      const userId = new UserId().value
      const query = createUserQuery(userId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: query
        })

      expect(getUserUseCase.execute).toHaveBeenCalledWith({ id: userId })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors[0]).toEqual(expect.objectContaining({
        message: `User not found with ID: ${userId}`
      }))
    })

    it('responses with errors and logs when user of given ID does not exist', async () => {
      givenGetUseCaseRejectedWithUnknownError()
      const userId = new UserId().value
      const query = createUserQuery(userId)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: query
        })

      expect(getUserUseCase.execute).toHaveBeenCalledWith({ id: userId })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors).toBeDefined()
      expect(logger.error).toHaveBeenCalled()
    })

    it('responses with a user when user of given ID exists', async () => {
      const user = User.createNew({ name: 'test-name' })
      const getUserResponse = {
        id: user.id.value,
        registeredAt: user.registeredAt,
        name: user.name
      }
      givenGetUseCaseResolvedWithResponse(getUserResponse)
      const query = createUserQuery(user.id.value)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query
        })

      expect(getUserUseCase.execute).toHaveBeenCalledWith({ id: user.id.value })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        getUser: {
          id: user.id.value,
          name: 'test-name',
          registeredAt: user.registeredAt.toISOString()
        }
      })
      expect(response.body.errors).toBeUndefined()
    })
  })

  describe('.create()', () => {
    it('responses error when given user case rejected with userCreatingFailed error', async () => {
      givenCreateUseCaseRejectedWithUserCreatingFailedError()
      const input: CreateUserInput = {
        name: 'test-user-name'
      }
      const mutation = createUserMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(createUserUseCase.execute).toHaveBeenCalledWith({
        name: 'test-user-name'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors[0]).toEqual(expect.objectContaining({
        message: 'Failed to create a user'
      }))
    })

    it('responses error and logs when given user case rejected with unknown error', async () => {
      givenCreateUseCaseRejectedWithUnknownError()
      const input: CreateUserInput = {
        name: 'test-user-name'
      }
      const mutation = createUserMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(createUserUseCase.execute).toHaveBeenCalledWith({
        name: 'test-user-name'
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toBeNull()
      expect(response.body.errors).toBeDefined()
      expect(logger.error).toHaveBeenCalled()
    })

    it('responses a user and logs when given user case resolved', async () => {
      const userId = new UserId().value
      const name = 'test-user-name'
      const registeredAt = new Date()
      const createUserResponse: CreateUserResponse = {
        id: userId,
        name,
        registeredAt
      }
      givenCreateUseCaseResolvedWithResponse(createUserResponse)
      const input: CreateUserInput = {
        name
      }
      const mutation = createUserMutation(input)

      const response = await request(uut)
        .post('/graphql')
        .send({
          operationName: null,
          query: mutation
        })

      expect(createUserUseCase.execute).toHaveBeenCalledWith({ name })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body.data).toEqual({
        createUser: {
          id: userId,
          name,
          registeredAt: registeredAt.toISOString()
        }
      })
      expect(response.body.errors).toBeUndefined()
    })
  })
})
