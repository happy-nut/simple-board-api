import { USER_REPOSITORY, UserRepository } from '../../domain'
import { UseCase } from '../../shared/ddd'
import { COMMENT_REPOSITORY, CommentRepository } from '../../domain/CommentRepository'
import _ from 'lodash'
import { ListCommentsByAuthorIdError } from './ListCommentsByAuthorIdError'
import { UserId } from '../../domain/UserId'
import { Inject, Injectable } from '@nestjs/common'

interface ListCommentsByAuthorIdRequest {
  authorId: string
}

interface Comment {
  id: string
  postId: string
  username: string
  content: string
  createdAt: Date
}

export type ListCommentsByAuthorIdResponse = Comment[]

@Injectable()
export class ListCommentsByAuthorIdUseCase
implements UseCase<ListCommentsByAuthorIdRequest, ListCommentsByAuthorIdResponse> {
  constructor (
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository
  ) {
  }

  async execute (request: ListCommentsByAuthorIdRequest): Promise<ListCommentsByAuthorIdResponse> {
    const { authorId } = request
    const userId = new UserId(authorId)
    const user = await this.userRepository.findOneById(userId)
    if (_.isNil(user)) {
      throw ListCommentsByAuthorIdError.authorNotFound()
    }

    const comments = await this.commentRepository.findAllByUserId(userId)
    return _.map(comments, (comment) => ({
      id: comment.id.value,
      postId: comment.postId.value,
      username: user.name,
      content: comment.content,
      createdAt: comment.createdAt
    }))
  }
}
