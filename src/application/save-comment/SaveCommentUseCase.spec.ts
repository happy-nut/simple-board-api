import { mock, MockProxy } from 'jest-mock-extended'
import { UserId } from '../../domain/UserId'
import { SaveCommentUseCase } from './SaveCommentUseCase'
import { PostRepository } from '../../domain/PostRepository'
import { Post } from '../../domain/Post'
import { SaveCommentError } from './SaveCommentError'
import { User, UserRepository } from '../../domain'
import { PostId } from '../../domain/PostId'
import { CommentRepository } from '../../domain/CommentRepository'
import { Comment } from '../../domain/Comment'
import { createDummyComment, createDummyPost, createDummyUser } from '../../../test/support/utils'
import { CommentId } from '../../domain/CommentId'

describe('SaveCommentUseCase', () => {
  let userRepository: MockProxy<UserRepository>
  let postRepository: MockProxy<PostRepository>
  let commentRepository: MockProxy<CommentRepository>
  let uut: SaveCommentUseCase

  function givenUserRepositoryFindOneByIdResolvedUndefined () {
    userRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenUserRepositoryFindOneByIdResolvedUser (user: User) {
    userRepository.findOneById.mockResolvedValueOnce(user)
  }

  function givenPostRepositoryFindOneByIdResolvedUndefined () {
    postRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenPostRepositoryFindOneByIdResolvedPost (post: Post) {
    postRepository.findOneById.mockResolvedValueOnce(post)
  }

  function givenCommentRepositoryFindOneByIdResolvedUndefined () {
    commentRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenCommentRepositoryFindOneByIdResolvedComment (comment: Comment) {
    commentRepository.findOneById.mockResolvedValueOnce(comment)
  }

  function givenCommentRepositorySaveResolvedComment (comment: Comment) {
    commentRepository.save.mockResolvedValueOnce(comment)
  }


  beforeEach(() => {
    userRepository = mock()
    postRepository = mock()
    commentRepository = mock()
    uut = new SaveCommentUseCase(userRepository, postRepository, commentRepository)
  })

  it('throws authorNotFound error' +
    ' when ID is given but given user repository findOneByUd resolves undefined', async () => {
    const authorId = new UserId('test-user-id')
    givenUserRepositoryFindOneByIdResolvedUndefined()

    const request = {
      postId: 'test-post-id',
      content: 'test-content',
      authorId: 'test-user-id'
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SaveCommentError.authorNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(authorId)
  })

  it('throws postNotFound error' +
    ' when ID is not given and given post repository save resolves undefined', async () => {
    const user = createDummyUser()
    givenUserRepositoryFindOneByIdResolvedUser(user)
    const post = createDummyPost()
    givenPostRepositoryFindOneByIdResolvedUndefined()

    const request = {
      postId: post.id.value,
      content: 'test-content',
      authorId: user.id.value
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SaveCommentError.postNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(user.id)
    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
  })

  it('returns comment ID when ID is not given', async () => {
    const user = createDummyUser()
    givenUserRepositoryFindOneByIdResolvedUser(user)
    const post = createDummyPost()
    givenPostRepositoryFindOneByIdResolvedPost(post)
    const content = 'test-content'
    const comment= createDummyComment({
      authorId: user.id,
      postId: post.id,
      content
    })
    givenCommentRepositorySaveResolvedComment(comment)


    const request = {
      postId: post.id.value,
      content: content,
      authorId: user.id.value
    }
    const response = await uut.execute(request)

    expect(userRepository.findOneById).toHaveBeenCalledWith(user.id)
    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
    expect(response).toEqual({
      commentId: comment.id.value
    })
  })

  it('throws authorNotFound error' +
    ' when ID is given but given user repository findOneByUd resolves undefined', async () => {
    const authorId = new UserId('test-user-id')
    givenUserRepositoryFindOneByIdResolvedUndefined()

    const request = {
      id: new CommentId().value,
      postId: 'test-post-id',
      content: 'test-content',
      authorId: 'test-user-id'
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SaveCommentError.authorNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(authorId)
  })

  it('throws postNotFound error' +
    ' when ID is given and given post repository save resolves undefined', async () => {
    const user = createDummyUser()
    givenUserRepositoryFindOneByIdResolvedUser(user)
    const post = createDummyPost()
    givenPostRepositoryFindOneByIdResolvedUndefined()

    const request = {
      id: new CommentId().value,
      postId: post.id.value,
      content: 'test-content',
      authorId: user.id.value
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SaveCommentError.postNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(user.id)
    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
  })

  it('throws commentNotFound error' +
    ' when ID is given and given comment repository save resolves undefined', async () => {
    const user = createDummyUser()
    givenUserRepositoryFindOneByIdResolvedUser(user)
    const post = createDummyPost()
    givenPostRepositoryFindOneByIdResolvedPost(post)
    givenCommentRepositoryFindOneByIdResolvedUndefined()
    const commentId = new CommentId()

    const request = {
      id: commentId.value,
      postId: post.id.value,
      content: 'test-content',
      authorId: user.id.value
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(SaveCommentError.commentNotFound())
    expect(userRepository.findOneById).toHaveBeenCalledWith(user.id)
    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
    expect(commentRepository.findOneById).toHaveBeenCalledWith(commentId)
  })

  it('returns comment ID when ID is given', async () => {
    const user = createDummyUser()
    givenUserRepositoryFindOneByIdResolvedUser(user)
    const post = createDummyPost()
    givenPostRepositoryFindOneByIdResolvedPost(post)
    const comment = createDummyComment({
      authorId: user.id,
      postId: post.id
    })
    givenCommentRepositoryFindOneByIdResolvedComment(comment)
    givenCommentRepositorySaveResolvedComment(comment)

    const request = {
      id: comment.id.value,
      postId: post.id.value,
      content: 'new-content',
      authorId: user.id.value
    }
    const response = await uut.execute(request)

    expect(userRepository.findOneById).toHaveBeenCalledWith(user.id)
    expect(postRepository.findOneById).toHaveBeenCalledWith(post.id)
    expect(commentRepository.findOneById).toHaveBeenCalledWith(comment.id)
    expect(commentRepository.save).toHaveBeenCalledWith(Comment.create(
      {
        postId: post.id,
        authorId: user.id,
        content: 'new-content',
        createdAt: comment.createdAt
      },
      comment.id
    ))
    expect(response).toEqual({ commentId: comment.id.value })
  })
})
