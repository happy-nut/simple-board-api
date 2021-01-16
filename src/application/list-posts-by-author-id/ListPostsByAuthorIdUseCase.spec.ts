import { mock, MockProxy } from 'jest-mock-extended'
import { User, UserRepository } from '../../domain'
import { PostRepository } from '../../domain/PostRepository'
import { Post } from '../../domain/Post'
import { ListPostsByAuthorIdUseCase } from './ListPostsByAuthorIdUseCase'
import { UserId } from '../../domain/UserId'
import { ListPostsByAuthorIdError } from './ListPostsByAuthorIdError'
import {
  createDummyPostsOrderByCreatedAt
} from '../../../test/support/utils/createDummyPostsOrderByCreatedAt'

describe('ListPostsByAuthorIdUseCase', () => {
  let userRepository: MockProxy<UserRepository>
  let postRepository: MockProxy<PostRepository>
  let uut: ListPostsByAuthorIdUseCase

  function givenUserRepositoryFindAllByIdsResolvesEmptyList () {
    userRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenUserRepositoryFindAllByIdsResolvesUser (user: User) {
    userRepository.findOneById.mockResolvedValueOnce(user)
  }

  function givenPostRepositoryFindAllResolvesEmptyList () {
    postRepository.findAllByUserId.mockResolvedValueOnce([])
  }

  function givenPostRepositoryFindAllResolvesPosts (posts: Post[]) {
    postRepository.findAllByUserId.mockResolvedValueOnce(posts)
  }

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    postRepository = mock<PostRepository>()
    uut = new ListPostsByAuthorIdUseCase(userRepository, postRepository)
  })

  it('throws an authorNotFound error' +
    ' when user repository findById resolves undefined', async () => {
    const userId = new UserId()
    givenUserRepositoryFindAllByIdsResolvesEmptyList()

    await expect(uut.execute({ userId: userId.value }))
      .rejects
      .toThrowError(ListPostsByAuthorIdError.authorNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(userId)
  })

  it('returns empty list when given post repository resolves empty list', async () => {
    const userId = new UserId()
    const user = User.create(
      {
        name: 'test-name',
        registeredAt: new Date()
      },
      userId
    )
    givenUserRepositoryFindAllByIdsResolvesUser(user)
    givenPostRepositoryFindAllResolvesEmptyList()

    const response = await uut.execute({ userId: userId.value })

    expect(response).toEqual([])
    expect(userRepository.findOneById).toHaveBeenCalledWith(userId)
    expect(postRepository.findAllByUserId).toHaveBeenCalledWith(userId)
  })

  it('returns post list when given post repository resolves posts', async () => {
    const userId = new UserId()
    const user = User.create(
      {
        name: 'test-name',
        registeredAt: new Date()
      },
      userId
    )
    givenUserRepositoryFindAllByIdsResolvesUser(user)
    const posts = createDummyPostsOrderByCreatedAt(2, userId)
    givenPostRepositoryFindAllResolvesPosts(posts)

    const response = await uut.execute({ userId: userId.value })

    expect(userRepository.findOneById).toHaveBeenCalledWith(userId)
    expect(postRepository.findAllByUserId).toHaveBeenCalledWith(userId)
    expect(response).toEqual([
      {
        id: posts[0].id.value,
        authorId: userId.value,
        username: user.name,
        title: posts[0].title,
        content: posts[0].content,
        createdAt: posts[0].createdAt
      },
      {
        id: posts[1].id.value,
        authorId: userId.value,
        username: user.name,
        title: posts[1].title,
        content: posts[1].content,
        createdAt: posts[1].createdAt
      }
    ])
  })
})
