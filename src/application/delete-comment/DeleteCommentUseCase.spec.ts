import { mock, MockProxy } from 'jest-mock-extended'
import { DeleteCommentUseCase } from './DeleteCommentUseCase'
import { DeleteCommentError } from './DeleteCommentError'
import { CommentRepository } from '../../domain/CommentRepository'
import { Comment } from '../../domain/Comment'
import { CommentId } from '../../domain/CommentId'
import { createDummyComment } from '../../../test/support/utils'

describe('DeleteCommentUseCase', () => {
  const COMMENT_ID = 'test-comment-id'

  let commentRepository: MockProxy<CommentRepository>
  let uut: DeleteCommentUseCase

  function givenRepositoryFindOneByIdResolvesUndefined () {
    commentRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenRepositoryFindOneByIdResolvesPost (comment: Comment) {
    commentRepository.findOneById.mockResolvedValueOnce(comment)
  }

  beforeEach(() => {
    commentRepository = mock()
    uut = new DeleteCommentUseCase(commentRepository)
  })

  it('throws commentNotFound error when given repository resolves with undefined', async () => {
    givenRepositoryFindOneByIdResolvesUndefined()

    await expect(uut.execute({ commentId: COMMENT_ID }))
      .rejects
      .toThrow(DeleteCommentError.commentNotFound())

    expect(commentRepository.findOneById).toHaveBeenCalledWith(new CommentId(COMMENT_ID))
  })

  it('responds nothing when given repository resolves a post', async () => {
    const commentId = new CommentId(COMMENT_ID)
    const comment = createDummyComment({}, commentId)
    givenRepositoryFindOneByIdResolvesPost(comment)

    const response = await uut.execute({ commentId: COMMENT_ID })

    expect(commentRepository.findOneById).toHaveBeenCalledWith(commentId)
    expect(commentRepository.removeOne).toHaveBeenCalledWith(comment)
    expect(response).toBeUndefined()
  })
})
