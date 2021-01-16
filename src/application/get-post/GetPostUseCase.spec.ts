import { mock, MockProxy } from 'jest-mock-extended'
import { User, UserRepository } from '../../domain'
import { GetPostUseCase } from './GetPostUseCase'
import { PostRepository } from '../../domain/PostRepository'
import { Post, PostId } from '../../domain/Post'
import { GetPostError } from './GetPostError'
import { createDummyPost, createDummyUser } from '../../../test/support/utils'

describe('GetUserUseCase', () => {
  let userRepository: MockProxy<UserRepository>
  let postRepository: MockProxy<PostRepository>
  let uut: GetPostUseCase

  function givenPostRepositoryFindOneByIdResolvesUndefined () {
    postRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenPostRepositoryFindOneByIdResolvedPost (post: Post) {
    postRepository.findOneById.mockResolvedValueOnce(post)
  }

  function givenUserRepositoryFindOneByIdResolvedUndefined () {
    userRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenUserRepositoryFindOneByIdResolvedUser (user: User) {
    userRepository.findOneById.mockResolvedValueOnce(user)
  }

  beforeEach(() => {
    userRepository = mock()
    postRepository = mock()
    uut = new GetPostUseCase(postRepository, userRepository)
  })

  it('throws an error when post repository findOneById resolves undefined', async () => {
    givenPostRepositoryFindOneByIdResolvesUndefined()
    const postId = new PostId()

    const request = {
      id: postId.value
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(GetPostError.postNotFound())
    expect(postRepository.findOneById).toHaveBeenCalledWith(postId)
  })

  it('throws an error when user repository findOneById resolves undefined', async () => {
    const post = createDummyPost()
    givenPostRepositoryFindOneByIdResolvedPost(post)
    givenUserRepositoryFindOneByIdResolvedUndefined()

    const request = {
      id: post.id.value
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(GetPostError.authorNotFound())
    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
    expect(userRepository.findOneById).toHaveBeenCalledWith(post.authorId)
  })

  it('returns post with of given ID', async () => {
    const user = createDummyUser()
    const post = createDummyPost({ authorId: user.id })
    givenPostRepositoryFindOneByIdResolvedPost(post)
    givenUserRepositoryFindOneByIdResolvedUser(user)

    const request = {
      id: post.id.value
    }
    const response = await uut.execute(request)

    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
    expect(userRepository.findOneById).toHaveBeenCalledWith(user.id)
    expect(response).toEqual({
      id: post.id.value,
      authorId: post.authorId.value,
      authorName: user.name,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt
    })
  })
})
