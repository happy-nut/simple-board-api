import { mock, MockProxy } from 'jest-mock-extended'
import { UserId } from '../../domain/UserId'
import { SavePostUseCase } from './SavePostUseCase'
import { PostRepository } from '../../domain/PostRepository'
import { Post } from '../../domain/Post'
import { SavePostError } from './SavePostError'

describe('SavePostUseCase', () => {
  let postRepository: MockProxy<PostRepository>
  let uut: SavePostUseCase

  function givenRepositorySaveResolvesUndefined () {
    postRepository.save.mockResolvedValueOnce(undefined)
  }

  function givenRepositorySaveResolvesUser (post: Post) {
    postRepository.save.mockResolvedValueOnce(post)
  }

  beforeEach(() => {
    postRepository = mock<PostRepository>()
    uut = new SavePostUseCase(postRepository)
  })

  it('responses nothing', async () => {
    const title = 'test-title'
    const content = 'test-content'
    const authorId = new UserId('test-user-id')
    givenRepositorySaveResolvesUser(Post.createNew(
      {
        title,
        content,
        authorId
      }
    ))

    const request = {
      title,
      content,
      authorId: 'test-user-id'
    }
    const response = await uut.execute(request)

    expect(postRepository.save).toHaveBeenCalled()
    expect(response).toBeUndefined()
  })

  it('throws an error when given repository save resolves undefined', async () => {
    givenRepositorySaveResolvesUndefined()

    const request = {
      title: 'test-title',
      content: 'test-content',
      authorId: 'test-user-id'
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SavePostError.postSavingFailed())
    expect(postRepository.save).toHaveBeenCalled()
  })
})
