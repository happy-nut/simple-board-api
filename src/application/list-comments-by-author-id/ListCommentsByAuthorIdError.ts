import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'ListCommentsByAuthorIdError.AUTHOR_NOT_FOUND'

export class ListCommentsByAuthorIdError extends UseCaseError<ErrorCodes> {
  static authorNotFound (): ListCommentsByAuthorIdError {
    return new ListCommentsByAuthorIdError('ListCommentsByAuthorIdError.AUTHOR_NOT_FOUND')
  }
}
