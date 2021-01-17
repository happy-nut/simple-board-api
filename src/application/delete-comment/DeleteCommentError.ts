import { UseCaseError } from '../../shared/ddd'

export enum DeleteCommentErrorCodes {
  NOT_FOUND
}

export class DeleteCommentError extends UseCaseError<DeleteCommentErrorCodes> {
  static commentNotFound (): DeleteCommentError {
    return new DeleteCommentError(DeleteCommentErrorCodes.NOT_FOUND)
  }
}
