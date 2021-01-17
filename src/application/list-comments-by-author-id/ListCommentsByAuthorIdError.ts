import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'AUTHOR_NOT_FOUND'

export class ListCommentsByAuthorIdError extends UseCaseError<ErrorCodes> {
  static authorNotFound (): ListCommentsByAuthorIdError {
    return new ListCommentsByAuthorIdError('AUTHOR_NOT_FOUND')
  }
}
