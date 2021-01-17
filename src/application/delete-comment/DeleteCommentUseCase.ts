import { UseCase } from '../../shared/ddd'
import _ from 'lodash'
import { DeleteCommentError } from './DeleteCommentError'
import { COMMENT_REPOSITORY, CommentRepository } from '../../domain/CommentRepository'
import { CommentId } from '../../domain/CommentId'
import { Inject, Injectable } from '@nestjs/common'

interface DeleteCommentRequest {
  commentId: string
}

type DeleteCommentResponse = void

@Injectable()
export class DeleteCommentUseCase implements UseCase<DeleteCommentRequest, DeleteCommentResponse> {
  constructor (
    @Inject(COMMENT_REPOSITORY)
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
