import { UseCase } from '../../shared/ddd'
import { COMMENT_REPOSITORY, CommentRepository } from '../../domain/CommentRepository'
import _ from 'lodash'
import { ListCommentsByPostIdError } from './ListCommentsByPostIdError'
import { POST_REPOSITORY, PostRepository } from '../../domain/PostRepository'
import { User, USER_REPOSITORY, UserRepository } from '../../domain'
import { PostId } from '../../domain/PostId'
import { Inject, Injectable } from '@nestjs/common'

interface ListCommentsByPostIdRequest {
  postId: string
}

interface Comment {
  id: string
  authorId: string
  username: string
  content: string
  createdAt: Date
}

export type ListCommentsByPostIdResponse = Comment[]

@Injectable()
export class ListCommentsByPostIdUseCase
implements UseCase<ListCommentsByPostIdRequest, ListCommentsByPostIdResponse> {
  constructor (
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {
  }

  async execute (request: ListCommentsByPostIdRequest): Promise<ListCommentsByPostIdResponse> {
    const { postId: postIdString } = request
    const postId = new PostId(postIdString)
    const post = await this.postRepository.findOneById(postId)
    if (_.isNil(post)) {
      throw ListCommentsByPostIdError.postNotFound()
    }

    const comments = await this.commentRepository.findAllByPostId(postId)
    if (_.isEmpty(comments)) {
      return []
    }

    const authorIds = _.map(comments, (comment) => comment.authorId)
    const users = await this.userRepository.findAllByIds(authorIds)

    return _.map(comments, (comment) => {
      const user = users.get(comment.authorId) as User
      return {
        id: comment.id.value,
        authorId: comment.authorId.value,
        username: user.name,
        content: comment.content,
        createdAt: comment.createdAt
      }
    })
  }
}
