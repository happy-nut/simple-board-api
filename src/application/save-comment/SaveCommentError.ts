import { UseCaseError } from '../../shared/ddd'

export enum SaveCommentErrorCodes {
  AUTHOR_NOT_FOUND,
  POST_NOT_FOUND,
  COMMENT_NOT_FOUND
}

export class SaveCommentError extends UseCaseError<SaveCommentErrorCodes> {
  // Create errors.
  static authorNotFound (): SaveCommentError {
    return new SaveCommentError(SaveCommentErrorCodes.AUTHOR_NOT_FOUND)
  }

  static postNotFound (): SaveCommentError {
    return new SaveCommentError(SaveCommentErrorCodes.POST_NOT_FOUND)
  }

  // Update errors.
  static commentNotFound (): SaveCommentError {
    return new SaveCommentError(SaveCommentErrorCodes.COMMENT_NOT_FOUND)
  }
}
