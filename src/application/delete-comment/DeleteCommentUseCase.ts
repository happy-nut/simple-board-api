import { UseCase } from '../../shared/ddd'
import _ from 'lodash'
import { DeleteCommentError } from './DeleteCommentError'
import { CommentRepository } from '../../domain/CommentRepository'
import { CommentId } from '../../domain/CommentId'

interface DeleteCommentRequest {
  commentId: string
}

type DeleteCommentResponse = void

export class DeleteCommentUseCase implements UseCase<DeleteCommentRequest, DeleteCommentResponse> {
  constructor (
    private readonly commentRepository: CommentRepository
  ) {
  }

  async execute (request: DeleteCommentRequest): Promise<DeleteCommentResponse> {
    const { commentId } = request
    const comment = await this.commentRepository.findOneById(new CommentId(commentId))
    if (_.isNil(comment)) {
      throw DeleteCommentError.commentNotFound()
    }

    await this.commentRepository.removeOne(comment)
  }
}
