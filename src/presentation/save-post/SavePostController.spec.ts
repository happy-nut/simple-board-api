import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { SavePostError, SavePostUseCase } from '../../application/save-post'
import { SavePostController } from './SavePostController'

describe('SavePostController', () => {
  const BODY = {
    title: 'test-title',
    content: 'test-content',
    authorId: 'test-author-id'
  }
  const POST_ID = 'test-post-id'

  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<SavePostUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseResolvesResponse () {
    useCase.execute.mockResolvedValueOnce({ postId: POST_ID })
  }

  function givenUseCaseRejectsWithAuthorNotFoundError () {
    useCase.execute.mockRejectedValueOnce(SavePostError.authorNotFound())
  }

  function givenUseCaseRejectsWithPostCreatingFailedError () {
    useCase.execute.mockRejectedValueOnce(SavePostError.postCreatingFailed())
  }

  function givenUseCaseRejectsWithPostNotFoundError () {
    useCase.execute.mockRejectedValueOnce(SavePostError.postNotFound())
  }

  function givenUseCaseRejectsWithPostUpdatingFailedError () {
    useCase.execute.mockRejectedValueOnce(SavePostError.postUpdatingFailed())
  }

  function givenUseCaseRejectsWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  beforeEach(async () => {
    useCase = mock<SavePostUseCase>()
    logger = mock<Logger>()
    testingModule = await Test
      .createTestingModule({
        controllers: [SavePostController],
        providers: [
          {
            provide: SavePostUseCase,
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

  describe('.create', () => {
    it('responds 404 NOT_FOUND' +
      ' when given use case rejected with AUTHOR_NOT_FOUND error', async () => {
      givenUseCaseRejectsWithAuthorNotFoundError()

      const response = await request(uut)
        .post('/posts')
        .send(BODY)

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })

    it('responds 500 INTERNAL_SERVER_ERROR and logs' +
      ' when given use case rejected with unknown error', async () => {
      givenUseCaseRejectsWithUnknownError()

      const response = await request(uut)
        .post('/posts')
        .send(BODY)

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(logger.error).toHaveBeenCalled()
    })

    it('responds 500 INTERNAL_SERVER_ERROR' +
      ' when given use case rejected with POST_CREATING_FAILED error', async () => {
      givenUseCaseRejectsWithPostCreatingFailedError()

      const response = await request(uut)
        .post('/posts')
        .send(BODY)

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })

    it('responds 200 OK when given use case resolves', async () => {
      givenUseCaseResolvesResponse()

      const response = await request(uut)
        .post('/posts')
        .send(BODY)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        id: POST_ID
      })
    })
  })

  describe('.update', () => {
    it('responds 404 NOT_FOUND' +
      ' when given use case rejected error with AUTHOR_NOT_FOUND', async () => {
      givenUseCaseRejectsWithAuthorNotFoundError()

      const response = await request(uut)
        .put(`/posts/${POST_ID}`)
        .send(BODY)

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })

    it('responds 500 INTERNAL_SERVER_ERROR and logs' +
      ' when given use case rejected unknown error', async () => {
      givenUseCaseRejectsWithUnknownError()

      const response = await request(uut)
        .put(`/posts/${POST_ID}`)
        .send(BODY)

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(logger.error).toHaveBeenCalled()
    })

    it('responds 500 INTERNAL_SERVER_ERROR' +
      ' when given use case rejected with POST_UPDATING_FAILED error', async () => {
      givenUseCaseRejectsWithPostUpdatingFailedError()

      const response = await request(uut)
        .put(`/posts/${POST_ID}`)
        .send(BODY)

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })

    it('responds 404 NOT_FOUND' +
      ' when given use case rejected with POST_NOT_FOUND error', async () => {
      givenUseCaseRejectsWithPostNotFoundError()

      const response = await request(uut)
        .put(`/posts/${POST_ID}`)
        .send(BODY)

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })

    it('responds 200 OK when given use case resolves', async () => {
      givenUseCaseResolvesResponse()

      const response = await request(uut)
        .put(`/posts/${POST_ID}`)
        .send(BODY)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        id: POST_ID
      })
    })
  })
})
