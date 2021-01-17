import { UserRepository } from '../../domain'
import { UseCase } from '../../shared/ddd'
import { CommentRepository } from '../../domain/CommentRepository'
import _ from 'lodash'
import { ListCommentsByAuthorIdError } from './ListCommentsByAuthorIdError'
import { UserId } from '../../domain/UserId'

interface ListCommentsByAuthorIdRequest {
  authorId: string
}

interface Comment {
  id: string
  authorId: string
  username: string
  content: string
  createdAt: Date
}

export type ListCommentsByAuthorIdResponse = Comment[]

export class ListCommentsByAuthorIdUseCase
implements UseCase<ListCommentsByAuthorIdRequest, ListCommentsByAuthorIdResponse> {
  constructor (
    private readonly userRepository: UserRepository,
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
      authorId: user.id.value,
      username: user.name,
      content: comment.content,
      createdAt: comment.createdAt
    }))
  }
}
