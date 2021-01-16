import { mock, MockProxy } from 'jest-mock-extended'
import { User, UserRepository } from '../../domain'
import { UserId } from '../../domain/UserId'
import { ListPostsUseCase } from './ListPostsUseCase'
import { PostRepository } from '../../domain/PostRepository'
import { Post } from '../../domain/Post'
import _ from 'lodash'
import { ListPostsError } from './ListPostsError'
import { Users } from '../../domain/Users'

describe('ListPostsUseCase', () => {
  let postRepository: MockProxy<PostRepository>
  let userRepository: MockProxy<UserRepository>
  let uut: ListPostsUseCase

  function createGivenNumberOfPosts (numberOfPosts: number): Post[] {
    return _.times(numberOfPosts, (i) => Post.createNew(
      {
        content: `test-content-${i}`,
        title: `test-title-${i}`,
        authorId: new UserId(`test-user-id-${i}`)
      }
    ))
  }

  function createGivenNumberOfUsers (numberOfUsers: number): User[] {
    return _.times(numberOfUsers, (i) => User.create(
      {
        name: `test-name-${i}`,
        registeredAt: new Date()
      },
      new UserId(`test-user-id-${i}`)
    ))
  }

  function givenPostRepositoryFindAllResolvesEmptyList () {
    postRepository.findAll.mockResolvedValueOnce([])
  }

  function givenPostRepositoryFindAllResolvesPosts (posts: Post[]) {
    postRepository.findAll.mockResolvedValueOnce(posts)
  }

  function givenUserRepositoryFindAllByIdsResolvesEmptyList () {
    userRepository.findAllByIds.mockResolvedValueOnce(new Users([]))
  }

  function givenUserRepositoryFindAllByIdsResolvesUsers (users: User[]) {
    userRepository.findAllByIds.mockResolvedValueOnce(new Users(users))
  }

  beforeEach(() => {
    postRepository = mock<PostRepository>()
    userRepository = mock<UserRepository>()
    uut = new ListPostsUseCase(postRepository, userRepository)
  })

  it('responses empty list when given post repository resolves empty list', async () => {
    givenPostRepositoryFindAllResolvesEmptyList()

    const result = await uut.execute({})

    expect(postRepository.findAll).toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('throws an authorNotFound error' +
    ' when given repository findById resolves undefined', async () => {
    const posts = createGivenNumberOfPosts(2)
    givenPostRepositoryFindAllResolvesPosts(posts)
    givenUserRepositoryFindAllByIdsResolvesEmptyList()

    await expect(uut.execute({}))
      .rejects
      .toThrowError(ListPostsError.authorNotFound())
    expect(postRepository.findAll).toHaveBeenCalled()
    expect(userRepository.findAllByIds).toHaveBeenCalled()
  })

  it('responses posts', async () => {
    const posts = createGivenNumberOfPosts(2)
    givenPostRepositoryFindAllResolvesPosts(posts)
    const users = createGivenNumberOfUsers(2)
    givenUserRepositoryFindAllByIdsResolvesUsers(users)

    const request = {
      skip: 5,
      take: 2
    }
    const response = await uut.execute(request)

    expect(postRepository.findAll).toHaveBeenCalled()
    expect(userRepository.findAllByIds).toHaveBeenCalled()
    expect(response.length).toBe(2)
    expect(response[0].createdAt).toEqual<Date>(posts[0].createdAt)
    expect(response[0].title).toBe(posts[0].title)
    expect(response[0].username).toBe(users[0].name)
    expect(response[0].id).toBe(posts[0].id.value)
    expect(response[1].createdAt).toEqual<Date>(posts[1].createdAt)
    expect(response[1].title).toBe(posts[1].title)
    expect(response[1].username).toBe(users[1].name)
    expect(response[1].id).toBe(posts[1].id.value)
  })
})
