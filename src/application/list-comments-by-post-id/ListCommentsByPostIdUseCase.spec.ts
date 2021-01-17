import { mock, MockProxy } from 'jest-mock-extended'
import { UserRepository } from '../../domain'
import { CommentRepository } from '../../domain/CommentRepository'
import { Comment } from '../../domain/Comment'
import { ListCommentsByPostIdUseCase } from './ListCommentsByPostIdUseCase'
import { ListCommentsByPostIdError } from './ListCommentsByPostIdError'
import {
  createDummyCommentsOrderByCreatedAt,
  createDummyPost, createDummyUser
} from '../../../test/support/utils'
import { PostRepository } from '../../domain/PostRepository'
import { Post } from '../../domain/Post'
import { PostId } from '../../domain/PostId'
import { Users } from '../../domain/Users'

describe('ListCommentsByPostIdUseCase', () => {
  let postRepository: MockProxy<PostRepository>
  let userRepository: MockProxy<UserRepository>
  let commentRepository: MockProxy<CommentRepository>
  let uut: ListCommentsByPostIdUseCase

  function givenPostRepositoryFindAllByIdsResolvedUndefined () {
    postRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenPostRepositoryFindAllByIdsResolvedPost (post: Post) {
    postRepository.findOneById.mockResolvedValueOnce(post)
  }

  function givenCommentRepositoryFindAllByPostIdResolvedComments (comments: Comment[]) {
    commentRepository.findAllByPostId.mockResolvedValueOnce(comments)
  }

  function givenUserRepositoryFindAllByIdsResolvedUsers (users: Users) {
    userRepository.findAllByIds.mockResolvedValueOnce(users)
  }

  beforeEach(() => {
    postRepository = mock()
    commentRepository = mock()
    userRepository = mock()
    uut = new ListCommentsByPostIdUseCase(postRepository, commentRepository, userRepository)
  })

  it('throws an postNotFound error' +
    ' when post repository findById resolves undefined', async () => {
    givenPostRepositoryFindAllByIdsResolvedUndefined()
    const postId = new PostId()

    await expect(uut.execute({ postId: postId.value, skip: 0, take: 100 }))
      .rejects
      .toThrowError(ListCommentsByPostIdError.postNotFound())
    expect(postRepository.findOneById).toHaveBeenCalledWith(postId)
  })

  it('returns empty list when given comment repository resolves empty list', async () => {
    const post = createDummyPost()
    givenPostRepositoryFindAllByIdsResolvedPost(post)
    givenCommentRepositoryFindAllByPostIdResolvedComments([])

    const response = await uut.execute({ postId: post.id.value, skip: 0, take: 100 })

    expect(response).toEqual([])
    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
    expect(commentRepository.findAllByPostId).toHaveBeenCalledWith(post.id, 0, 100)
  })

  it('returns comment list when given comment repository resolves comments', async () => {
    const post = createDummyPost()
    givenPostRepositoryFindAllByIdsResolvedPost(post)
    const user = createDummyUser()
    const comments = createDummyCommentsOrderByCreatedAt(2, user.id, post.id)
    givenCommentRepositoryFindAllByPostIdResolvedComments(comments)
    givenUserRepositoryFindAllByIdsResolvedUsers(new Users([user]))

    const response = await uut.execute({ postId: post.id.value, skip: 0, take: 100 })

    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
    expect(commentRepository.findAllByPostId).toHaveBeenCalledWith(post.id, 0, 100)
    expect(response).toEqual([
      {
        id: comments[0].id.value,
        authorId: comments[0].authorId.value,
        username: user.name,
        content: comments[0].content,
        createdAt: comments[0].createdAt
      },
      {
        id: comments[1].id.value,
        authorId: comments[1].authorId.value,
        username: user.name,
        content: comments[1].content,
        createdAt: comments[1].createdAt
      }
    ])
  })
})
