import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { SaveCommentError, SaveCommentUseCase } from '../../application/save-Comment'
import { SaveCommentController } from './SaveCommentController'

describe('SaveCommentController', () => {
  const BODY = {
    content: 'test-content',
    postId: 'test-post-id',
    authorId: 'test-author-id'
  }
  const COMMENT_ID = 'test-comment-id'

  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<SaveCommentUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseResolvedResponse () {
    useCase.execute.mockResolvedValueOnce({ commentId: COMMENT_ID })
  }

  function givenUseCaseRejectedWithAuthorNotFoundError () {
    useCase.execute.mockRejectedValueOnce(SaveCommentError.authorNotFound())
  }

  function givenUseCaseRejectedWithPostNotFoundError () {
    useCase.execute.mockRejectedValueOnce(SaveCommentError.postNotFound())
  }

  function givenUseCaseRejectedWithCommentNotFoundError () {
    useCase.execute.mockRejectedValueOnce(SaveCommentError.commentNotFound())
  }

  function givenUseCaseRejectedWithUnknownError () {
    useCase.execute.mockRejectedValueOnce(new Error('unknown'))
  }

  beforeEach(async () => {
    useCase = mock<SaveCommentUseCase>()
    logger = mock<Logger>()
    testingModule = await Test
      .createTestingModule({
        controllers: [SaveCommentController],
        providers: [
          {
            provide: SaveCommentUseCase,
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
      ' when given use case rejected with AuthorNotFoundError', async () => {
      givenUseCaseRejectedWithAuthorNotFoundError()

      const response = await request(uut)
        .post('/comments')
        .send(BODY)

      expect(useCase.execute).toHaveBeenCalledWith(BODY)
      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })

    it('responds 404 NOT_FOUND' +
      ' when given use case rejected with AuthorNotFoundError', async () => {
      givenUseCaseRejectedWithPostNotFoundError()

      const response = await request(uut)
        .post('/comments')
        .send(BODY)

      expect(useCase.execute).toHaveBeenCalledWith(BODY)
      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })

    it('responds 500 INTERNAL_SERVER_ERROR and logs' +
      ' when given use case rejected with unknown error', async () => {
      givenUseCaseRejectedWithUnknownError()

      const response = await request(uut)
        .post('/comments')
        .send(BODY)

      expect(useCase.execute).toHaveBeenCalledWith(BODY)
      expect(logger.error).toHaveBeenCalled()
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })

    it('responds 200 OK when given use case resolves', async () => {
      givenUseCaseResolvedResponse()

      const response = await request(uut)
        .post('/comments')
        .send(BODY)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        id: COMMENT_ID
      })
    })
  })

  describe('.update', () => {
    it('responds 404 NOT_FOUND' +
      ' when given use case rejected with AuthorNotFoundError', async () => {
      givenUseCaseRejectedWithAuthorNotFoundError()

      const response = await request(uut)
        .put(`/comments/${COMMENT_ID}`)
        .send(BODY)

      expect(useCase.execute).toHaveBeenCalledWith({
        ...BODY,
        id: COMMENT_ID
      })
      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })

    it('responds 404 NOT_FOUND' +
      ' when given use case rejected with PostNotFoundError', async () => {
      givenUseCaseRejectedWithPostNotFoundError()

      const response = await request(uut)
        .put(`/comments/${COMMENT_ID}`)
        .send(BODY)

      expect(useCase.execute).toHaveBeenCalledWith({
        ...BODY,
        id: COMMENT_ID
      })
      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })

    it('responds 404 NOT_FOUND' +
      ' when given use case rejected with AuthorNotFoundError', async () => {
      givenUseCaseRejectedWithCommentNotFoundError()

      const response = await request(uut)
        .put(`/comments/${COMMENT_ID}`)
        .send(BODY)

      expect(useCase.execute).toHaveBeenCalledWith({
        ...BODY,
        id: COMMENT_ID
      })
      expect(response.status).toBe(HttpStatus.NOT_FOUND)
    })

    it('responds 500 INTERNAL_SERVER_ERROR and logs' +
      ' when given use case rejected unknown error', async () => {
      givenUseCaseRejectedWithUnknownError()

      const response = await request(uut)
        .put(`/comments/${COMMENT_ID}`)
        .send(BODY)

      expect(useCase.execute).toHaveBeenCalledWith({
        ...BODY,
        id: COMMENT_ID
      })
      expect(logger.error).toHaveBeenCalled()
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })

    it('responds 200 OK when given use case resolves', async () => {
      givenUseCaseResolvedResponse()

      const response = await request(uut)
        .put(`/comments/${COMMENT_ID}`)
        .send(BODY)

      expect(useCase.execute).toHaveBeenCalledWith({
        ...BODY,
        id: COMMENT_ID
      })
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        id: COMMENT_ID
      })
    })
  })
})
