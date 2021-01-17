import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'COMMENT_ERROR_AUTHOR_NOT_FOUND'
  | 'COMMENT_ERROR_POST_NOT_FOUND'
  | 'COMMENT_ERROR_COMMENT_NOT_FOUND'

export class SaveCommentError extends UseCaseError<ErrorCodes> {
  // Create errors.
  static authorNotFound (): SaveCommentError {
    return new SaveCommentError('COMMENT_ERROR_AUTHOR_NOT_FOUND')
  }

  static postNotFound (): SaveCommentError {
    return new SaveCommentError('COMMENT_ERROR_POST_NOT_FOUND')
  }

  // Update errors.
  static commentNotFound (): SaveCommentError {
    return new SaveCommentError('COMMENT_ERROR_COMMENT_NOT_FOUND')
  }
}
