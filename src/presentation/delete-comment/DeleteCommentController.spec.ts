import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { mock, MockProxy } from 'jest-mock-extended'
import { DeleteCommentError, DeleteCommentUseCase } from '../../application/delete-comment'
import request from 'supertest'
import { DeleteCommentController } from './DeleteCommentController'

describe('DeleteCommentController', () => {
  const COMMENT_ID = 'test-comment-id'

  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown
  let useCase: MockProxy<DeleteCommentUseCase>
  let logger: MockProxy<Logger>

  function givenUseCaseRejectedWithPageNotFoundError () {
    useCase.execute.mockRejectedValueOnce(DeleteCommentError.commentNotFound())
  }

  function givenUseCaseResolves () {
    useCase.execute.mockResolvedValueOnce()
  }

  beforeEach(async () => {
    useCase = mock()
    logger = mock()
    testingModule = await Test
      .createTestingModule({
        controllers: [DeleteCommentController],
        providers: [
          {
            provide: DeleteCommentUseCase,
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

  it('responds 404 NOT_FOUND when post corresponding to given post ID does not exist', async () => {
    givenUseCaseRejectedWithPageNotFoundError()

    const response = await request(uut)
      .delete(`/comments/${COMMENT_ID}`)

    expect(response.status).toBe(HttpStatus.NOT_FOUND)
  })

  it('responds nothing when given use case resolves', async () => {
    givenUseCaseResolves()

    const response = await request(uut)
      .delete(`/comments/${COMMENT_ID}`)

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual({})
  })
})
