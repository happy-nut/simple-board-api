import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'DeleteCommentError.COMMENT_NOT_FOUND'

export class DeleteCommentError extends UseCaseError<ErrorCodes> {
  static commentNotFound (): DeleteCommentError {
    return new DeleteCommentError('DeleteCommentError.COMMENT_NOT_FOUND')
  }
}
