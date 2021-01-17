import { mock, MockProxy } from 'jest-mock-extended'
import { UserId } from '../../domain/UserId'
import { SavePostUseCase } from './SavePostUseCase'
import { PostRepository } from '../../domain/PostRepository'
import { Post} from '../../domain/Post'
import { SavePostError } from './SavePostError'
import { User, UserRepository } from '../../domain'
import { PostId } from '../../domain/PostId'

describe('SavePostUseCase', () => {
  let userRepository: MockProxy<UserRepository>
  let postRepository: MockProxy<PostRepository>
  let uut: SavePostUseCase

  function givenPostRepositorySaveResolvesUndefined () {
    postRepository.save.mockResolvedValueOnce(undefined)
  }

  function givenPostRepositorySaveResolvesPost (post: Post) {
    postRepository.save.mockResolvedValueOnce(post)
  }

  function givenPostRepositoryFindOneByIdResolvesUndefined () {
    postRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenPostRepositoryFindOneByIdResolvesPost (post: Post) {
    postRepository.findOneById.mockResolvedValueOnce(post)
  }

  function givenUserRepositoryFindOneByIdResolvesUndefined () {
    userRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenUserRepositoryFindOneByIdResolvesUser (user: User) {
    userRepository.findOneById.mockResolvedValueOnce(user)
  }


  beforeEach(() => {
    userRepository = mock()
    postRepository = mock()
    uut = new SavePostUseCase(postRepository, userRepository)
  })

  it('throws authorNotFound error' +
    ' when ID is given but given user repository findOneByUd resolves undefined', async () => {
    const authorId = new UserId('test-user-id')
    givenUserRepositoryFindOneByIdResolvesUndefined()

    const request = {
      id: 'test-post-id',
      title: 'test-title',
      content: 'test-content',
      authorId: 'test-user-id'
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SavePostError.authorNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(authorId)
  })

  it('throws postCreatingFailed error' +
    ' when ID is not given and given post repository save resolves undefined', async () => {
    const title = 'test-title'
    const content = 'test-content'
    const authorId = new UserId('test-user-id')
    givenUserRepositoryFindOneByIdResolvesUser(User.create(
      {
        name: 'test-user-name',
        registeredAt: new Date()
      },
      authorId
    ))
    givenPostRepositorySaveResolvesUndefined()

    const request = {
      title,
      content,
      authorId: 'test-user-id'
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SavePostError.postCreatingFailed())
    expect(userRepository.findOneById).toHaveBeenCalledWith(authorId)
    expect(postRepository.save).toHaveBeenCalledWith(Post.create(
      {
        title,
        content,
        authorId,
        createdAt: expect.any(Date)
      },
      expect.any(PostId)
    ))
  })

  it('responds nothing and creates a post when ID is not given', async () => {
    const title = 'test-title'
    const content = 'test-content'
    const authorId = new UserId('test-user-id')
    givenUserRepositoryFindOneByIdResolvesUser(User.create(
      {
        name: 'test-user-name',
        registeredAt: new Date()
      },
      authorId
    ))
    const post = Post.createNew(
      {
        title,
        content,
        authorId
      }
    )
    givenPostRepositorySaveResolvesPost(post)

    const request = {
      title,
      content,
      authorId: 'test-user-id'
    }
    const response = await uut.execute(request)

    expect(userRepository.findOneById).toHaveBeenCalledWith(authorId)
    expect(postRepository.save).toHaveBeenCalledWith(Post.create(
      {
        title,
        content,
        authorId,
        createdAt: expect.any(Date)
      },
      expect.any(PostId)
    ))
    expect(response).toEqual({
      postId: post.id.value
    })
  })

  it('throws postNotFound error' +
    ' when ID is given and given post repository findsOneById resolves undefined', async () => {
    const title = 'test-title'
    const content = 'test-content'
    const authorId = new UserId('test-user-id')
    givenUserRepositoryFindOneByIdResolvesUser(User.create(
      {
        name: 'test-user-name',
        registeredAt: new Date()
      },
      authorId
    ))
    givenPostRepositoryFindOneByIdResolvesUndefined()

    const request = {
      id: 'test-post-id',
      title,
      content,
      authorId: 'test-user-id'
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SavePostError.postNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(authorId)
    expect(postRepository.findOneById).toHaveBeenCalledWith(new PostId('test-post-id'))
  })

  it('responds nothing and updates a post when ID is given', async () => {
    const authorId = new UserId('test-user-id')
    givenUserRepositoryFindOneByIdResolvesUser(User.create(
      {
        name: 'test-user-name',
        registeredAt: new Date()
      },
      authorId
    ))
    const title = 'test-title'
    const content = 'test-content'
    const post = Post.createNew(
      {
        title,
        content,
        authorId
      }
    )
    givenPostRepositoryFindOneByIdResolvesPost(post)
    givenPostRepositorySaveResolvesPost(Post.create(
      {
        title: 'test-title-2',
        content: 'test-content-2',
        authorId: authorId,
        createdAt: post.createdAt
      },
      post.id
    ))

    const request = {
      id: post.id.value,
      title: 'test-title-2',
      content: 'test-content-2',
      authorId: 'test-user-id'
    }
    const response = await uut.execute(request)
    expect(userRepository.findOneById).toHaveBeenCalledWith(authorId)
    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
    expect(postRepository.save).toHaveBeenCalledWith(Post.create(
      {
        title: 'test-title-2',
        content: 'test-content-2',
        authorId: authorId,
        createdAt: post.createdAt
      },
      post.id
    ))
    expect(response).toEqual({
      postId: post.id.value
    })
  })
})
