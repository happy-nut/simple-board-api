import { PostRepository } from '../../domain/PostRepository'
import { mock, MockProxy } from 'jest-mock-extended'
import { Post } from '../../domain/Post'
import { DeletePostUseCase } from './DeletePostUseCase'
import { DeletePostError } from './DeletePostError'
import { PostId } from '../../domain/PostId'
import { createDummyPost } from '../../../test/support/utils'

describe('DeletePostUseCase', () => {
  const POST_ID = 'test-post-id'

  let postRepository: MockProxy<PostRepository>
  let uut: DeletePostUseCase

  function givenRepositoryFindOneByIdResolvesUndefined () {
    postRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenRepositoryFindOneByIdResolvesPost (post: Post) {
    postRepository.findOneById.mockResolvedValueOnce(post)
  }

  beforeEach(() => {
    postRepository = mock()
    uut = new DeletePostUseCase(postRepository)
  })

  it('throws postNotFound error when given repository resolves with undefined', async () => {
    givenRepositoryFindOneByIdResolvesUndefined()

    await expect(uut.execute({ postId: POST_ID }))
      .rejects
      .toThrow(DeletePostError.postNotFound())

    expect(postRepository.findOneById).toHaveBeenCalledWith(new PostId(POST_ID))
  })

  it('responds nothing when given repository resolves a post', async () => {
    const postId = new PostId(POST_ID)
    const post = createDummyPost({}, postId)
    givenRepositoryFindOneByIdResolvesPost(post)

    const response = await uut.execute({ postId: POST_ID })

    expect(postRepository.findOneById).toHaveBeenCalledWith(postId)
    expect(postRepository.removeOne).toHaveBeenCalledWith(post)
    expect(response).toBeUndefined()
  })
})
