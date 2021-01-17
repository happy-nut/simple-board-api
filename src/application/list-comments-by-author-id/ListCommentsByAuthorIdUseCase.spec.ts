import { mock, MockProxy } from 'jest-mock-extended'
import { User, UserRepository } from '../../domain'
import { CommentRepository } from '../../domain/CommentRepository'
import { Comment } from '../../domain/Comment'
import { ListCommentsByAuthorIdUseCase } from './ListCommentsByAuthorIdUseCase'
import { UserId } from '../../domain/UserId'
import { ListCommentsByAuthorIdError } from './ListCommentsByAuthorIdError'
import { createDummyCommentsOrderByCreatedAt, createDummyUser } from '../../../test/support/utils'

describe('ListCommentsByAuthorIdUseCase', () => {
  let userRepository: MockProxy<UserRepository>
  let commentRepository: MockProxy<CommentRepository>
  let uut: ListCommentsByAuthorIdUseCase

  function givenUserRepositoryFindAllByIdsResolvesEmptyList () {
    userRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenUserRepositoryFindAllByIdsResolvesUser (user: User) {
    userRepository.findOneById.mockResolvedValueOnce(user)
  }

  function givenCommentRepositoryFindAllResolvesEmptyList () {
    commentRepository.findAllByUserId.mockResolvedValueOnce([])
  }

  function givenCommentRepositoryFindAllResolvesComments (comments: Comment[]) {
    commentRepository.findAllByUserId.mockResolvedValueOnce(comments)
  }

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    commentRepository = mock<CommentRepository>()
    uut = new ListCommentsByAuthorIdUseCase(userRepository, commentRepository)
  })

  it('throws an authorNotFound error' +
    ' when user repository findById resolves undefined', async () => {
    const userId = new UserId()
    givenUserRepositoryFindAllByIdsResolvesEmptyList()

    await expect(uut.execute({ authorId: userId.value }))
      .rejects
      .toThrowError(ListCommentsByAuthorIdError.authorNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(userId)
  })

  it('returns empty list when given comment repository resolves empty list', async () => {
    const userId = new UserId()
    const user = createDummyUser({}, userId)
    givenUserRepositoryFindAllByIdsResolvesUser(user)
    givenCommentRepositoryFindAllResolvesEmptyList()

    const response = await uut.execute({ authorId: userId.value })

    expect(response).toEqual([])
    expect(userRepository.findOneById).toHaveBeenCalledWith(userId)
    expect(commentRepository.findAllByUserId).toHaveBeenCalledWith(userId)
  })

  it('returns comment list when given comment repository resolves comments', async () => {
    const userId = new UserId()
    const user = createDummyUser({}, userId)
    givenUserRepositoryFindAllByIdsResolvesUser(user)
    const comments = createDummyCommentsOrderByCreatedAt(2, userId)
    givenCommentRepositoryFindAllResolvesComments(comments)

    const response = await uut.execute({ authorId: userId.value })

    expect(userRepository.findOneById).toHaveBeenCalledWith(userId)
    expect(commentRepository.findAllByUserId).toHaveBeenCalledWith(userId)
    expect(response).toEqual([
      {
        id: comments[0].id.value,
        postId: comments[0].postId.value,
        username: user.name,
        content: comments[0].content,
        createdAt: comments[0].createdAt
      },
      {
        id: comments[1].id.value,
        postId: comments[1].postId.value,
        username: user.name,
        content: comments[1].content,
        createdAt: comments[1].createdAt
      }
    ])
  })
})
