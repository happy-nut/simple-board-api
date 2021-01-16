import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { UserId } from '../../domain/UserId'
import { GetPostError, GetPostResponse, GetPostUseCase } from '../../application/get-post'
import { GetPostController } from './GetPostController'
import { PostId } from '../../domain/Post'

describe('GetPostController', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<GetPostUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseRejectsWithPostNotFoundError () {
    useCase.execute.mockRejectedValueOnce(GetPostError.postNotFound())
  }

  function givenUseCaseRejectsWithAuthorNotFoundError () {
    useCase.execute.mockRejectedValueOnce(GetPostError.authorNotFound())
  }

  function givenUseCaseRejectsWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  function givenUseCaseResolvesResponse (result: GetPostResponse) {
    useCase.execute.mockResolvedValueOnce(result)
  }

  beforeEach(async () => {
    useCase = mock()
    logger = mock()
    testingModule = await Test
      .createTestingModule({
        controllers: [GetPostController],
        providers: [
          {
            provide: GetPostUseCase,
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
    ' when given use case rejected error with POST_NOT_FOUND', async () => {
    const id = new PostId().value
    givenUseCaseRejectsWithPostNotFoundError()

    const response = await request(uut)
      .get(`/posts/${id}`)

    expect(useCase.execute).toHaveBeenCalledWith({ id })
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('responds 404 NOT_FOUND' +
    ' when given use case rejected error with AUTHOR_NOT_FOUND', async () => {
    const id = new PostId().value
    givenUseCaseRejectsWithAuthorNotFoundError()

    const response = await request(uut)
      .get(`/posts/${id}`)

    expect(useCase.execute).toHaveBeenCalledWith({ id })
    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('responds 500 INTERNAL_SERVER_ERROR and logs' +
    ' when given use case rejected unknown error', async () => {
    const id = new PostId().value
    givenUseCaseRejectsWithUnknownError()

    const response = await request(uut)
      .get(`/posts/${id}`)

    expect(useCase.execute).toHaveBeenCalledWith({ id })
    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(logger.error).toHaveBeenCalled()
  })

  it('responds 200 OK when given use case resolved a user', async () => {
    const id = new PostId().value
    const authorId = new UserId().value
    const authorName = 'test-author-name'
    const title = 'test-title'
    const content = 'test-content'
    const createdAt = new Date()
    givenUseCaseResolvesResponse({
      id,
      authorId,
      authorName,
      title,
      content,
      createdAt
    })

    const response = await request(uut)
      .get(`/posts/${id}`)

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual({
      id,
      authorId,
      authorName,
      title,
      content,
      createdAt: createdAt.toISOString()
    })
  })
})
